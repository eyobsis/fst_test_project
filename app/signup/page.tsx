"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general signup error when user types
    if (signupError) {
      setSignupError('');
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSignupError('');
      
      try {
        // Initialize the database first
        await fetch('/api/init', { method: 'GET' });
        
        // Then attempt to signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // After successful signup, log the user in
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
          
          if (loginResponse.ok) {
            // Redirect to setup page after successful login
            router.push('/setup');
          } else {
            // If login fails, redirect to login page
            router.push('/login');
          }
        } else {
          setSignupError(data.error || 'Failed to create account');
        }
      } catch (error) {
        console.error('Signup error:', error);
        setSignupError('An unexpected error occurred. Please try again.');
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
          <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
          
          {signupError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
              <p className="text-red-500 text-sm">{signupError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            
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
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#ff9800] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-6 text-xs text-center text-gray-400">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#ff9800] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#ff9800] hover:underline">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}