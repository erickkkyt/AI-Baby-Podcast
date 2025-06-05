'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9E5] text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-blue-400 mr-2">AI Baby Generator</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-800 text-blue-200">AI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Create viral videos featuring baby hosts who talk like adults, transforming ordinary content into engaging social media sensations.
            </p>
            <div className="mt-4 mb-6">
              <a href="https://www.producthunt.com/products/ai-baby-generator?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ai-baby-generator" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                <Image src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=970402&theme=light&t=1749039627017" alt="AI Baby Generator - Hear your baby's future speech, AI-voiced today | Product Hunt" style={{width: '160px', height: '35px'}} width="160" height="35" />
              </a>
            </div>
            <div className="flex space-x-4">
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <a href="mailto:m15905196940@163.com" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#f5eecb] flex flex-col md:flex-row justify-start items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AI Baby Generator. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 md:ml-170">
            <a href="mailto:support@babypodcast.pro" className="text-xs text-gray-400 hover:text-white transition-colors">
              Email: support@babypodcast.pro
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}