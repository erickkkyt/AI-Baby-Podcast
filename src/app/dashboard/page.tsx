import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
// 注意：下面这个导入将会被修改
import DashboardSiderbar from '@/components/DashboardSiderbar'; 
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth Error or No User, redirecting to login:', authError);
    redirect('/login?message=请先登录以访问控制台');
  }

  return (
    <div className="flex h-screen bg-[#0f1218] text-white">
      {/* 侧边栏: DashboardHeader 组件现在被用作侧边栏 */}
      <DashboardSiderbar /> 
      
      {/* 主要内容区域: 添加了 ml-64 以适应侧边栏宽度 */}
      <main className="flex-1 overflow-y-auto p-6 ml-64"> 
        <DashboardClient />
      </main>
    </div>
  );
}