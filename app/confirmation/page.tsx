"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Confirmation() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');
  
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrderNumber);
  }, []);
  
  const getPlanDetails = () => {
    const plans = {
      standard: {
        name: 'Standard',
        monthly: 99,
        yearly: 49.5,
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
        name: 'Premium',
        monthly: 299,
        yearly: 149.5,
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
        name: 'Enterprise',
        price: 'Custom',
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
    
    if (plan === 'enterprise') {
      return {
        name: plans.enterprise.name,
        price: 'Custom',
        billing: billing,
        features: plans.enterprise.features
      };
    }
    
    const selectedPlan = plans[plan as keyof typeof plans];
    const price = billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
    
    return {
      name: selectedPlan.name,
      price: price,
      billing: billing,
      features: selectedPlan.features
    };
  };
  
  const planDetails = getPlanDetails();
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-8 rounded-lg text-center mb-8">
            <div className="w-20 h-20 bg-[#ff9800]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
            <p className="text-xl mb-6">Your order has been successfully processed.</p>
            
            <div className="bg-[#1e293b] p-4 rounded-md inline-block mb-6">
              <p className="text-gray-400 mb-1">Order Number:</p>
              <p className="text-xl font-mono">{orderNumber}</p>
            </div>
            
            <p className="mb-6">
              We've sent a confirmation email with all the details to your email address.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard" className="py-2 px-6 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300">
                Go to Dashboard
              </Link>
              <Link href="/" className="py-2 px-6 bg-transparent border border-[#ff9800] text-[#ff9800] rounded-md hover:bg-[#ff9800]/10 transition-all duration-300">
                Back to Home
              </Link>
            </div>
          </div>
          
          <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="border-b border-gray-700 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Plan:</span>
                <span>{planDetails.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Billing:</span>
                <span className="capitalize">{planDetails.billing}</span>
              </div>
              <div className="flex justify-between text-lg mt-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  {planDetails.price === 'Custom' ? 'Contact Sales' : `$${planDetails.price}`}
                  {planDetails.price !== 'Custom' && planDetails.billing === 'yearly' && ' /month (billed annually)'}
                  {planDetails.price !== 'Custom' && planDetails.billing === 'monthly' && ' /month'}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">What's included:</h3>
            <ul className="space-y-2 mb-6">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff9800] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-[#ff9800]/10 border border-[#ff9800]/30 rounded-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#ff9800]">Next Steps</h3>
              <p className="mb-2">Our team will be reaching out shortly to help you set up your virtual office space.</p>
              <p>If you have any questions, please contact our support team at <a href="mailto:support@teamify.com" className="text-[#ff9800] hover:underline">support@teamify.com</a></p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}