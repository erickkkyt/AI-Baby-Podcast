'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LinkIcon, UploadCloud, FileText, Settings2, Sparkles, Film } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  isImportant: boolean;
}

// Placeholder for YouTube video data
interface YouTubeVideo {
  id: string;
  videoId: string; // YouTube video ID
  title: string;
}

export default function DashboardClient() {
  const [allReceivedNotifications, setAllReceivedNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Keep loading for initial data fetch idea
  // const supabase = createClient(); // supabase client, uncomment if needed for future client-side supabase calls

  // Mocked YouTube videos
  const youtubeVideos: YouTubeVideo[] = [
    { id: '1', videoId: 'dQw4w9WgXcQ', title: '示例视频 1 (Rick Astley - Never Gonna Give You Up)' },
    { id: '2', videoId: 'QH2-TGUlwu4', title: '示例视频 2 (Official Video)' },
    { id: '3', videoId: 'L_LUpnjgPso', title: '示例视频 3 (Short Film)' },
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      // Example: Fetch recently created videos or user stats
      // For now, just setting loading to false
      setIsLoading(false);
    }, 500); // Shorter delay
  }, []);

  return (
    <div className="space-y-8">
      {/* Top: Video Creation Input Area */}
      <section className="bg-[#161b22] p-6 rounded-lg shadow-md">
        <textarea
          placeholder="Describe what you want to create"
          className="w-full h-24 p-3 bg-[#0d1117] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 text-white resize-none"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
            <LinkIcon size={16} />
            <span>URL</span>
          </button>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
            <UploadCloud size={16} />
            <span>Files</span>
          </button>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
            <FileText size={16} />
            <span>Audio script</span>
          </button>
          <button className="ml-auto flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
            <Settings2 size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors">
                <Sparkles size={16} />
                <span>Full AI</span>
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
                Smart match
            </button>
        </div>
      </section>

      {/* Bottom: YouTube Iframe Examples (Moved Up) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">案例参考</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map(video => (
            <div key={video.id} className="bg-[#1c2128] p-4 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow">
              <div className="aspect-video overflow-hidden rounded-md mb-3">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?loop=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <h4 className="text-sm font-medium text-white truncate">{video.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Middle: My Projects / Stats (Moved Down) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white flex items-center"><Film size={24} className="mr-3 text-purple-400"/> My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">视频统计 (示例)</h3>
            <div className="space-y-2">
              <p className="text-gray-400">总视频数: <span className="font-semibold text-white">12</span></p>
              <p className="text-gray-400">总观看次数: <span className="font-semibold text-white">3,450</span></p>
              <p className="text-gray-400">待处理: <span className="font-semibold text-yellow-400">2</span></p>
            </div>
          </div>
          <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">最新项目</h3>
             <div className="space-y-2 text-sm">
                <p className="text-gray-300 truncate">项目 Alpha - 最终渲染</p>
                <p className="text-gray-500 text-xs">2 小时前</p>
             </div>
          </div>
          <div className="bg-[#1c2128] p-6 rounded-lg shadow-lg flex items-center justify-center text-gray-500 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <p>查看所有项目...</p>
          </div>
        </div>
      </section>

      {/* Notifications Section (Existing) */}
      {allReceivedNotifications.length > 0 && (
        <section className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">最新通知</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allReceivedNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-md ${notification.isImportant ? 'bg-purple-800/60 border border-purple-600' : 'bg-[#161b22]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white">{notification.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{notification.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500">加载仪表盘数据...</p>
        </div>
      )}
    </div>
  );
}