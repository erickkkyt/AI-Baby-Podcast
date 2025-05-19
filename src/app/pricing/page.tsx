'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/Header'; // 标准 Header
import Footer from '@/components/Footer'; // 标准 Footer (假设存在)
// import { type User } from '@supabase/supabase-js'; // 如果 User 类型被 Pricing 逻辑使用 (看起来没有直接使用)

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkLogin() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkLogin();
  }, [supabase]);

  const plans = [
    {
      name: 'Starter Plan',
      description: 'Perfect for new BabyPodcast creators',
      monthlyPrice: '0',
      annualPrice: '0',
      features: [
        'Basic baby avatar templates',
        'Limited voice options',
        'Standard animation quality',
        'Up to 720p export resolution',
      ],
      cta: isLoggedIn ? 'Start Creating' : 'Login/Sign Up',
      ctaLink: isLoggedIn ? '/dashboard' : '/login',
      highlight: false,
    },
    {
      name: 'Creator Plan',
      description: 'For serious content creators',
      monthlyPrice: '39',
      annualPrice: '29',
      features: [
        'Advanced baby avatar customization',
        'Premium voice library access',
        'HD animation quality',
        'Multi-platform export formats',
        'Script template library',
      ],
      cta: 'Select Creator Plan',
      ctaLink: '/subscribe?plan=creator', // 你可能需要一个订阅页面或逻辑
      highlight: true,
    },
    {
      name: 'Pro Plan',
      description: 'For professional content studios',
      monthlyPrice: '99',
      annualPrice: '79',
      features: [
        'Unlimited avatar customization',
        'Full voice library with effects',
        '4K animation quality',
        'All platform export formats',
        'Advanced lip-sync technology',
        'Priority rendering',
        'White-label exports',
      ],
      cta: 'Select Pro Plan',
      ctaLink: '/subscribe?plan=pro', // 你可能需要一个订阅页面或逻辑
      highlight: false,
    },
  ];

  const switchBg = annual ? 'bg-blue-600' : 'bg-gray-200';
  const switchTranslate = annual ? 'translate-x-6' : 'translate-x-1';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-16 md:pt-20"> {/* Adjust pt to match Header height */}
        {/* This is the main content from your Pricing.tsx component */}
        <section id="pricing" className="py-12 md:py-20"> {/* Adjusted padding */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                BabyPodcast Creation Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right plan to create viral BabyPodcast content that drives views and generates revenue.
              </p>
              
              <div className="mt-8 flex items-center justify-center">
                <span className={`mr-3 text-sm ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Annual
                </span>
                <button 
                  onClick={() => setAnnual(!annual)} 
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${switchBg}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${switchTranslate}`}></span>
                </button>
                <span className={`ml-3 text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                {annual && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Save 20%
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col ${plan.highlight ? 'border-blue-600 relative shadow-lg ring-2 ring-blue-500' : 'border-gray-200'}`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 inset-x-0 py-1.5 text-xs text-center text-white font-medium bg-blue-600">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`pt-8 ${plan.highlight ? 'pb-6' : 'pb-8'} px-6 ${plan.highlight ? 'pt-12' : ''} text-center`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-500 mb-6 h-12 md:h-10">{plan.description}</p> {/* Adjusted height for consistency */}
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
                    </div>
                    {annual && plan.annualPrice !== plan.monthlyPrice && parseInt(plan.annualPrice) > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Annual billing ${parseInt(plan.annualPrice, 10) * 12}
                      </p>
                    )}
                    {plan.monthlyPrice === '0' && (
                       <p className="mt-1 text-sm text-gray-500">Forever Free</p>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 flex-grow flex flex-col justify-between"> {/* Added flex-grow and justify-between */}
                    <ul className="space-y-4 mb-8 h-48 md:h-52"> {/* Adjusted height for features list */}
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto"> {/* Pushes button to the bottom */}
                      <Link 
                        href={plan.ctaLink}
                        className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                          plan.highlight 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : plan.monthlyPrice === '0' 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}