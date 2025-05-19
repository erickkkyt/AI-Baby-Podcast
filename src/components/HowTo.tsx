'use client';

export default function HowTo() {
    const steps = [    {      title: 'Generate Baby Avatar Images',      description: 'Create high-quality baby avatar images using AI tools like Midjourney. Customize your BabyPodcast characters with headphones, microphones, and podcast studio backgrounds.',      icon: (        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />        </svg>      ),    },    {      title: 'Craft Engaging Scripts',      description: "Develop scripts that balance humor, relevance, and engagement. Focus on either parodying existing podcasts, discussing trends, or creating fictional scenarios.",      icon: (        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />        </svg>      ),    },    {      title: 'Generate AI Voices',      description: 'Use AI voice tools like ElevenLabs to produce audio that balances childlike qualities with clarity. Find the right voice modulation that fits your BabyPodcast style.',      icon: (        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />        </svg>      ),    },    {      title: 'Animate & Edit Your Video',      description: 'Use animation tools like Hedra to create synchronized lip movements and facial expressions that match your audio track. Edit with tools like CapCut, adding subtitles and effects.',      icon: (        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />        </svg>      ),    },  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">        <div className="text-center mb-16">          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How To Create BabyPodcast Content</h2>          <p className="text-xl text-gray-600 max-w-3xl mx-auto">            Follow these steps to create engaging AI BabyPodcast videos          </p>        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`lg:flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="hidden lg:flex lg:w-1/2 justify-center">
                    <div className="relative">
                      {/* Step circle */}
                      <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10 relative text-blue-600">
                        {step.icon}
                      </div>
                      {/* Step number */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <div className={`lg:w-1/2 p-6 bg-white rounded-xl shadow-sm border border-gray-100 ${index % 2 === 0 ? 'lg:ml-6' : 'lg:mr-6'}`}>
                    {/* Mobile step display */}
                    <div className="flex items-center mb-4 lg:hidden">
                      <div className="flex-shrink-0 relative mr-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    {/* Desktop title */}
                    <h3 className="hidden lg:block text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 