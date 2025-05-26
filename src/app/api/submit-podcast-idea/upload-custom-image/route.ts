import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // 引入 uuid
import { createClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// 确保你的 Supabase server client 配置正确，或者根据需要导入 admin client

// import { SupabaseClient } from '@supabase/supabase-js'; // 如果直接使用 Supabase JS SDK for storage

export async function POST(request: Request) {
  const supabase = await createClient(); // Added await here

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn('[API - upload-custom-image] Authentication error or no user session:', authError?.message);
    return NextResponse.json({ message: 'Authentication required. Please log in.' }, { status: 401 });
  }
  console.log(`[API - upload-custom-image] Authenticated User ID: ${user.id}`);

  try {
    const formData = await request.formData();
    const topic = formData.get('topic') as string | null;
    const customBabyImageFile = formData.get('customBabyImage') as File | null;
    const videoResolution = formData.get('videoResolution') as '540p' | '720p' | null;
    const aspectRatio = formData.get('aspectRatio') as '1:1' | '16:9' | '9:16' | null;

    if (!videoResolution || !['540p', '720p'].includes(videoResolution)) {
        return NextResponse.json({ message: 'Missing or invalid field: videoResolution. Must be "540p" or "720p".' }, { status: 400 });
    }
    if (!aspectRatio || !['1:1', '16:9', '9:16'].includes(aspectRatio)) {
        return NextResponse.json({ message: 'Missing or invalid field: aspectRatio. Must be "1:1", "16:9", or "9:16".' }, { status: 400 });
    }

    if (!topic || !topic.trim()) {
      return NextResponse.json({ message: 'Missing required field: topic.' }, { status: 400 });
    }
    if (!customBabyImageFile) {
      return NextResponse.json({ message: 'Missing required field: image file.' }, { status: 400 });
    }

    const jobId = uuidv4();
    console.log(`[API - upload-custom-image] Generated Job ID: ${jobId}`);

    // --- 1. 获取用户当前积分 ---
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error(`[API - upload-custom-image] Error fetching user profile for ${user.id}:`, profileError.message);
      return NextResponse.json({ message: 'Failed to fetch user profile.', error_code: 'PROFILE_FETCH_FAILED' }, { status: 500 });
    }

    if (!userProfile || userProfile.credits === undefined) {
      console.error(`[API - upload-custom-image] User profile or credits not found for ${user.id}.`);
      return NextResponse.json({ message: 'User profile or credits information missing.', error_code: 'PROFILE_CREDITS_MISSING' }, { status: 500 });
    }
    console.log(`[API - upload-custom-image] User ${user.id} current credits: ${userProfile.credits}`);

    // --- 2. 检查现有正在处理的项目 ---
    const { data: existingProcessingProject, error: existingProjectError } = await supabase
      .from('projects')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .maybeSingle();

    if (existingProjectError) {
      console.error(`[API - upload-custom-image] Error checking for existing processing projects for user ${user.id}:`, existingProjectError.message);
      return NextResponse.json({ message: 'Failed to check for existing projects. Please try again.', error_code: 'EXISTING_PROJECT_CHECK_FAILED' }, { status: 500 });
    }

    if (existingProcessingProject) {
      console.warn(`[API - upload-custom-image] User ${user.id} already has a project with status 'processing' (ID: ${existingProcessingProject.id}). New project submission denied.`);
      return NextResponse.json({
        message: 'There is a task currently in progress. Please wait for it to complete before starting a new one.',
        error_code: 'ACTIVE_PROJECT_LIMIT_REACHED'
      }, { status: 409 });
    }

    // --- 3. 检查用户积分是否 > 0 (前置检查) ---
    if (userProfile.credits <= 0) {
      console.warn(`[API - upload-custom-image] User ${user.id} has insufficient credits (${userProfile.credits}) to create a new project.`);
      return NextResponse.json({ 
        message: "No credits left. Please check out the plan or wait for a top-up.", 
        error_code: 'INSUFFICIENT_CREDITS' 
      }, { status: 402 });
    }
    
    // --- 4. 图片存储逻辑 (Cloudflare R2) ---
    const fileName = `user_${user.id}/${Date.now()}_${customBabyImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '')}`.toLowerCase();
    let imageUrl = '';

    const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
    const R2_PUBLIC_HOSTNAME = process.env.R2_PUBLIC_HOSTNAME; 

    if (!process.env.R2_ACCOUNT_ID || !R2_BUCKET_NAME || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_HOSTNAME) {
        console.error('[API - upload-custom-image] R2 configuration missing in environment variables. Required: R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_HOSTNAME.');
        return NextResponse.json({ message: 'Server configuration error: Image storage details missing.' }, { status: 500 });
    }

    try {
        const s3Client = new S3Client({
            region: "auto", 
            endpoint: R2_ENDPOINT,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        });

        const buffer = Buffer.from(await customBabyImageFile.arrayBuffer());

        const putObjectParams = {
            Bucket: R2_BUCKET_NAME,
            Key: fileName, 
            Body: buffer,
            ContentType: customBabyImageFile.type,
        };

        await s3Client.send(new PutObjectCommand(putObjectParams));

        // Ensure R2_PUBLIC_HOSTNAME does not inadvertently lead to double https://
        // Assuming R2_PUBLIC_HOSTNAME in .env.local is just the hostname (e.g., pub-xxxx.r2.dev)
        const hostname = R2_PUBLIC_HOSTNAME.replace(/^https?_\/\//, ''); // Remove existing http(s):// if any
        imageUrl = `https://${hostname}/${fileName}`;
        
        console.log(`[API - upload-custom-image] Image uploaded successfully to R2: ${imageUrl}`);

    } catch (storageError: unknown) {
        console.error('[API - upload-custom-image] R2 Storage upload error:', storageError);
        let errorMessage = 'An unknown error occurred during image upload.';
        if (storageError instanceof Error) {
            errorMessage = storageError.message;
        }
        return NextResponse.json({ message: 'Failed to upload image.', details: errorMessage }, { status: 500 });
    }
    // --- R2 图片存储逻辑结束 ---

    // --- 5. 调用 RPC 'create_initial_project' ---
    console.log(`[API - upload-custom-image] Calling RPC 'create_initial_project' for job ${jobId} by user ${user.id} with resolution: ${videoResolution}, aspect ratio: ${aspectRatio}`);
    const { data: newProjectData, error: rpcError } = await supabase.rpc(
      'create_initial_project', 
      {
        p_user_id: user.id,
        p_job_id: jobId,
        p_ethnicity: null, 
        p_hair: null,      
        p_topic: topic,    
        p_creation_type: 'custom_image', 
        p_image_url: imageUrl,           
        p_video_resolution: videoResolution,
        p_aspect_ratio: aspectRatio 
      }
    );

    if (rpcError) {
      console.error(`[API - upload-custom-image] RPC call 'create_initial_project' failed for job ${jobId}:`, rpcError);
      const errorDetailsString = typeof rpcError.details === 'string' ? rpcError.details :
                                 rpcError.message ? `${rpcError.message} (Code: ${rpcError.code || 'N/A'})` :
                                 JSON.stringify(rpcError);
      return NextResponse.json({ 
        message: 'Failed to process request due to a database function error.', 
        error: rpcError.message, 
        details: errorDetailsString, 
        error_code: 'RPC_CALL_FAILED' 
      }, { status: 500 });
    }

    const newProjectEntity = Array.isArray(newProjectData) && newProjectData.length > 0 ? newProjectData[0] : null;

    if (newProjectEntity && typeof newProjectEntity === 'object' && 'status' in newProjectEntity && newProjectEntity.status === 'error') {
      console.warn(`[API - upload-custom-image] RPC returned an application error for job ${jobId}: Code='${newProjectEntity.code}', Message='${newProjectEntity.message}', Details: '${newProjectEntity.details}'`);
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
      return NextResponse.json({ 
        message: newProjectEntity.message || 'Failed to process project due to a transaction error.', 
        error_code: newProjectEntity.code || 'RPC_LOGIC_ERROR', 
        details: typeof newProjectEntity.details === 'string' ? newProjectEntity.details : JSON.stringify(newProjectEntity.details) 
      }, { status: 500 });
    }
    
    if (!newProjectEntity || typeof newProjectEntity !== 'object' || !newProjectEntity.job_id || newProjectEntity.job_id !== jobId) {
        console.error(`[API - upload-custom-image] RPC 'create_initial_project' for job ${jobId} did not return the expected project data. Actual response:`, newProjectEntity);
        const responseDetailsString = typeof newProjectData === 'object' ? JSON.stringify(newProjectData) : String(newProjectData);
        return NextResponse.json({ 
          message: 'Project creation initiated, but confirmation details from RPC were unexpected or missing critical data.', 
          error_code: 'RPC_UNEXPECTED_RESPONSE_SHAPE',
          details: responseDetailsString 
        }, { status: 500 });
    }
    console.log(`[API - upload-custom-image] RPC 'create_initial_project' success for job ${jobId}. Project created. Details:`, newProjectEntity);

    // --- 6. 调用 N8N Webhook ---
    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_FOR_CUSTOM_IMAGE_WORKFLOW;

    if (!n8nWebhookUrl) { // API Key 可以是可选的，取决于你的N8N设置
      console.error('[API - upload-custom-image] N8N_WEBHOOK_URL_FOR_CUSTOM_IMAGE_WORKFLOW is not properly configured.');
      // 根据你的策略，这里可能不应该是一个致命错误，也许项目已创建，只是N8N未通知
      // 但为了与旧API一致，如果URL缺失，我们还是返回错误
      return NextResponse.json({ message: 'Server configuration error: N8N integration (custom image workflow) details missing.' }, { status: 500 });
    }

    const requestBodyToN8n = { 
        jobId: newProjectEntity.job_id, 
        topic: topic, 
        imageUrl: imageUrl, 
        videoResolution: videoResolution,
        aspectRatio: aspectRatio
    };
    
    console.log('[API - upload-custom-image] Attempting to call N8N webhook (custom image).');
    console.log('[API - upload-custom-image] Target URL:', n8nWebhookUrl);
    console.log('[API - upload-custom-image] API Key (first 5 chars):', n8nApiKey ? n8nApiKey.substring(0, 5) + '...' : 'Not Set or Empty');
    console.log(`[API - upload-custom-image] Sending POST request to n8n for job ${jobId}. Payload:`, JSON.stringify(requestBodyToN8n));

    const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
    if (n8nApiKey) { // 只有在提供了API Key时才添加它
        headersForN8n[process.env.N8N_API_HEADER_NAME || 'N8N_API_KEY'] = n8nApiKey; 
    }
    console.log('[API - upload-custom-image] Request Headers being sent to N8N:', JSON.stringify(headersForN8n));
    
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(requestBodyToN8n),
      });
      const responseText = await n8nResponse.text(); // 获取响应体用于日志
      if (!n8nResponse.ok) {
        console.error(`[API - upload-custom-image] Error submitting job ${jobId} to n8n. Status: ${n8nResponse.status}. Response: ${responseText}`);
        // 根据策略，即使N8N失败，项目也可能已经创建
      } else {
        console.log(`[API - upload-custom-image] Job ${jobId} successfully submitted to n8n. Status: ${n8nResponse.status}. Response: ${responseText}`);
      }
    } catch (error) {
      const networkErrorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[API - upload-custom-image] Network error or other exception during fetch for job ${jobId}:`, networkErrorMessage, error);
    }

    // --- 7. 最终成功响应 ---
    return NextResponse.json({ 
      message: 'Request received, project creation initiated, and processing started.', 
      status: newProjectEntity.status || 'processing', 
      jobId: newProjectEntity.job_id,
      projectDetails: newProjectEntity 
    });

  } catch (error: unknown) { 
    const criticalErrorMessage = error instanceof Error ? error.message : String(error);
    const criticalErrorStack = error instanceof Error ? error.stack : undefined;
    console.error('[API - upload-custom-image] Critical error in POST handler:', criticalErrorMessage, criticalErrorStack);
    return NextResponse.json({ message: 'Internal Server Error. Please try again later.', error: criticalErrorMessage }, { status: 500 });
  }
} 