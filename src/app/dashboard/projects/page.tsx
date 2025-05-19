import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardSidebar from '@/components/DashboardSiderbar'; // Corrected filename
import ProjectsClient from '@/components/ProjectsClient'; // New component for projects content

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth Error or No User on ProjectsPage, redirecting to login:', authError);
    redirect('/login?message=请先登录以访问项目页面');
  }

  return (
    <div className="flex h-screen bg-[#0f1218] text-white">
      <DashboardSidebar />
      {/* Main Content for Projects Page */}
      <main className="flex-1 overflow-y-auto p-6 ml-64">
        <ProjectsClient />
      </main>
    </div>
  );
} 