import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 bg-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b]/10 via-[#0f172a]/15 to-[#1e293b]/10 backdrop-blur-[2px]"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-block px-8 py-6 bg-gradient-to-br from-[#1e293b]/30 via-[#0f172a]/40 to-[#1e293b]/30 backdrop-blur-md rounded-2xl mb-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                Your Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9800] to-[#ff5722]">Office</span> Solution
              </h1>
              <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto text-gray-200">
                Connect and collaborate from anywhere, anytime.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link 
                href="/pricing" 
                className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] text-white px-8 py-3 rounded-md hover:opacity-90 transition-all duration-300 text-lg font-medium"
              >
                View Pricing
              </Link>
              <Link 
                href="/features" 
                className="bg-transparent border border-[#ff9800] text-[#ff9800] px-8 py-3 rounded-md hover:bg-[#ff9800]/10 transition-all duration-300 text-lg font-medium"
              >
                See Features
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Preview */}
        <section className="py-16 px-4 bg-[#1e293b]/50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-[#ff9800]">Teamify</span>?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#ff9800]/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p>Work together seamlessly with your team members regardless of location.</p>
              </div>
              
              <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#ff9800]/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Video Conferencing</h3>
                <p>High-quality video meetings with screen sharing and recording capabilities.</p>
              </div>
              
              <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#ff9800]/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Environment</h3>
                <p>Enterprise-grade security to keep your team's communications and data safe.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/features" 
                className="inline-flex items-center text-[#ff9800] hover:underline"
              >
                <span>Explore all features</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform how your team works?</h2>
                  <p className="text-gray-400">
                    Start your 14-day free trial today. No credit card required.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/pricing" 
                    className="bg-[#ff9800] text-white px-6 py-3 rounded-md hover:bg-[#e68a00] transition-all duration-300 text-center"
                  >
                    View Pricing
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-transparent border border-[#ff9800] text-[#ff9800] px-6 py-3 rounded-md hover:bg-[#ff9800]/10 transition-all duration-300 text-center"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}