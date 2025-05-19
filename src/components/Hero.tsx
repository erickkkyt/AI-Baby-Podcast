'use client';

import Link from 'next/link';
// import Image from 'next/image'; // No longer needed Image component

export default function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              <span className="text-blue-600">AI Baby Podcast</span><br />Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Learn how to create, optimize, and monetize the latest viral trend taking TikTok and YouTube Shorts by storm. Join thousands of creators making AI baby podcast videos that generate millions of views!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-block bg-blue-600 text-white font-medium px-8 py-4 rounded-full text-center hover:bg-blue-700 transition-colors"
              >
                Start Creating
              </Link>
              <Link 
                href="#whatIs" 
                className="inline-block bg-gray-100 text-gray-800 font-medium px-8 py-4 rounded-full text-center hover:bg-gray-200 transition-colors"
              >
                See Examples
              </Link>
            </div>
            <div className="mt-8 text-gray-600 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-Generated Baby Podcast Hosts</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced Animation & Voice Technology</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Viral Content Creation Tools</span>
              </div>
            </div>
          </div>

          {/* Right Column: Video Embed Placeholder */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <p className="mb-2 text-lg text-center font-bold text-blue-700 bg-blue-100 px-4 py-2 rounded-lg shadow-lg">
              Popular BabyPodcast example with 3.6M views
            </p>
            <div className="w-56 mx-auto aspect-[9/16] rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200 bg-black relative">
              {/* YouTube Shorts embed */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/bP21tQhTkbY?loop=1&controls=0&rel=0&showinfo=0&modestbranding=1"
                title="Baby Podcast YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              
              {/* Overlays to hide title and footer */}
              <div className="absolute top-0 left-0 w-full h-20 bg-black pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-14 bg-black pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}