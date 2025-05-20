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

    // Define the credits required for a project, matching the RPC's expected parameter
    const REQUIRED_CREDITS_PER_PROJECT = 100; 

    console.log(`[Submit API] Calling RPC 'deduct_credits_and_create_project' for job ${jobId} by user ${user.id}`);
    const { data: rpcResponseData, error: rpcError } = await supabaseUserClient.rpc(
      'deduct_credits_and_create_project', 
      {
        // Parameters as suggested by the database error hint
        p_credits_to_deduct: REQUIRED_CREDITS_PER_PROJECT,
        p_job_id: jobId,
        p_ethnicity: String(ethnicity),
        p_hair: String(hair),
        p_topic: String(topic)
        // p_user_id is removed as the hint suggests it's not an explicit parameter
        // and is likely derived from the authenticated session within the RPC function (auth.uid()).
      }
    );

    if (rpcError) {
      console.error(`[Submit API] RPC call itself failed for job ${jobId}:`, rpcError);
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

    // New error handling based on RPC's { status: 'error', code: '...', message: '...' } structure
    if (rpcResponseData && typeof rpcResponseData === 'object' && 'status' in rpcResponseData && rpcResponseData.status === 'error') {
      console.warn(`[Submit API] RPC returned an application error for job ${jobId}: Code='${rpcResponseData.code}', Message='${rpcResponseData.message}', Details: '${rpcResponseData.details}'`);
      if (rpcResponseData.code === 'insufficient_credits') {
        return NextResponse.json({ 
          message: "No credits left. Please check out the plan.",
          error_code: 'INSUFFICIENT_CREDITS',
        }, { status: 402 });
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
        details: typeof rpcResponseData.details === 'string' ? rpcResponseData.details : JSON.stringify(rpcResponseData.details) 
      }, { status: 500 });
    }
    
    // Adjusted success check: RPC success means rpcResponseData contains the job_id
    // and is an object (not null, undefined, or a primitive)
    if (!rpcResponseData || typeof rpcResponseData !== 'object' || !rpcResponseData.job_id || rpcResponseData.job_id !== jobId) {
        console.error(`[Submit API] RPC for job ${jobId} did not return the expected project data (e.g., missing or mismatched job_id). Actual response:`, rpcResponseData);
        
        // Ensure details are stringified if rpcResponseData is an object but not in the expected shape
        const responseDetailsString = typeof rpcResponseData === 'object' ? JSON.stringify(rpcResponseData) : String(rpcResponseData);

        return NextResponse.json({ 
          message: 'Project creation acknowledged, but confirmation details from RPC were unexpected or missing critical data like job_id.', 
          error_code: 'RPC_UNEXPECTED_RESPONSE_SHAPE',
          details: responseDetailsString 
        }, { status: 500 });
    }

    // Log the project details (which is rpcResponseData itself)
    console.log(`[Submit API] RPC success for job ${jobId}. Project created & credits deducted. Details:`, rpcResponseData);

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

    // Adjust final success response to use rpcResponseData directly as project details
    return NextResponse.json({ 
      message: 'Request received, project created, and processing started.', 
      status: rpcResponseData.status || 'processing', // status is directly on rpcResponseData
      jobId: rpcResponseData.job_id,                 // job_id is directly on rpcResponseData
      projectDetails: rpcResponseData                // rpcResponseData is the project details
    });

  } catch (error: unknown) { 
    const criticalErrorMessage = error instanceof Error ? error.message : String(error);
    const criticalErrorStack = error instanceof Error ? error.stack : undefined;
    console.error('[Submit API] Critical error in POST handler:', criticalErrorMessage, criticalErrorStack);
    return NextResponse.json({ message: 'Internal Server Error. Please try again later.', error: criticalErrorMessage }, { status: 500 });
  }
}