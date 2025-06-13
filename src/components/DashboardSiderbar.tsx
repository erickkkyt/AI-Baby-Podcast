'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { LayoutDashboard, PlusSquare, Bell, LogOut, Zap, Layers, Home as HomeIcon, Mail, X } from 'lucide-react';
import Portal from './Portal';

// Define a type for the profile to expect `credits`
interface UserProfile {
  credits: number;
  // Add other profile fields if needed
}

export default function DashboardSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0); // Initialize credits to 0
  const [activeTab, setActiveTab] = useState<'create' | 'projects'>('create');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // State for contact modal
  const supabase = createClient();

  useEffect(() => {
    const currentPathname = window.location.pathname;
    // "Projects" is active only if the path is exactly /dashboard/projects
    // Otherwise, "Create" is active for any other path under /dashboard (e.g., /dashboard, /dashboard/some-other-page)
    if (currentPathname === '/dashboard/projects') {
      setActiveTab('projects');
    } else {
      setActiveTab('create');
    }

    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          // Fetch credits if user exists
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', currentUser.id)
            .single();

          if (profileError) {
            console.warn("Error fetching user profile for credits or profile doesn't exist:", profileError.message);
            setCredits(0); // Default to 0 if profile not found or error
          } else if (profile) {
            setCredits((profile as UserProfile).credits);
          } else {
            // This case might happen if the user exists in auth.users but not in user_profiles yet
            console.warn("User profile not found for user_id:", currentUser.id, ". Defaulting credits to 0.");
            setCredits(0);
          }
        } else {
          setCredits(0); // No user, no credits
        }
      } catch (error) {
        console.error("Error fetching user in Sidebar:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // Re-fetch credits on auth change if user is present
        const fetchUserCredits = async () => {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', session.user.id)
            .single();

          if (profileError) {
            console.warn("Error fetching user profile for credits on auth change or profile doesn't exist:", profileError.message);
            setCredits(0);
          } else if (profile) {
            setCredits((profile as UserProfile).credits);
          } else {
            console.warn("User profile not found for user_id (on auth change):", session.user.id, ". Defaulting credits to 0.");
            setCredits(0);
          }
        };
        fetchUserCredits();
      } else {
        setCredits(0); // Clear credits if user signs out
      }
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Listen to supabase client changes if any

  // Effect to update activeTab if pathname changes due to client-side navigation
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPathname = window.location.pathname;
      if (currentPathname === '/dashboard/projects') {
        setActiveTab('projects');
      } else if (currentPathname.startsWith('/dashboard')) { // Ensure we are under dashboard
        setActiveTab('create');
      }
    };

    // Listen to Next.js router events if you were using <Link> for SPA-like navigation for "Create"
    // For now, direct window.location.pathname check on mount and simple Link clicks is fine.
    // If using Next/Router, you might use:
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // useEffect(() => { handleRouteChange(router.asPath) }, [router.asPath]);
    
    // For simple href changes and direct loads, the initial useEffect is okay.
    // This additional effect can help if other client-side route changes happen that don't remount the component.
    window.addEventListener('popstate', handleRouteChange); // Handles browser back/forward
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-64 bg-white/70 text-yellow-900 p-4 flex flex-col justify-between h-full border-r border-[#f5eecb] rounded-r-2xl fixed left-0 top-0 backdrop-blur-md shadow-lg">
      <div>
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2 mb-10 p-2">
          <Link href="/dashboard" className="flex items-center space-x-2 whitespace-nowrap">
            <Layers size={30} className="text-purple-400" />
            <h1 className="text-xl font-semibold">AI Baby Podcast</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link
            href="/dashboard" // Changed href to always point to /dashboard
            onClick={(e) => {
              // e.preventDefault(); // Removed preventDefault as it now navigates
              setActiveTab('create');
            }}
            className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'create' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'}`}>
            <PlusSquare size={20} />
            <span className="font-medium">Create</span>
          </Link>
          <Link
            href="/dashboard/projects" // "Projects" navigates to its own page
            onClick={() => setActiveTab('projects')} // Set active tab optimistically
            className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'projects' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Projects</span>
          </Link>
          {/* New Home Link */}
          <Link
            href="/"
            className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-400 hover:bg-gray-700/60 hover:text-gray-200`}>
            <HomeIcon size={20} />
            <span className="font-medium">Home</span>
          </Link>
          {/* MOVED: Contact Creator Button - now below Home */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 w-full text-left`}>
            <Mail size={20} />
            <span className="font-medium">Contact</span>
          </button>
        </nav>
      </div>

      <div className="space-y-3">
        {/* Credit Info */}
        <div className="bg-yellow-50/80 p-3 rounded-xl text-sm border-2 border-yellow-300 flex flex-col items-center">
            <div className="flex items-center justify-between text-gray-300 mb-2">
                <span className="flex items-center font-medium text-yellow-700"><Zap size={16} className="mr-1.5 text-yellow-400"/>Credit left</span>
                <span className="font-bold text-yellow-700 text-lg ml-2">{loading ? '...' : credits}</span>
            </div>
            {/* Changed button to Link for navigation */}
            <Link href="/pricing" className="block w-full bg-gray-600 hover:bg-purple-500/80 text-white text-center py-2 rounded-md text-xs font-medium transition-colors">
                Check Plan
            </Link>
        </div>

        {/* Notification Link -  REMOVED AND REPLACED BY CONTACT CREATOR BUTTON ABOVE */}
        {/* <button ... Contact Creator button was here ... /> */}

        {/* User Info and Sign Out */}
        {loading ? (
          <div className="h-10 bg-gray-700/60 animate-pulse rounded-lg"></div>
        ) : user ? (
          <div className="border-t border-gray-700/50 pt-3 mt-2">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/60 group relative transition-colors">
              <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-gray-200 text-base font-semibold border border-gray-700/50">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-medium text-gray-200 block truncate">Hi, {user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-auto p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <Link href="https://www.vogueai.net/ai-baby-podcast" className="block w-full text-center p-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition-colors">
            Login
          </Link>
        )}
      </div>

      {/* Contact Creator Modal - Now wrapped in Portal */}
      {isContactModalOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl max-w-md w-full relative">
              <button 
                onClick={() => setIsContactModalOpen(false)} 
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="flex items-center mb-4">
                <Mail size={24} className="text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Contact Creator</h2>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Have questions, feedback, or need assistance? I&rsquo;m here to help! Please feel free to reach out, and I&rsquo;ll do my best to address your concerns promptly and patiently.
              </p>
              <p className="text-slate-300 text-sm mb-6">
                You can reach me at: <a href="mailto:support@babypodcast.pro" className="text-purple-400 hover:underline">support@babypodcast.pro</a>
              </p>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Portal>
      )}
    </aside>
  );
}