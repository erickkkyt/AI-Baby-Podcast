'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; // 导入浏览器客户端
import { type User } from '@supabase/supabase-js'; // 导入 Supabase User 类型

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // 创建客户端实例

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user in Header:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化，以便在登录/登出后更新 Header
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [supabase]); // 依赖 supabase 实例

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange 会自动处理 setUser(null)
    // 可能需要 router.push('/')，但这通常在 AuthContext 或 Server Action 中处理
    setMobileMenuOpen(false); // 关闭移动菜单
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Placeholder for a real logo SVG if available */}
              {/* <img className="h-8 w-auto" src="/logo.svg" alt="AI Baby Podcast" /> */}
              <span className="text-xl font-bold text-blue-600">AI Baby Podcast</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* User specific actions */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-white shadow-sm ring-2 ring-offset-2 ring-offset-white ring-transparent transition-all group-hover:ring-blue-500">
                  {user.email?.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-50">
                  <div className="border-b border-gray-200 px-3 py-2">
                    <p className="text-xs font-medium text-gray-700">Signed in as</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="flex h-8 items-center justify-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg sm:rounded-b-lg" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link href="#features" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="#pricing" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#faq" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {loading ? (
              <div className="px-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200"></div>
              </div>
            ) : user ? (
              <div className="space-y-2 px-4">
                <div className="text-xs font-medium text-gray-500">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link href="/login" className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/login" className="block w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}