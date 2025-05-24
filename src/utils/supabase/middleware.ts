import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value
          console.log(`Middleware: Getting cookie '${name}': ${cookie ? 'found' : 'not found'}`);
          return cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`Middleware: Setting cookie '${name}' with value '${value.substring(0, 20)}...'`);
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log(`Middleware: Removing cookie '${name}'`);
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    console.log('Middleware: Attempting supabase.auth.getUser()');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Middleware: Error from supabase.auth.getUser():', error);
      // 对于 "Invalid Refresh Token: Refresh Token Not Found"，我们可能不希望它成为一个使整个请求失败的致命错误
      // 而是应该让请求继续，用户状态为 null
      if (error.message === 'Invalid Refresh Token: Refresh Token Not Found' || error.message === 'Auth session missing!') {
        console.warn('Middleware: Refresh token not found or session missing, proceeding as unauthenticated.');
        // 在这种情况下，我们不应该抛出错误，而是让响应按原样返回
        // Supabase 客户端应该已经处理了这种情况，getUser() 会返回 user: null
      } else {
        // 对于其他类型的认证错误，可能需要更严肃的处理
        // 但目前，我们先记录，然后让它继续
        console.error('Middleware: Unhandled auth error, but proceeding:', error);
      }
    } else {
      console.log(`Middleware: supabase.auth.getUser() successful. User ID: ${user?.id || 'No user'}`);
    }
  } catch (e: unknown) {
    // 捕获 getUser() 本身可能抛出的、未被 Supabase 包装的异常
    let errorMessage = 'An unknown error occurred';
    if (e instanceof Error) {
      errorMessage = e.message;
      console.error('Middleware: Critical exception during supabase.auth.getUser():', errorMessage, e.stack);
    } else {
      console.error('Middleware: Critical non-Error exception during supabase.auth.getUser():', e);
    }
    // 即使这里发生异常，为了调试，我们暂时也让它返回原始响应
    // 在生产中，这里可能需要返回一个错误页面或重定向
    // return new NextResponse('Internal Server Error in middleware', { status: 500 });
  }

  return response
} 