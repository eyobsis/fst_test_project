"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#1e293b]/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
              <p className="text-gray-400 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                    placeholder="Enter your email"
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
                
                <div className="mt-6 text-center">
                  <Link href="/login" className="text-[#ff9800] hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff9800]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to <span className="text-white">{email}</span>. Please check your inbox and follow the instructions to reset your password.
              </p>
              
              <div className="bg-[#1e293b] p-4 rounded-md mb-6">
                <p className="text-sm text-gray-400">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="text-[#ff9800] hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <Link 
                href="/login" 
                className="text-[#ff9800] hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}