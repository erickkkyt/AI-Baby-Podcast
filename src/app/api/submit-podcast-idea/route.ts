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
    const { 
      ethnicity, 
      hair, 
      topic, 
      videoResolution, 
      aspectRatio 
    } = await request.json();

    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://kkkkeric.app.n8n.cloud/webhook/1ef488b4-7772-4eca-9eed-c90662566cea'; 

    // Validation for new parameters
    if (!videoResolution || !['540p', '720p'].includes(videoResolution)) {
        return NextResponse.json({ message: 'Missing or invalid field: videoResolution. Must be "540p" or "720p".' }, { status: 400 });
    }
    if (!aspectRatio || !['1:1', '16:9', '9:16'].includes(aspectRatio)) {
        return NextResponse.json({ message: 'Missing or invalid field: aspectRatio. Must be "1:1", "16:9", or "9:16".' }, { status: 400 });
    }
    
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

    console.log(`[Submit API] Calling RPC 'create_initial_project' for job ${jobId} by user ${user.id} with resolution: ${videoResolution}, aspect ratio: ${aspectRatio}`);
    const { data: newProjectData, error: rpcError } = await supabaseUserClient.rpc(
      'create_initial_project', 
      {
        p_user_id: user.id, 
        p_job_id: jobId,
        p_ethnicity: String(ethnicity),
        p_hair: String(hair),
        p_topic: String(topic),
        p_creation_type: 'features',
        p_image_url: null,
        p_video_resolution: videoResolution,
        p_aspect_ratio: aspectRatio 
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

    const requestBodyToN8n = { 
        jobId: newProjectEntity.job_id, 
        ethnicity: String(ethnicity), 
        hair: String(hair), 
        topic: String(topic),
        videoResolution: videoResolution,
        aspectRatio: aspectRatio
    };
    // === BEGINNING OF N8N CALL MODIFICATIONS AND LOGGING ===
    const actualN8nApiHeaderName = 'N8N_API_KEY'; // CORRECTED back to underscore

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
        console.warn('[Submit API Vercel N8N] N8N API Key or the defined Header Name is missing/empty. Auth header will not be correctly set.');
    }
    console.log('[Submit API Vercel N8N] Request Headers being sent to N8N:', JSON.stringify(headersForN8n));
    
    // MODIFIED TO AWAIT FETCH FOR DEBUGGING
    try {
      console.log(`[Submit API Vercel N8N DEBUG] About to AWAIT fetch call to n8n for job ${jobId}.`);
      const n8nResponse = await fetch(n8nWebhookUrl!, { // Using await, n8nWebhookUrl should be non-null due to earlier checks
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(requestBodyToN8n),
      });

      const responseText = await n8nResponse.text();
      console.log(`[Submit API Vercel N8N DEBUG] N8N Response Status (after await) for job ${jobId}: ${n8nResponse.status}`);
      console.log(`[Submit API Vercel N8N DEBUG] N8N Response Text (after await) for job ${jobId}:`, responseText);

      if (!n8nResponse.ok) {
        console.error(`[Submit API Vercel N8N DEBUG] Error submitting job ${jobId} to n8n (after await). Status: ${n8nResponse.status}. (Full Response Text logged above)`);
      } else {
        console.log(`[Submit API Vercel N8N DEBUG] Job ${jobId} successfully submitted to n8n (after await). Status: ${n8nResponse.status}. (Full Response Text logged above)`);
      }
    } catch (error) {
      const networkErrorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Submit API Vercel N8N DEBUG] Network error or other exception during awaited fetch for job ${jobId}:`, networkErrorMessage, error);
    }
    console.log(`[Submit API Vercel N8N DEBUG] Finished awaiting fetch (or caught error) for job ${jobId}.`);
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