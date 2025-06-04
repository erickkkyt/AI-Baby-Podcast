import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardSiderbar from '@/components/DashboardSiderbar';
import DashboardClient from '@/components/DashboardClient';
import Beams from '@/components/3d/Beams';

// Define a type for the profile to expect `credits`
interface UserProfile {
  credits: number;
  // Add other profile fields if needed
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth Error or No User, redirecting to login:', authError);
    const message = 'Please log in to access the dashboard.';
    redirect(`/login?message=${encodeURIComponent(message)}`);
  }

  // Fetch user credits
  let userCredits = 0; // Default to 0
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.warn(`[DashboardPage] Error fetching user profile for user ${user.id} or profile doesn't exist: ${profileError.message}. Defaulting credits to 0.`);
    // We will proceed with userCredits = 0, which is already set
  } else if (profile) {
    userCredits = (profile as UserProfile).credits;
  } else {
    console.warn(`[DashboardPage] User profile not found for user_id: ${user.id}. Defaulting credits to 0.`);
    // User exists in auth.users but not in user_profiles. Defaulting to 0.
  }

  return (
    <div className="relative flex h-screen bg-[#0f1218] text-white">
      {/* 3D 背景层 */}
      <div className="fixed inset-0 z-0">
        <Beams
          beamWidth={1.5}
          beamHeight={12}
          beamNumber={8}
          lightColor="#4f46e5"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.15}
          rotation={0}
        />
      </div>

      {/* 侧边栏: DashboardHeader 组件现在被用作侧边栏 */}
      <div className="relative z-10">
        <DashboardSiderbar />
      </div>

      {/* 主要内容区域: 添加了 ml-64 以适应侧边栏宽度 */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 ml-64">
        <DashboardClient currentCredits={userCredits} />
      </main>
    </div>
  );
}