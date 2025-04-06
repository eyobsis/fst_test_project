"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general login error when user types
    if (loginError) {
      setLoginError('');
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setLoginError('');
      
      try {
        // Initialize the database first
        await fetch('/api/init', { method: 'GET' });
        
        // Then attempt to login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Get the return URL from query parameters or default to dashboard
          const params = new URLSearchParams(window.location.search);
          const returnUrl = params.get('returnUrl') || '/dashboard';
          
          router.push(returnUrl);
        } else {
          setLoginError(data.error || 'Invalid email or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#1e293b]/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In to Your Account</h1>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
              <p className="text-red-500 text-sm">{loginError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-sm text-[#ff9800] hover:underline">
                  Forgot password?
                </Link>
              </div>
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#ff9800] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}