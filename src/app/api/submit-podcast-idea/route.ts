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
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://kkkkeric.app.n8n.cloud/webhook-test/7cb8c037-a100-4442-8cba-cf12a912c898'; 

    if (!n8nApiKey || !n8nWebhookUrl) {
      console.error('[Submit API] N8N_API_KEY or N8N_WEBHOOK_URL is not properly configured.');
      return NextResponse.json({ message: 'Server configuration error: N8N integration details missing.' }, { status: 500 });
    }
    
    if (!ethnicity || !hair || !topic) {
        return NextResponse.json({ message: 'Missing required fields: ethnicity, hair, or topic.' }, { status: 400 });
    }

    const jobId = uuidv4();
    console.log(`[Submit API] Generated Job ID for RPC: ${jobId}`);

    console.log(`[Submit API] Calling RPC 'deduct_credits_and_create_project' for job ${jobId} by user ${user.id}`);
    const { data: rpcResponseData, error: rpcError } = await supabaseUserClient.rpc(
      'deduct_credits_and_create_project', 
      {
        // p_user_id is implicitly passed by Supabase for the authenticated user when calling RPC
        // If your RPC specifically needs it as a named parameter, and it's not automatically picked up, 
        // you would add: p_user_id: user.id, 
        // However, the previous version of your RPC didn't show p_user_id being explicitly passed here
        // and it seemed to work. Let's stick to that unless RPC requires p_user_id.
        // The RPC function definition DOES have p_user_id, so we should pass it.
        p_user_id: user.id, // Added p_user_id based on RPC definition
        p_job_id: jobId,
        p_ethnicity: String(ethnicity),
        p_hair: String(hair),
        p_topic: String(topic)
      }
    );

    if (rpcError) {
      console.error(`[Submit API] RPC call itself failed for job ${jobId}:`, rpcError);
      return NextResponse.json({ 
        message: 'Failed to process request due to a database function error.', 
        error: rpcError.message, 
        details: rpcError, // Pass along the full rpcError object for more context if needed
        error_code: 'RPC_CALL_FAILED' 
      }, { status: 500 });
    }

    // New error handling based on RPC's { status: 'error', code: '...', message: '...' } structure
    if (rpcResponseData && rpcResponseData.status === 'error') {
      console.warn(`[Submit API] RPC returned an application error for job ${jobId}: Code='${rpcResponseData.code}', Message='${rpcResponseData.message}', Details: '${rpcResponseData.details}'`);
      if (rpcResponseData.code === 'insufficient_credits') {
        return NextResponse.json({ 
          message: "No credits left. Please check out the plan.", // YOUR NEW CUSTOM MESSAGE
          error_code: 'INSUFFICIENT_CREDITS',
          // original_rpc_message: rpcResponseData.message // Optional for debugging
        }, { status: 402 }); // 402 Payment Required is appropriate
      } else if (rpcResponseData.code === 'unauthorized') { 
         return NextResponse.json({ 
           message: rpcResponseData.message || 'Unauthorized to perform this action.', 
           error_code: 'UNAUTHORIZED_RPC_ACTION'
         }, { status: 401 });
      }
      // Generic error message for other RPC logic errors defined in your RPC
      return NextResponse.json({ 
        message: rpcResponseData.message || 'Failed to process project due to a transaction error.', 
        error_code: rpcResponseData.code || 'RPC_LOGIC_ERROR', 
        details: rpcResponseData.details 
      }, { status: 500 });
    }
    
    // Adjusted success check: RPC success means rpcResponseData.status === 'success' 
    // AND the nested rpcResponseData.project object contains the job_id
    if (!rpcResponseData || rpcResponseData.status !== 'success' || !rpcResponseData.project || !rpcResponseData.project.job_id) {
        console.error(`[Submit API] RPC for job ${jobId} did not return successful project data or status was not 'success':`, rpcResponseData);
        return NextResponse.json({ 
          message: 'Project creation acknowledged but failed to retrieve confirmation details or RPC status was not success.', 
          error_code: 'RPC_UNEXPECTED_SUCCESS_RESPONSE',
          details: rpcResponseData 
        }, { status: 500 });
    }

    // Log the nested project details
    console.log(`[Submit API] RPC success for job ${jobId}. Project created & credits deducted. Details:`, rpcResponseData.project);

    const requestBodyToN8n = { jobId, ethnicity: String(ethnicity), hair: String(hair), topic: String(topic) };
    console.log(`[Submit API] Sending POST request to n8n: ${n8nWebhookUrl} for job ${jobId}`);
    
    // Fire-and-forget n8n webhook call
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'N8N_API_KEY': n8nApiKey, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBodyToN8n),
    }).then(async response => {
      const responseText = await response.text(); 
      if (!response.ok) {
        console.error(`[Submit API] Error submitting job ${jobId} to n8n. Status: ${response.status}. Response:`, responseText);
      } else {
        console.log(`[Submit API] Job ${jobId} successfully submitted to n8n. Status: ${response.status}. Response:`, responseText);
      }
    }).catch(error => {
      const networkErrorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Submit API] Network error calling n8n for job ${jobId}:`, networkErrorMessage);
    });

    // Adjust final success response to use the nested project data
    return NextResponse.json({ 
      message: 'Request received, project created, and processing started.', 
      status: rpcResponseData.project.status || 'processing', 
      jobId: rpcResponseData.project.job_id, 
      projectDetails: rpcResponseData.project 
    });

  } catch (error: unknown) { 
    const criticalErrorMessage = error instanceof Error ? error.message : String(error);
    const criticalErrorStack = error instanceof Error ? error.stack : undefined;
    console.error('[Submit API] Critical error in POST handler:', criticalErrorMessage, criticalErrorStack);
    return NextResponse.json({ message: 'Internal Server Error. Please try again later.', error: criticalErrorMessage }, { status: 500 });
  }
}