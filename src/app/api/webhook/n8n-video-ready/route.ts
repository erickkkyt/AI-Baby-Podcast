import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient as createAdminSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase admin client for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | undefined;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createAdminSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
  console.log('[N8N Webhook] Supabase Admin Client initialized for n8n-video-ready route.');
} else {
  console.error('[N8N Webhook] Supabase URL or Service Role Key for admin client is not defined. DB operations will fail.');
}

interface N8nCallbackBody {
  jobId: string;
  videoUrl?: string;
  fileName?: string; // Kept for potential future use, but not directly used for storage path now
  status: 'completed' | 'failed';
  errorMessage?: string; // errorMessage from n8n is received but not stored in the DB
}

export async function POST(request: NextRequest) {
  console.log('[N8N Webhook] Received callback from n8n on /api/webhook/n8n-video-ready');

  // 1. Validate shared secret
  const expectedSecret = process.env.N8N_API_KEY;
  if (!expectedSecret) {
    console.error('[N8N Webhook] N8N_API_KEY (used as callback secret) is not defined in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Callback secret missing.' }, { status: 500 });
  }

  let receivedSecret: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    receivedSecret = authHeader.substring(7);
  } else {
    receivedSecret = request.headers.get('X-Webhook-Secret'); // Fallback to custom header
  }

  if (!receivedSecret) {
    console.warn('[N8N Webhook] Missing secret in callback request headers.');
    return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
  }
  if (receivedSecret !== expectedSecret) {
    console.warn('[N8N Webhook] Invalid secret provided in callback request.');
    return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
  }
  console.log('[N8N Webhook] Shared secret validated successfully.');

  // 2. Parse request body
  let body: N8nCallbackBody;
  try {
    body = await request.json();
    console.log('[N8N Webhook] Callback body received:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('[N8N Webhook] Error parsing JSON body from n8n callback:', error);
    return NextResponse.json({ message: 'Bad Request: Invalid JSON body.' }, { status: 400 });
  }

  const { jobId, videoUrl, status, errorMessage } = body;

  // Basic body validation
  if (!jobId || !status) {
    console.error('[N8N Webhook] Missing jobId or status in n8n callback body.');
    return NextResponse.json({ message: 'Bad Request: Missing jobId or status.' }, { status: 400 });
  }
  if (status !== 'completed' && status !== 'failed') {
    console.error(`[N8N Webhook] Invalid status value: ${status} for jobId: ${jobId}. Must be 'completed' or 'failed'.`);
    return NextResponse.json({ message: 'Bad Request: Invalid status value.' }, { status: 400 });
  }

  // Ensure Supabase admin client is available for DB operations
  if (!supabaseAdmin) {
    console.error('[N8N Webhook] Supabase admin client not initialized. Cannot update database.');
    return NextResponse.json({ message: 'Server configuration error: Database client not available for webhook processing.' }, { status: 500 });
  }

  // 3. Process based on status
  if (status === 'completed') {
    if (!videoUrl) {
      console.error(`[N8N Webhook] Status is 'completed' but videoUrl is missing for jobId: ${jobId}. Marking as failed.`);
      try {
        const { error: dbError } = await supabaseAdmin
          .from('projects')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
            video_url: null, // Ensure video_url is cleared
          })
          .eq('job_id', jobId);
        if (dbError) {
          console.error(`[N8N Webhook] DB error updating project ${jobId} to 'failed' (due to missing URL):`, dbError.message);
        } else {
          console.log(`[N8N Webhook] Project ${jobId} marked as 'failed' in DB due to missing videoUrl from n8n.`);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception while updating project ${jobId} to 'failed' (missing URL):`, message);
      }
      return NextResponse.json({ message: 'Bad Request: videoUrl is required for completed status.' }, { status: 400 });
    }

    console.log(`[N8N Webhook] Processing COMPLETED video for jobId: ${jobId}. Provided videoUrl: ${videoUrl}`);
    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('projects')
        .update({
          status: 'completed',
          video_url: videoUrl, // Store the n8n-provided video URL directly
          updated_at: new Date().toISOString(),
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[N8N Webhook] DB error updating project ${jobId} to 'completed':`, dbUpdateError.message);
        // Inform n8n that callback was received but internal processing failed.
        return NextResponse.json({ message: 'Callback processed, but a server-side error occurred during database update. Please check server logs.' }, { status: 500 }); 
      } else {
        console.log(`[N8N Webhook] Project ${jobId} successfully updated in DB: status='completed', videoUrl stored.`);
        return NextResponse.json({ message: 'Callback for completed job processed successfully and database updated.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception during DB update for completed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for completed job. Please check server logs.' }, { status: 500 });
    }

  } else if (status === 'failed') {
    console.warn(`[N8N Webhook] Processing FAILED job notification from n8n for jobId: ${jobId}. Reported error (not stored in DB): ${errorMessage || 'Not provided'}`);
    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('projects')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          video_url: null, // Ensure video_url is cleared on failure
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[N8N Webhook] DB error updating project ${jobId} to 'failed':`, dbUpdateError.message);
        return NextResponse.json({ message: 'Callback for failed job processed, but DB update failed. Check server logs.' }, { status: 500 });
      } else {
        console.log(`[N8N Webhook] Project ${jobId} successfully updated in DB to 'failed'. Error from n8n (if any) was: ${errorMessage || 'Not provided'}`);
        return NextResponse.json({ message: 'Callback for failed job processed and recorded successfully.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception during DB update for failed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for failed job. Check server logs.' }, { status: 500 });
    }
  }

  // This part should ideally not be reached if status validation is robust
  console.error(`[N8N Webhook] Reached end of POST handler with unhandled status for jobId: ${jobId}. Status: ${status}`);
  return NextResponse.json({ message: 'Bad Request: Unknown or unhandled status.' }, { status: 400 });
}