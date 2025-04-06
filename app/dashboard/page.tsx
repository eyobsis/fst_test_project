"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    website: '',
    size: '',
  });
  const [error, setError] = useState('');
  
  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];
  
  // Add this to your imports
  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  
  // Add this to your state variables
  const [showSetupCompleteNotification, setShowSetupCompleteNotification] = useState(false);
  
  // Update the fetchData function in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/auth/check');
        const authData = await authResponse.json();
        
        if (!authResponse.ok || !authData.authenticated) {
          router.push('/login?returnUrl=/dashboard');
          return;
        }
        
        setUser(authData.user);
        setHasActiveSubscription(authData.hasActiveSubscription);
        setSubscription(authData.subscription);
        setShowSetupCompleteNotification(authData.showSetupCompleteNotification);
        
        // Fetch company data
        const companyResponse = await fetch('/api/companies');
        const companyData = await companyResponse.json();
        
        if (companyResponse.ok && companyData.company) {
          setCompany(companyData.company);
          setEditFormData({
            name: companyData.company.name || '',
            website: companyData.company.website || '',
            size: companyData.company.size || '',
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a subscription card to the dashboard grid
  // Add this after the Company Information Card
  <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg md:col-span-3 mt-6">
    <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
    
    {!hasActiveSubscription ? (
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-md p-4 mb-4">
        <p className="text-yellow-500 mb-2">You don't have an active subscription</p>
        <p className="text-sm text-gray-300 mb-4">
          To manage your company information and access all features, please select a subscription plan.
        </p>
        <Link 
          href="/pricing" 
          className="px-4 py-2 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300 inline-block"
        >
          View Pricing Plans
        </Link>
      </div>
    ) : (
      <div className="bg-green-500/20 border border-green-500 rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-500 font-medium">Active Subscription</p>
            <h3 className="text-xl font-bold mt-1">{subscription.plan_name}</h3>
            <p className="text-sm text-gray-300 mt-2">
              Valid until: {new Date(subscription.end_date).toLocaleDateString()}
            </p>
          </div>
          <Link 
            href="/billing" 
            className="px-4 py-2 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300 text-sm"
          >
            Manage Subscription
          </Link>
        </div>
      </div>
    )}
  </div>
  
  // Update the handleEditSubmit and handleDeleteCompany functions to handle subscription errors
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFormData.name,
          website: editFormData.website,
          size: editFormData.size,
          logoUrl: company.logo_url,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCompany(data.company);
        setIsEditing(false);
      } else {
        if (data.requiresSubscription) {
          setError('You need an active subscription to update company information');
          setTimeout(() => {
            router.push('/pricing');
          }, 3000);
        } else {
          setError(data.error || 'Failed to update company information');
        }
      }
    } catch (error) {
      console.error('Error updating company:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteCompany = async () => {
    if (!confirm('Are you sure you want to delete your company? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCompany(null);
        router.push('/setup');
      } else {
        if (data.requiresSubscription) {
          setError('You need an active subscription to delete company information');
          setTimeout(() => {
            router.push('/pricing');
          }, 3000);
        } else {
          setError(data.error || 'Failed to delete company');
        }
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#ff9800] rounded-full border-t-transparent"></div>
        </div>
        <Footer />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            
            {user && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <button
                  onClick={() => router.push('/profile')}
                  className="mt-4 px-4 py-2 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300 text-sm"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
          
          {/* Company Information Card */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            
            {!company && (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">You haven't set up your company yet</p>
                <button
                  onClick={() => router.push('/setup')}
                  className="px-4 py-2 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300"
                >
                  Set Up Company
                </button>
              </div>
            )}
            
            {company && !isEditing && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center border border-[#ff9800]/50">
                    {company.logo_url ? (
                      <Image 
                        src={company.logo_url} 
                        alt={company.name} 
                        width={64} 
                        height={64} 
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">{company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{company.name}</h3>
                    {company.website && (
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#ff9800] hover:underline"
                      >
                        {company.website}
                      </a>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Company Size</p>
                  <p>{company.size}</p>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300 text-sm"
                  >
                    Edit Company
                  </button>
                  <button
                    onClick={handleDeleteCompany}
                    className="px-4 py-2 bg-[#1e293b] border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 text-sm"
                  >
                    Delete Company
                  </button>
                </div>
              </div>
            )}
            
            {company && isEditing && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-1">Company Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={editFormData.website}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                  />
                </div>
                
                <div>
                  <label htmlFor="size" className="block text-sm font-medium mb-1">Company Size</label>
                  <select
                    id="size"
                    name="size"
                    value={editFormData.size}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                    required
                  >
                    <option value="">Select Company Size</option>
                    {companySizes.map((size, index) => (
                      <option key={index} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
            <p className="text-3xl font-bold text-[#ff9800]">0</p>
            <p className="text-sm text-gray-400 mt-2">No employees added yet</p>
          </div>
          
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-[#ff9800]">0</p>
            <p className="text-sm text-gray-400 mt-2">No projects created yet</p>
          </div>
          
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <div className="text-sm text-gray-400 mt-2">
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
      
      {showSetupCompleteNotification && (
        <div className="bg-green-500/20 border border-green-500 rounded-md p-4 mx-auto max-w-4xl mt-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-green-500 font-medium">Office Setup Complete!</p>
              <p className="text-sm text-gray-300">Your office has been successfully set up. You now have full access to manage your company information.</p>
            </div>
            <button 
              onClick={() => setShowSetupCompleteNotification(false)}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  );
}