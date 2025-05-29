'use client';

export default function WhatIs() {
  // 定义四个YouTube Shorts视频ID
  const videoIds = [
    'EuWy150zyp8', // https://www.youtube.com/shorts/EuWy150zyp8
    'Oj_2aW7p0qc', // https://www.youtube.com/shorts/Oj_2aW7p0qc
    'XKEbMspIrfo', // https://www.youtube.com/shorts/XKEbMspIrfo
    'SA6SqTUiimY'  // https://www.youtube.com/shorts/SA6SqTUiimY
  ];

  return (    <section id="whatIs" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Is BabyGenerator?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            BabyGenerator is a viral trend taking over TikTok and YouTube Shorts. These AI-generated videos feature baby avatars as hosts discussing various topics in entertaining and engaging ways. Combining advanced AI animation with creative scripting, BabyGenerator creates realistic baby faces that sync perfectly with audio.
          </p>
        </div>

        {/* 视频网格展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {videoIds.map((videoId, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full max-w-xs aspect-[9/16] rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 bg-black relative mx-auto">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?loop=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
                  title={`Baby Podcast Example ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                
                {/* 遮挡上下信息的覆盖层 */}
                <div className="absolute top-0 left-0 w-full h-20 bg-black pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-14 bg-black pointer-events-none"></div>
              </div>
              
            </div>
          ))}
        </div>

        {/* 特点列表 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Novel Content Format</h3>
            <p className="text-gray-600">The BabyPodcast format offers a novel twist on traditional podcasts, making complex topics more accessible and entertaining.</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Faceless Content Creation</h3>
            <p className="text-gray-600">BabyPodcast allows creators to produce high-engagement, faceless content optimized for algorithm-based distribution platforms without revealing their identity.</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Evolving Technology</h3>
            <p className="text-gray-600">The BabyGenerator phenomenon represents the perfect intersection of AI technology, creative content production, and social media virality.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 