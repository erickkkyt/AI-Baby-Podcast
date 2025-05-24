import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server'; // User-context client

export async function POST(request: Request) {
  const supabaseUserClient = await createServerSupabaseClient(); 

  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();

  if (authError || !user) {
    console.warn('[Submit API] Authentication error or no user session:', authError?.message);
    return NextResponse.json({ message: 'Authentication required. Please log in.' }, { status: 401 });
  }
  console.log(`[Submit API] Authenticated User ID: ${user.id}`);

  try {
    const { ethnicity, hair, topic } = await request.json();

    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://kkkkeric.app.n8n.cloud/webhook/1ef488b4-7772-4eca-9eed-c90662566cea'; 

    if (!n8nApiKey || !n8nWebhookUrl) {
      console.error('[Submit API] N8N_API_KEY or N8N_WEBHOOK_URL is not properly configured.');
      return NextResponse.json({ message: 'Server configuration error: N8N integration details missing.' }, { status: 500 });
    }
    
    if (!ethnicity || !hair || !topic) {
        return NextResponse.json({ message: 'Missing required fields: ethnicity, hair, or topic.' }, { status: 400 });
    }

    const jobId = uuidv4();
    console.log(`[Submit API] Generated Job ID for RPC: ${jobId}`);

    // 1. 获取用户当前积分
    const { data: userProfile, error: profileError } = await supabaseUserClient
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error(`[Submit API] Error fetching user profile for ${user.id}:`, profileError.message);
      return NextResponse.json({ message: 'Failed to fetch user profile.', error_code: 'PROFILE_FETCH_FAILED' }, { status: 500 });
    }

    if (!userProfile || userProfile.credits === undefined) {
      console.error(`[Submit API] User profile or credits not found for ${user.id}.`);
      // 这可能意味着新用户触发器未正确设置，或者用户配置文件表有问题
      return NextResponse.json({ message: 'User profile or credits information missing.', error_code: 'PROFILE_CREDITS_MISSING' }, { status: 500 });
    }
    
    console.log(`[Submit API] User ${user.id} current credits: ${userProfile.credits}`);

    // ++++ START CHECK FOR EXISTING PROCESSING PROJECT ++++
    const { data: existingProcessingProject, error: existingProjectError } = await supabaseUserClient
      .from('projects')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .maybeSingle(); // Use maybeSingle as we expect 0 or 1

    if (existingProjectError) {
      console.error(`[Submit API] Error checking for existing processing projects for user ${user.id}:`, existingProjectError.message);
      return NextResponse.json({ message: 'Failed to check for existing projects. Please try again.', error_code: 'EXISTING_PROJECT_CHECK_FAILED' }, { status: 500 });
    }

    if (existingProcessingProject) {
      console.warn(`[Submit API] User ${user.id} already has a project with status 'processing' (ID: ${existingProcessingProject.id}). New project submission denied.`);
      return NextResponse.json({
        message: 'There is a task currently in progress. Please wait for it to complete before starting a new one.',
        error_code: 'ACTIVE_PROJECT_LIMIT_REACHED'
      }, { status: 409 }); // 409 Conflict is appropriate here
    }
    // ++++ END CHECK FOR EXISTING PROCESSING PROJECT ++++

    // 2. 检查用户积分是否 > 0
    if (userProfile.credits <= 0) {
      console.warn(`[Submit API] User ${user.id} has insufficient credits (${userProfile.credits}) to create a new project.`);
      return NextResponse.json({ 
        message: "No credits left. Please check out the plan or wait for a top-up.", // 更通用的消息
        error_code: 'INSUFFICIENT_CREDITS' 
      }, { status: 402 }); // 402 Payment Required
    }

    console.log(`[Submit API] Calling RPC 'create_initial_project' for job ${jobId} by user ${user.id}`);
    const { data: newProjectData, error: rpcError } = await supabaseUserClient.rpc(
      'create_initial_project', 
      {
        p_user_id: user.id, // 显式传递 user_id
        p_job_id: jobId,
        p_ethnicity: String(ethnicity),
        p_hair: String(hair),
        p_topic: String(topic)
      }
    );

    if (rpcError) {
      console.error(`[Submit API] RPC call 'create_initial_project' failed for job ${jobId}:`, rpcError);
      // Ensure that what's passed in 'details' is serializable and informative, not the whole object
      const errorDetailsString = typeof rpcError.details === 'string' ? rpcError.details :
                                 rpcError.message ? `${rpcError.message} (Code: ${rpcError.code || 'N/A'})` :
                                 JSON.stringify(rpcError); // Fallback to stringifying the whole rpcError if no better detail found

      return NextResponse.json({ 
        message: 'Failed to process request due to a database function error.', 
        error: rpcError.message, // This is already good
        details: errorDetailsString, // Pass a string representation
        error_code: 'RPC_CALL_FAILED' 
      }, { status: 500 });
    }

    // Extract the actual project data, expecting an array with one element from RETURNS TABLE
    const newProjectEntity = Array.isArray(newProjectData) && newProjectData.length > 0 ? newProjectData[0] : null;

    // New error handling based on RPC's { status: 'error', code: '...', message: '...' } structure
    // This typically applies if the RPC itself is designed to return an error object directly, not a PostgREST error
    if (newProjectEntity && typeof newProjectEntity === 'object' && 'status' in newProjectEntity && newProjectEntity.status === 'error') {
      console.warn(`[Submit API] RPC returned an application error for job ${jobId}: Code='${newProjectEntity.code}', Message='${newProjectEntity.message}', Details: '${newProjectEntity.details}'`);
      if (newProjectEntity.code === 'insufficient_credits') {
        return NextResponse.json({ 
          message: "No credits left. Please check out the plan.",
          error_code: 'INSUFFICIENT_CREDITS',
        }, { status: 402 });
      } else if (newProjectEntity.code === 'unauthorized') { 
         return NextResponse.json({ 
           message: newProjectEntity.message || 'Unauthorized to perform this action.', 
           error_code: 'UNAUTHORIZED_RPC_ACTION'
         }, { status: 401 });
      }
      // Generic error message for other RPC logic errors defined in your RPC
      return NextResponse.json({ 
        message: newProjectEntity.message || 'Failed to process project due to a transaction error.', 
        error_code: newProjectEntity.code || 'RPC_LOGIC_ERROR', 
        details: typeof newProjectEntity.details === 'string' ? newProjectEntity.details : JSON.stringify(newProjectEntity.details) 
      }, { status: 500 });
    }
    
    // Adjusted success check: RPC success means newProjectEntity contains the job_id
    // and is an object (not null, undefined, or a primitive)
    if (!newProjectEntity || typeof newProjectEntity !== 'object' || !newProjectEntity.job_id || newProjectEntity.job_id !== jobId) {
        console.error(`[Submit API] RPC 'create_initial_project' for job ${jobId} did not return the expected project data. Actual (processed) response:`, newProjectEntity, "Original RPC result:", newProjectData);
        
        const responseDetailsString = typeof newProjectData === 'object' ? JSON.stringify(newProjectData) : String(newProjectData);

        return NextResponse.json({ 
          message: 'Project creation initiated, but confirmation details from RPC were unexpected or missing critical data.', 
          error_code: 'RPC_UNEXPECTED_RESPONSE_SHAPE',
          details: responseDetailsString 
        }, { status: 500 });
    }

    // Log the project details
    console.log(`[Submit API] RPC 'create_initial_project' success for job ${jobId}. Project created. Details:`, newProjectEntity);

    const requestBodyToN8n = { jobId, ethnicity: String(ethnicity), hair: String(hair), topic: String(topic) };
    // === BEGINNING OF N8N CALL MODIFICATIONS AND LOGGING ===
    const actualN8nApiHeaderName = 'N8N-API-KEY'; // Corrected Header Name

    console.log('[Submit API Vercel N8N] Attempting to call N8N webhook.');
    console.log('[Submit API Vercel N8N] Target URL:', n8nWebhookUrl);
    console.log('[Submit API Vercel N8N] API Key (first 5 chars):', n8nApiKey ? n8nApiKey.substring(0, 5) + '...' : 'Not Set or Empty');
    console.log('[Submit API Vercel N8N] Actual API Key Header Name being used:', actualN8nApiHeaderName);
    console.log(`[Submit API Vercel N8N] Sending POST request to n8n for job ${jobId}. Payload:`, JSON.stringify(requestBodyToN8n));

    const headersForN8n: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (actualN8nApiHeaderName && n8nApiKey) {
        headersForN8n[actualN8nApiHeaderName] = n8nApiKey;
    } else {
        // This log helps confirm if the key or header name was unexpectedly empty
        console.warn('[Submit API Vercel N8N] N8N API Key or the defined Header Name is missing/empty. Auth header will not be correctly set.');
    }
    console.log('[Submit API Vercel N8N] Request Headers being sent to N8N:', JSON.stringify(headersForN8n));
    
    // Fire-and-forget n8n webhook call
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: headersForN8n, // Use the constructed headers
      body: JSON.stringify(requestBodyToN8n),
    }).then(async response => {
      const responseText = await response.text(); 
      // Log N8N's response status and full text body for debugging
      console.log(`[Submit API Vercel N8N] N8N Response Status for job ${jobId}: ${response.status}`);
      console.log(`[Submit API Vercel N8N] N8N Response Text for job ${jobId}:`, responseText);

      if (!response.ok) {
        console.error(`[Submit API Vercel N8N] Error submitting job ${jobId} to n8n. Status: ${response.status}. (Full Response Text logged above)`);
      } else {
        console.log(`[Submit API Vercel N8N] Job ${jobId} successfully submitted to n8n. Status: ${response.status}. (Full Response Text logged above)`);
      }
    }).catch(error => {
      const networkErrorMessage = error instanceof Error ? error.message : String(error);
      // Log the full error object for more details on network failures
      console.error(`[Submit API Vercel N8N] Network error calling n8n for job ${jobId}:`, networkErrorMessage, error);
    });
    // === END OF N8N CALL MODIFICATIONS AND LOGGING ===

    // Adjust final success response to use newProjectEntity directly as project details
    return NextResponse.json({ 
      message: 'Request received, project creation initiated, and processing started.', 
      status: newProjectEntity.status || 'processing', 
      jobId: newProjectEntity.job_id,
      projectDetails: newProjectEntity 
    });

  } catch (error: unknown) { 
    const criticalErrorMessage = error instanceof Error ? error.message : String(error);
    const criticalErrorStack = error instanceof Error ? error.stack : undefined;
    console.error('[Submit API] Critical error in POST handler:', criticalErrorMessage, criticalErrorStack);
    return NextResponse.json({ message: 'Internal Server Error. Please try again later.', error: criticalErrorMessage }, { status: 500 });
  }
}