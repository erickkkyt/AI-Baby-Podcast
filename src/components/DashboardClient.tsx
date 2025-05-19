'use client';

import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image'; // No longer used
import { createClient } from '@/utils/supabase/client';
// import type { RealtimeChannel } from '@supabase/supabase-js'; // No longer used if realtime features are removed or simplified

// Removed MonitoredAccount interface
// Removed ApiResponse interface if it was specific to account adding

// Simplified Notification interface if it was Twitter specific
interface Notification {
  id: string;
  title: string; // Generic title
  content: string;
  timestamp: Date;
  isImportant: boolean;
  // Removed accountUsername, accountDisplayName, profileImageUrl if they were Twitter specific
}

// Removed DashboardClientProps if no props are passed anymore
// interface DashboardClientProps {
//   initialAccounts: MonitoredAccount[]; // Removed
//   initialFetchError: string | null; // Removed
// }

// Removed TweetData, PresenceData, PresenceState interfaces as they were Twitter/Realtime specific for monitoring

// Removed getStartOfToday if no longer used by notification clearing logic

export default function DashboardClient(/* Removed props */) {
  // Removed states related to newAccount, isAddingAccount, addAccountError, addAccountSuccess, monitoredAccounts, accountsError
  const [allReceivedNotifications, setAllReceivedNotifications] = useState<Notification[]>([]); 
  const [isLoading, setIsLoading] = useState(false); // May or may not be needed depending on final functionality
  const supabase = createClient();
  // const channelRef = useRef<RealtimeChannel | null>(null); // Removed if realtime features are removed
  // const dailyClearTimerRef = useRef<NodeJS.Timeout | null>(null); // Removed if notification logic is removed/simplified

  // Removed useEffect for dailyClearTimerRef if notifications are simplified or removed
  // Removed useEffect for Realtime setup (new-tweets-notifications) if Twitter monitoring is removed
  // Removed handleAddAccount function
  // Removed formatTimeAgo function if not used elsewhere

  // Dummy effect to simulate loading or fetching some initial dashboard data (e.g., user stats, recent videos)
  useEffect(() => {
    setIsLoading(true);
    // Replace with actual data fetching for AI Baby Podcast dashboard if needed
    setTimeout(() => {
      // Example: Fetch recently created videos or user stats
      // For now, just setting loading to false
      setIsLoading(false);
    }, 1000);
  }, []);

  // This component will now primarily display general dashboard information for AI Baby Podcast
  // or serve as a placeholder for future dashboard widgets.

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for Dashboard Widgets - e.g., Stats, Quick Actions */}
        <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-3">欢迎回来!</h3>
          <p className="text-gray-400">
            这里是您的 AI Baby Podcast 控制台。您可以在这里管理您的视频，查看统计数据，并创建新的内容。
          </p>
        </div>

        <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-3">快速导航</h3>
          <ul className="space-y-2">
            {/* Add more relevant links as needed */}
          </ul>
        </div>
        
        {/* Example Stats Card - replace with actual data */}
        <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-3">视频统计 (示例)</h3>
          <div className="space-y-2">
            <p className="text-gray-400">总视频数: <span className="font-semibold text-white">0</span></p>
            <p className="text-gray-400">总观看次数: <span className="font-semibold text-white">0</span></p>
            {/* Add more stats as the application develops */}
          </div>
        </div>
      </div>

      {/* Section for notifications - simplified or to be adapted for AI Baby Podcast events */}
      {allReceivedNotifications.length > 0 && (
        <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">最新通知</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allReceivedNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-md ${notification.isImportant ? 'bg-blue-900/50 border border-blue-700' : 'bg-[#161b22]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{notification.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500">加载控制台数据...</p>
        </div>
      )}
    </div>
  );
}