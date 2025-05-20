import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// 期望从 n8n 收到的请求体结构
interface N8nCallbackBody {
  jobId: string;
  videoUrl?: string; // 可选，因为失败时可能没有
  fileName?: string; // 可选
  status: 'completed' | 'failed';
  errorMessage?: string; // 可选，仅在 status 为 'failed' 时
}

export async function POST(request: NextRequest) {
  console.log('Received callback from n8n...');

  // 1. 验证共享密钥
  // 我们复用 N8N_API_KEY 作为回调的共享密钥
  const expectedSecret = process.env.N8N_API_KEY;
  if (!expectedSecret) {
    console.error('N8N_API_KEY (used as callback secret) is not defined in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Callback secret missing.' }, { status: 500 });
  }

  let receivedSecret: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    receivedSecret = authHeader.substring(7); // 提取 Bearer token
    console.log('Found secret in Authorization header.');
  } else {
    // 如果不在 Authorization header，尝试从自定义 header X-Webhook-Secret 获取
    receivedSecret = request.headers.get('X-Webhook-Secret');
    if (receivedSecret) {
      console.log('Found secret in X-Webhook-Secret header.');
    }
  }

  if (!receivedSecret) {
    console.warn('Missing secret in callback request headers. Neither Authorization (Bearer) nor X-Webhook-Secret found.');
    return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
  }

  if (receivedSecret !== expectedSecret) {
    console.warn('Invalid secret in callback request.');
    // 为了安全，不要在响应中暴露期望的密钥或收到的密钥
    return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
  }

  console.log('Shared secret validated successfully.');

  // 2. 解析请求体
  let body: N8nCallbackBody;
  try {
    body = await request.json();
    console.log('Callback body received:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Error parsing JSON body from n8n callback:', error);
    return NextResponse.json({ message: 'Bad Request: Invalid JSON body.' }, { status: 400 });
  }

  const { jobId, videoUrl, fileName, status, errorMessage } = body;

  // 基本的请求体验证
  if (!jobId || !status) {
    console.error('Missing jobId or status in n8n callback body.');
    return NextResponse.json({ message: 'Bad Request: Missing jobId or status.' }, { status: 400 });
  }

  if (status !== 'completed' && status !== 'failed') {
    console.error(`Invalid status value: ${status} for jobId: ${jobId}. Must be 'completed' or 'failed'.`);
    return NextResponse.json({ message: 'Bad Request: Invalid status value.' }, { status: 400 });
  }


  // 3. 根据状态处理
  if (status === 'completed') {
    if (!videoUrl) {
      console.error(`Status is 'completed' but videoUrl is missing for jobId: ${jobId}`);
      // 这种情况也应该在数据库中将任务标记为某种形式的失败
      // TODO: (数据库操作) 更新 Supabase 数据库中 jobId 对应的任务状态为 'failed' 或 'error_missing_url'，记录错误原因
      return NextResponse.json({ message: 'Bad Request: videoUrl is required for completed status.' }, { status: 400 });
    }

    console.log(`Processing completed video for jobId: ${jobId}, videoUrl: ${videoUrl}${fileName ? ', fileName: ' + fileName : ''}`);

    // TODO: 实现 Supabase 集成
    // 1. 从 videoUrl 下载视频文件 (得到 Buffer 或 Stream)
    //    例如: const videoResponse = await fetch(videoUrl);
    //          if (!videoResponse.ok) throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    //          const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    //
    // 2. 将视频文件上传到 Supabase Storage
    //    const storageFileName = `videos/${jobId}-${fileName || 'video.mp4'}`;
    //    const { data: uploadData, error: uploadError } = await supabase.storage
    //      .from('your-bucket-name') // 替换为你的 Supabase Storage Bucket 名称
    //      .upload(storageFileName, videoBuffer, {
    //        contentType: videoResponse.headers.get('content-type') || 'video/mp4', // 尝试获取正确的 content-type
    //        upsert: true, // 如果文件已存在则覆盖
    //      });
    //    if (uploadError) throw uploadError;
    //
    // 3. 获取 Supabase Storage 中的公开 URL
    //    const { data: publicUrlData } = supabase.storage
    //      .from('your-bucket-name')
    //      .getPublicUrl(storageFileName);
    //    const publicVideoUrl = publicUrlData.publicUrl;
    //
    // 4. 更新 Supabase 数据库中 jobId 对应的任务:
    //    const { error: dbError } = await supabase
    //      .from('projects')
    //      .update({
    //        status: 'completed',
    //        video_url: publicVideoUrl,
    //        file_name_in_storage: storageFileName,
    //        updated_at: new Date().toISOString(),
    //      })
    //      .eq('job_id', jobId);
    //    if (dbError) throw dbError;

    // 模拟成功处理完成通知的日志
    console.log(`Successfully processed callback for COMPLETED job: ${jobId}. (Supabase integration pending)`);
    // 向 n8n 返回成功响应
    return NextResponse.json({ message: 'Callback for completed job received. Processing initiated.' });

  } else if (status === 'failed') {
    console.warn(`Processing FAILED video notification for jobId: ${jobId}. Error: ${errorMessage || 'Unknown error from n8n'}`);

    // TODO: (数据库操作) 更新 Supabase 数据库中 jobId 对应的任务:
    // const { error: dbError } = await supabase
    //   .from('projects')
    //   .update({
    //     status: 'failed',
    //     error_message: errorMessage || 'n8n reported failure without a specific message.',
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('job_id', jobId);
    // if (dbError) { /* log or handle db error */ }


    // 模拟成功处理失败通知的日志
    console.log(`Successfully processed callback for FAILED job: ${jobId}. (Supabase integration pending)`);
    // 向 n8n 返回成功响应 (即使是失败通知，我们也成功接收了它)
    return NextResponse.json({ message: 'Callback for failed job received and recorded.' });

  }
  // 其实因为上面已经有 status 的校验，理论上不会执行到这里
  return NextResponse.json({ message: 'Bad Request: Unknown status.' }, { status: 400 });
}