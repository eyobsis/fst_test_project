import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            About <span className="text-[#ff9800]">Teamify</span>
          </h1>
          
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-8 rounded-lg mb-12">
            <p className="text-lg mb-6">
              Teamify is a revolutionary virtual office platform designed to bring remote teams together in a seamless digital workspace. Our mission is to eliminate the barriers of distance and create an environment where collaboration feels natural and productive.
            </p>
            
            <p className="text-lg mb-6">
              Founded in 2023, we've quickly grown to serve thousands of companies worldwide, helping teams stay connected, engaged, and productive regardless of their physical location.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-[#ff9800] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p>Bring your team together in a virtual space that feels like you're all in the same room.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#ff9800] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
                <p>Enterprise-grade security ensures your team's communications and data remain private and protected.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#ff9800] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Boost Productivity</h3>
                <p>Our tools are designed to enhance workflow and increase productivity across your organization.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <p className="text-[#ff9800]">Co-Founder & CEO</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}