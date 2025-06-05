import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import WhatIs from '../components/WhatIs';
import HowTo from '../components/HowTo';
import Why from '../components/Why';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import type { Metadata } from 'next';

const newTitle = "AI Baby Generator: Create Unique AI Baby Pictures&Videos";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Turn your ideas into adorable, shareable baby videos with AI. Customize features, upload images, and choose your style. Start creating memories today!',
  alternates: {
    canonical: 'https://www.babypodcast.pro',
  },
  openGraph: {
    title: newTitle,
    description: 'Turn your ideas into adorable, shareable baby pictures&videos with AI. Customize features, upload images, and choose your style. Start creating memories today!',
    url: 'https://www.babypodcast.pro',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'AI Baby Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Turn your ideas into adorable, shareable baby videos with AI. Customize features, upload images, and choose your style. Start creating memories today!',
    images: ['/social-share.png'],
  },
  // If other metadata properties exist, they should be preserved.
  // This edit assumes we are adding this to a new or simple existing metadata object.
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <WhatIs />
        <HowTo />
        <Why />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

