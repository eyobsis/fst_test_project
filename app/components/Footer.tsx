"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmail('');
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/90 backdrop-blur-md text-white border-t border-gray-800/30">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-5 right-5 bg-green-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Thanks for subscribing! You're now on our list.</span>
          </div>
        </div>
      )}
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 pb-16 border-b border-white/10">
          <div className="max-w-md mb-12 lg:mb-0 text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center lg:justify-start">
              <span className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] w-8 h-8 rounded-md mr-3 flex items-center justify-center text-white">VO</span>
              Virtual Office
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Creating collaborative virtual workspaces for teams of all sizes. Our platform helps teams connect, collaborate, and create from anywhere in the world.
            </p>
            <div className="flex space-x-5 justify-center lg:justify-start">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff9800] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff9800] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff9800] transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff9800] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff9800] transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-center lg:text-left">Stay Updated</h3>
            <p className="text-gray-300 mb-6 text-center lg:text-left">
              Subscribe to our newsletter for the latest updates, features, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-5 py-3 bg-[#0f172a]/50 backdrop-blur-sm border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9800] focus:border-transparent"
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:opacity-90 text-white font-medium py-3 px-5 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe to Newsletter'
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Middle Section with Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              <span className="relative z-10">Product</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff9800] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              <span className="relative z-10">Resources</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff9800] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              <span className="relative z-10">Company</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff9800] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              <span className="relative z-10">Legal</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff9800] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-[#ff9800] transition-colors flex items-center justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 bg-[#ff9800] rounded-full mr-2 opacity-70"></span>
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">Ready to transform your team's collaboration?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of teams already using Virtual Office to boost productivity and streamline communication.
          </p>
          <Link 
            href="/pricing" 
            className="inline-block bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:opacity-90 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800/30 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            © {new Date().getFullYear()} Virtual Office. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="text-gray-400 hover:text-[#ff9800] text-sm transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-[#ff9800] text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-[#ff9800] text-sm transition-colors">
              Cookies
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-[#ff9800] text-sm transition-colors">
              Sitemap
            </Link>
            <Link href="/accessibility" className="text-gray-400 hover:text-[#ff9800] text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}