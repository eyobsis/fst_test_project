"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Setup() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    companyName: '',
    companySize: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setUserInfo(data.user);
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || ''
          }));
        } else {
          // If not authenticated, redirect to login
          router.push('/login?returnUrl=/setup');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, [router]);
  
  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general setup error when user types
    if (setupError) {
      setSetupError('');
    }
  };
  
  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setLogoPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      valid = false;
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
      valid = false;
    }
    
    // Validate password if user is setting it up
    if (!userInfo) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSetupError('');
      
      try {
        // Initialize the database first
        await fetch('/api/init', { method: 'GET' });
        
        // If user is not logged in, create account first
        if (!userInfo) {
          const signupResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });
          
          if (!signupResponse.ok) {
            const signupError = await signupResponse.json();
            setSetupError(signupError.error || 'Failed to create account');
            setIsLoading(false);
            return;
          }
          
          // Login after signup
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
          
          if (!loginResponse.ok) {
            const loginError = await loginResponse.json();
            setSetupError(loginError.error || 'Failed to log in');
            setIsLoading(false);
            return;
          }
        }
        
        // Upload logo if selected
        let logoUrl = null;
        if (logoFile) {
          const formData = new FormData();
          formData.append('logo', logoFile);
          
          const logoResponse = await fetch('/api/upload/logo', {
            method: 'POST',
            body: formData,
          });
          
          if (logoResponse.ok) {
            const logoData = await logoResponse.json();
            logoUrl = logoData.url;
          }
        }
        
        // Create company profile
        const response = await fetch('/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.companyName,
            website: formData.companyWebsite,
            size: formData.companySize,
            logoUrl: logoUrl,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Update user profile
          const userResponse = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              companyId: data.company.id,
            }),
          });
          
          if (userResponse.ok) {
            // Redirect to dashboard after successful setup
            router.push('/dashboard');
          } else {
            const userError = await userResponse.json();
            setSetupError(userError.error || 'Failed to update user profile');
          }
        } else {
          setSetupError(data.error || 'Failed to create company profile');
        }
      } catch (error) {
        console.error('Setup error:', error);
        setSetupError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-[#1e293b]/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-center mb-6">Set Up Your Office</h1>
          
          {setupError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
              <p className="text-red-500 text-sm">{setupError}</p>
            </div>
          )}
          
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center border border-[#ff9800]/50 relative cursor-pointer"
              onClick={handleLogoClick}
            >
              {logoPreview ? (
                <Image 
                  src={logoPreview} 
                  alt="Company Logo" 
                  width={80} 
                  height={80} 
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm text-gray-400">Logo here</span>
              )}
              <div className="absolute -bottom-1 right-0 bg-[#ff9800] w-5 h-5 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1">Enter Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                placeholder="First & Last Name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1">Enter Your Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                placeholder="Email Here"
                readOnly={!!userInfo} // Make email readonly if user is already logged in
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-xs font-medium mb-1">Your Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                placeholder="Name Here"
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>
            
            <div>
              <label htmlFor="companyWebsite" className="block text-xs font-medium mb-1">Your Company Website</label>
              <input
                type="text"
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                placeholder="Website Here"
              />
            </div>
            
            <div>
              <label htmlFor="companySize" className="block text-xs font-medium mb-1">Company Size *</label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
              >
                <option value="">Choose Your Company Size</option>
                {companySizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
              {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>}
            </div>
            
            {!userInfo && (
              <>
                <div>
                  <label htmlFor="password" className="block text-xs font-medium mb-1">Create Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                    placeholder="Type Password"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff9800]"
                    placeholder="Confirm Password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300 flex items-center justify-center mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}