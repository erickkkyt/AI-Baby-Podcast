'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PricingPage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkLogin() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkLogin();
  }, [supabase]);

  const subscriptionPlans = [
    {
      name: 'Starter Plan',
      description: 'Perfect for individual creators getting started',
      monthlyPrice: '19.9',
      annualPrice: '15.9', // 年付8折优惠
      credits: 200,
      bonusCredits: 0,
      totalCredits: 200,
            features: [        '200 credits/month',        'No watermark output',         'Standard baby avatar templates',        'Email support',        'Credits never expire'      ],
      cta: 'Get Starter Plan',
      ctaLink: isLoggedIn ? '/dashboard?plan=basic' : '/login',
      highlight: false,
    },
    {
      name: 'Pro Plan',
      description: 'For content creators who need more videos',
      monthlyPrice: '49.9',
      annualPrice: '39.9', // 年付8折优惠
      credits: 500,
      bonusCredits: 50,
      totalCredits: 550,
            features: [        '550 credits/month (10% extra)',        '+50 bonus credits (10% extra)',        'Priority processing queue',        'Advanced avatar customization',        'Online customer support'      ],
      cta: 'Get Pro Plan',
      ctaLink: isLoggedIn ? '/dashboard?plan=pro' : '/login',
      highlight: true,
    },
    {
      name: 'Creator Plan',
      description: 'For professional creators and small studios',
      monthlyPrice: '99.9',
      annualPrice: '79.9', // 年付8折优惠
      credits: 1000,
      bonusCredits: 200,
      totalCredits: 1200,
            features: [        '1200 credits/month (20% extra)',        '+200 bonus credits (20% extra)',        'Commercial use license',        'Premium avatar collection',        'Custom requirements support'      ],
      cta: 'Get Creator Plan',
      ctaLink: isLoggedIn ? '/dashboard?plan=creator' : '/login',
      highlight: false,
    },
  ];

     const creditPacks = [     {       name: 'Small Pack',       credits: 50,       price: '5.9',       description: 'Perfect for testing or occasional use',       cta: 'Get Small Pack'     },     {       name: 'Medium Pack',        credits: 150,       price: '16.9',       description: 'Great for regular content creation',       cta: 'Get Medium Pack',       highlight: true     },     {       name: 'Large Pack',       credits: 400,        price: '39.9',       description: 'Best value for high-volume creators',       cta: 'Get Large Pack'     }   ];

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                AI Baby Podcast Pricing
              </h1>
                             <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">                 Create personalized AI baby podcast videos with our credit-based system.                  <br />                 Choose your plan or buy credits as needed.               </p>
              
              
            </div>

            {/* Subscription Plans */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {subscriptionPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col ${plan.highlight ? 'border-blue-600 relative shadow-lg ring-2 ring-blue-500' : 'border-gray-200'}`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 inset-x-0 py-1.5 text-xs text-center text-white font-medium bg-blue-600">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`pt-8 ${plan.highlight ? 'pb-6 pt-12' : 'pb-8'} px-6 text-center`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-500 mb-6 h-12">{plan.description}</p>
                    
                                         <div className="mt-4 flex items-baseline justify-center">                       <span className="text-4xl font-extrabold tracking-tight text-gray-900">                         ${plan.monthlyPrice}                       </span>                       <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>                     </div>
                  </div>
                  
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 flex-grow flex flex-col justify-between">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <Link 
                        href={plan.ctaLink}
                        className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                          plan.highlight 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
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

            {/* Credit Packs Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Buy Credits On-Demand
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Need extra credits? Purchase additional credits. Credits never expire.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {creditPacks.map((pack, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl shadow-sm border p-6 text-center ${pack.highlight ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200'}`}
                >
                  {pack.highlight && (
                    <div className="mb-4">
                      <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                  <p className="text-gray-500 mb-4">{pack.description}</p>
                  
                                     <div className="mb-4">                     <div className="text-3xl font-extrabold text-gray-900">${pack.price}</div>                     <div className="text-lg text-gray-600">{pack.credits} credits</div>                   </div>
                  
                  <Link 
                    href={isLoggedIn ? `/dashboard?credits=${pack.credits}` : '/login'}
                    className={`w-full block py-3 px-6 rounded-lg font-medium transition-colors ${
                      pack.highlight 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {pack.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* FAQ or Info Section */}
            <div className="mt-20 text-center">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How Credits Work</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                                     <div>                     <h4 className="font-semibold text-gray-900 mb-2">🎬 1 Credit = 1 Second</h4>                     <p className="text-gray-600 text-sm">A 15-second baby podcast video (540P) costs 15 credits</p>                   </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">♾️ Never Expire</h4>
                    <p className="text-gray-600 text-sm">Your credits roll over month to month, no waste</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🎁 Bonus Credits</h4>
                    <p className="text-gray-600 text-sm">Higher plans get extra credits as a bonus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}