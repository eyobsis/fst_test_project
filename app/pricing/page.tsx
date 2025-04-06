"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type PricingPlan = {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  recommended?: boolean;
};

export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: {
        monthly: 9.99,
        yearly: 99.99,
      },
      features: [
        'Single office setup',
        'Basic company management',
        'Up to 10 employees',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: {
        monthly: 19.99,
        yearly: 199.99,
      },
      features: [
        'Multiple office setup',
        'Advanced company management',
        'Up to 50 employees',
        'Priority email support',
        'Analytics dashboard'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: {
        monthly: 49.99,
        yearly: 499.99,
      },
      features: [
        'Unlimited office setup',
        'Full company management',
        'Unlimited employees',
        '24/7 phone support',
        'Advanced analytics',
        'Custom integrations'
      ]
    }
  ];
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
          
          // If user already has an active subscription, redirect to dashboard
          if (data.hasActiveSubscription) {
            router.push('/dashboard');
          }
        } else {
          router.push('/login?returnUrl=/pricing');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleContinue = () => {
    if (!selectedPlan) return;
    
    const plan = pricingPlans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    router.push(`/checkout?plan=${selectedPlan}&cycle=${billingCycle}`);
  };
  
  const getYearlySavings = (plan: PricingPlan) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = monthlyCost - yearlyCost;
    const savingsPercentage = Math.round((savings / monthlyCost) * 100);
    
    return savingsPercentage;
  };
  
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include access to our core features.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-700"
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly <span className="text-[#ff9800] text-xs ml-1">(Save up to 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-[#1e293b]/80 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-[#ff9800] transform scale-105' 
                  : 'hover:transform hover:scale-105'
              } ${plan.recommended ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.recommended && (
                <div className="bg-[#ff9800] text-white text-center py-1 text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                  <span className="text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                
                {billingCycle === 'yearly' && (
                  <div className="mb-4 text-sm bg-green-500/20 text-green-400 py-1 px-2 rounded-md inline-block">
                    Save {getYearlySavings(plan)}%
                  </div>
                )}
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-[#ff9800] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2 rounded-md transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'bg-[#ff9800] text-white'
                      : 'bg-[#1e293b] border border-[#ff9800] text-white hover:bg-[#ff9800] hover:text-white'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button
            onClick={handleContinue}
            disabled={!selectedPlan || isLoading}
            className={`px-8 py-3 rounded-md text-white font-medium transition-all duration-300 ${
              !selectedPlan || isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#ff9800] hover:bg-[#e68a00]'
            }`}
          >
            {isLoading ? 'Processing...' : 'Continue to Checkout'}
          </button>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
