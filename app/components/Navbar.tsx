"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Use the project's existing auth system
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // Call logout API endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Clear tokens regardless of API response
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { isLoggedIn, user, logout, isLoading };
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1e293b]/90 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-[#1e293b]/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] text-white w-10 h-10 rounded-lg flex items-center justify-center mr-2 shadow-md">
            <span className="font-bold text-xl">T</span>
          </div>
          <span className="text-white text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9800] to-[#ff5722]">team</span>ify
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.path} 
              className={`px-4 py-2 rounded-md transition-all ${
                pathname === item.path
                  ? 'text-[#ff9800] font-medium'
                  : 'text-white hover:text-[#ff9800] hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#ff9800] border-t-transparent animate-spin"></div>
          ) : isLoggedIn ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button 
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 transition-colors rounded-full pl-3 pr-2 py-1.5"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <span className="text-white text-sm">
                  {user?.name?.split(' ')[0] || user?.username}
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#ff9800] bg-gradient-to-br from-[#ff9800] to-[#ff5722] flex items-center justify-center text-white font-medium">
                  {(user?.name || user?.username)?.substring(0, 2).toUpperCase() || 'US'}
                </div>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white font-medium">{user?.name || user?.username}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button 
                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800] border-t border-gray-700"
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-[#ff9800] px-4 py-2 rounded-md hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] text-white px-5 py-2 rounded-md hover:opacity-90 transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-1 rounded-md hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#1e293b]/95 backdrop-blur-md rounded-b-lg p-4 border-t border-gray-700/50 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Features', path: '/features' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.path} 
                  className={`px-4 py-2 rounded-md ${
                    pathname === item.path
                      ? 'text-[#ff9800] bg-[#ff9800]/10 font-medium'
                      : 'text-white hover:text-[#ff9800] hover:bg-white/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-3 border-t border-gray-700/50">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#ff9800] border-t-transparent animate-spin"></div>
                  </div>
                ) : isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-2 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff9800] bg-gradient-to-br from-[#ff9800] to-[#ff5722] flex items-center justify-center text-white font-medium">
                        {(user?.name || user?.username)?.substring(0, 2).toUpperCase() || 'US'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user?.name || user?.username}</p>
                        <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800] rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800] rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-white hover:bg-[#ff9800]/10 hover:text-[#ff9800] rounded-md mt-2"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/login" 
                      className="text-white hover:text-[#ff9800] px-4 py-2 rounded-md hover:bg-white/5 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] text-white px-4 py-3 rounded-md hover:opacity-90 transition-all text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    );
}