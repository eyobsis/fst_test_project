"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Features() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const router = useRouter();
  
  const plans = {
    standard: {
      monthly: 99,
      yearly: 49.5, // 50% off
      features: [
        'Virtual office space',
        'Up to 10 team members',
        'Video conferencing',
        'Chat functionality',
        'File sharing',
        'Basic analytics'
      ]
    },
    premium: {
      monthly: 299,
      yearly: 149.5, // 50% off
      features: [
        'Everything in Standard',
        'Unlimited team members',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
        'Team building activities',
        'Integration with other tools',
        'Advanced security features'
      ]
    },
    enterprise: {
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        'Custom development',
        'Enterprise-grade security',
        'SLA guarantees',
        'On-premise deployment option'
      ]
    }
  };

  const handleSelectPlan = (planType: string) => {
    router.push(`/checkout?plan=${planType}&billing=${billingPeriod}`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
          Flexible <span className="text-[#ff9800]">Plans</span>
        </h1>
        <p className="text-xl text-center mb-8">
          Choose a plan that work best for you & your team
        </p>
        
        <div className="flex justify-center mb-8">
          <div className="bg-[#1e293b] text-white rounded-full p-1 inline-flex">
            <button 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-[#ff9800] text-white' : 'text-white hover:bg-[#1e293b]/80'}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${billingPeriod === 'yearly' ? 'bg-[#ff9800] text-white' : 'text-white hover:bg-[#1e293b]/80'}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly <span className="text-sm">(Save 50%)</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {/* Standard Plan */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-xl font-bold mb-4 text-center">Standard</h3>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">${billingPeriod === 'monthly' ? plans.standard.monthly : plans.standard.yearly}</span>
              <span className="text-sm">/{billingPeriod === 'monthly' ? 'Per Month' : 'Per Month, billed annually'}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plans.standard.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#ff9800] mr-2">•</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan('standard')}
              className="w-full py-2 px-4 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300"
            >
              Choose Plan
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg border-2 border-[#ff9800] relative shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] transform z-10 scale-105">
            <div className="absolute -top-3 right-4 bg-[#ff9800] text-white text-xs px-2 py-1 rounded">
              Recommended
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Premium</h3>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">${billingPeriod === 'monthly' ? plans.premium.monthly : plans.premium.yearly}</span>
              <span className="text-sm">/{billingPeriod === 'monthly' ? 'Per Month' : 'Per Month, billed annually'}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plans.premium.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#ff9800] mr-2">•</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan('premium')}
              className="w-full py-2 px-4 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300"
            >
              Choose Plan
            </button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-xl font-bold mb-4 text-center">Enterprise</h3>
            <div className="text-center mb-6">
              <span className="text-xl font-bold">Custom Plan</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plans.enterprise.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#ff9800] mr-2">•</span> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 px-4 bg-[#1e293b] border border-[#ff9800] text-white rounded-md hover:bg-[#ff9800] hover:text-white transition-all duration-300">Contact Us</button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}