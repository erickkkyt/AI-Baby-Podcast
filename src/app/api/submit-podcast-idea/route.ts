import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server'; // Correct import for @supabase/ssr server client
import { createClient as createAdminSupabaseClient, SupabaseClient } from '@supabase/supabase-js'; // For admin operations with service_role

// Supabase admin client for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | undefined;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createAdminSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
} else {
  console.error('Supabase URL or Service Role Key is not defined for admin client. Admin operations will fail.');
}

export async function POST(request: Request) {
  // 1. Get current logged-in user's ID (using @/utils/supabase/server)
  const supabaseUserClient = createServerSupabaseClient(); // Synchronous creation
  let userId = null;
  try {
    const { data: { user }, error: getUserError } = await supabaseUserClient.auth.getUser();
    
    if (getUserError) {
      console.warn('[Submit API] Error fetching user from Supabase:', getUserError.message);
      // Depending on policy, you might return an error here or allow anonymous submission
    }
    
    if (user) {
      userId = user.id;
      console.log('[Submit API] User ID fetched:', userId);
    } else {
      console.log('[Submit API] No active user session found. Proceeding with userId as null.');
    }
  } catch (e: unknown) {
    console.warn('[Submit API] Exception when trying to get user:', e.message);
    // Proceeding with userId as null
  }

  // 2. Process request body and subsequent logic
  try {
    const { ethnicity, hair, topic } = await request.json();

    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://kkkkeric.app.n8n.cloud/webhook-test/7cb8c037-a100-4442-8cba-cf12a912c898'; // Fallback URL

    if (!n8nApiKey || !n8nWebhookUrl) {
      console.error('[Submit API] N8N_API_KEY or N8N_WEBHOOK_URL is not defined.');
      return NextResponse.json({ message: 'Server configuration error: API Key or Webhook URL missing.' }, { status: 500 });
    }
    if (!supabaseAdmin) {
        console.error('[Submit API] Supabase admin client is not initialized. Check Supabase environment variables.');
        return NextResponse.json({ message: 'Server configuration error: Supabase admin client failed to initialize.' }, { status: 500 });
    }
    if (!ethnicity || !hair || !topic) {
        return NextResponse.json({ message: 'Missing required fields: ethnicity, hair, or topic.' }, { status: 400 });
    }

    const jobId = uuidv4();
    console.log(`[Submit API] Generated Job ID: ${jobId}`);

    // Insert initial project record into Supabase
    console.log(`[Submit API] Attempting to insert project for jobId: ${jobId}, userId: ${userId}`);
    const { error: dbInsertError } = await supabaseAdmin
      .from('projects') 
      .insert([
        {
          job_id: jobId,
          user_id: userId, // This should now have the correct user_id if a user is logged in
          ethnicity: String(ethnicity),
          hair: String(hair),
          topic: String(topic),
          status: 'processing',
        },
      ]);

    if (dbInsertError) {
      console.error(`[Submit API] Error inserting initial project record for jobId ${jobId}:`, JSON.stringify(dbInsertError, null, 2));
      return NextResponse.json({ message: 'Failed to create project record in database.', error: dbInsertError.message }, { status: 500 });
    }
    console.log(`[Submit API] Successfully inserted initial project record for jobId ${jobId} with userId ${userId}`);

    // Asynchronously call n8n webhook
    const requestBodyToN8n = { jobId, ethnicity: String(ethnicity), hair: String(hair), topic: String(topic) };
    console.log(`[Submit API] Sending POST request to n8n: ${n8nWebhookUrl}`);
    console.log('[Submit API] Request body to n8n:', JSON.stringify(requestBodyToN8n));

    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'N8N_API_KEY': n8nApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBodyToN8n),
    }).then(async response => {
      const responseText = await response.text(); // It's good practice to always try to read the response text
      if (!response.ok) {
        console.error(`[Submit API] Error submitting job ${jobId} to n8n. Status: ${response.status}. Response:`, responseText);
      } else {
        console.log(`[Submit API] Job ${jobId} successfully submitted to n8n. Status: ${response.status}. Response:`, responseText);
      }
    }).catch(error => {
      console.error(`[Submit API] Network error calling n8n for job ${jobId}:`, error);
    });

    // Respond to the client immediately
    return NextResponse.json({ 
      message: 'Request received, processing started, and initial record created.', 
      status: 'processing', 
      jobId: jobId 
    });

  } catch (error: unknown) { 
    console.error('[Submit API] Critical error in POST handler:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}