import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // 引入 uuid
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // 导入 SupabaseClient

// Supabase admin client for server-side operations
// 确保这些变量在您的 .env.local 文件中定义
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 只有在环境变量都存在时才创建 supabaseAdmin 客户端
let supabaseAdmin: SupabaseClient | undefined; // 修改类型
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
} else {
  console.error('Supabase URL or Service Role Key is not defined. Supabase admin client will not be initialized.');
  // 可以在这里决定是否要抛出错误或有其他处理
}

export async function POST(request: Request) {
  const supabaseUserClient = createRouteHandlerClient({ cookies });
  let userId = null;
  try {
    const { data: { user } } = await supabaseUserClient.auth.getUser();
    if (user) {
      userId = user.id;
      console.log('User ID fetched:', userId);
    } else {
      console.log('No active user session found for submit-podcast-idea.');
    }
  } catch (authError) {
    console.warn('Warning: Error fetching user for submit-podcast-idea (this might be normal if no user is logged in):', authError);
    // 非致命错误，即使没有用户信息，我们也可以继续，user_id 将为 null
  }

  try {
    const { ethnicity, hair, topic } = await request.json();

    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://kkkkeric.app.n8n.cloud/webhook-test/7cb8c037-a100-4442-8cba-cf12a912c898';

    if (!n8nApiKey || !n8nWebhookUrl) {
      console.error('N8N_API_KEY or N8N_WEBHOOK_URL is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error: API Key or Webhook URL missing.' }, { status: 500 });
    }
    if (!supabaseAdmin) { // 检查 supabaseAdmin 是否已成功初始化
        console.error('Supabase admin client is not initialized. Check Supabase environment variables.');
        return NextResponse.json({ message: 'Server configuration error: Supabase admin client failed to initialize.' }, { status: 500 });
    }

    if (!ethnicity || !hair || !topic) {
        return NextResponse.json({ message: 'Missing required fields: ethnicity, hair, or topic.' }, { status: 400 });
    }

    const jobId = uuidv4();
    console.log(`Generated Job ID: ${jobId}`);

    // 1. 向 Supabase 插入初始项目记录
    console.log(`Attempting to insert project for jobId: ${jobId}, userId: ${userId}`);
    const { error: dbInsertError } = await supabaseAdmin
      .from('projects') // 确保 'projects' 是您的表名
      .insert([
        {
          job_id: jobId, // 我们表中使用的是 job_id (小写)
          user_id: userId,
          ethnicity: String(ethnicity),
          hair: String(hair),
          topic: String(topic),
          status: 'processing', // 初始状态
          // created_at 和 updated_at 应该由数据库的默认值 DEFAULT now() 设置
        },
      ]);

    if (dbInsertError) {
      console.error(`Error inserting initial project record for jobId ${jobId}:`, JSON.stringify(dbInsertError, null, 2));
      // 关键错误：如果数据库插入失败，我们应该在这里返回错误，因为后续流程依赖于此记录
      return NextResponse.json({ message: 'Failed to create project record in database.', error: dbInsertError.message, status: 'error' }, { status: 500 });
    } else {
      console.log(`Successfully inserted initial project record for jobId ${jobId} with userId ${userId}`);
    }

    // 2. 异步调用 n8n webhook (只有在数据库插入成功后才执行)
    const requestBodyToN8n = {
        jobId,
        ethnicity: String(ethnicity),
        hair: String(hair),
        topic: String(topic),
      };
    
    console.log(`Sending POST request to n8n: ${n8nWebhookUrl}`);
    console.log('Request body to n8n:', JSON.stringify(requestBodyToN8n));

    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'N8N_API_KEY': n8nApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBodyToN8n),
    }).then(async response => {
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Error submitting job ${jobId} to n8n:`, response.status, errorData);
        // 注意：这里发生错误时，数据库记录已存在，状态为 'processing'
        // 可能需要一个机制来处理或标记这种 n8n 调用失败的情况
      } else {
        const responseText = await response.text(); // 读取响应体以确保连接被完全处理
        console.log(`Job ${jobId} successfully submitted to n8n. Status: ${response.status}. Response: ${responseText}`);
      }
    }).catch(error => {
      console.error(`Error calling n8n for job ${jobId}:`, error);
      // 同上，数据库记录已存在
    });

    // 3. 立即向客户端返回处理中状态和 jobId
    return NextResponse.json({ 
      message: 'Request received, processing started, and initial record created.', 
      status: 'processing', 
      jobId: jobId 
    });

  } catch (error: unknown) { // 修改类型为 unknown
    console.error('Critical error in API route /api/submit-podcast-idea:', error);
    // 确保 jobId 即使在错误情况下也被记录（如果已生成）
    // const generatedJobId = (error as any).jobIdForErrorLogging || 'unknown'; 
    // console.error(`Error occurred for potential jobId: ${generatedJobId}`);

    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message; // 现在可以安全访问 .message
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage, status: 'error' }, { status: 500 });
  }
}