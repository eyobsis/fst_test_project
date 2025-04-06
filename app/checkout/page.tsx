"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
};

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle') as 'monthly' | 'yearly';
  
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  
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
      ]
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
    // Validate that we have a valid plan and cycle
    if (!planId || !cycle || (cycle !== 'monthly' && cycle !== 'yearly')) {
      router.push('/pricing');
      return;
    }
    
    const selectedPlan = pricingPlans.find(p => p.id === planId);
    if (!selectedPlan) {
      router.push('/pricing');
      return;
    }
    
    setPlan(selectedPlan);
    
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push('/login?returnUrl=/pricing');
        } else if (data.hasActiveSubscription) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
  }, [planId, cycle, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) {
        setFormData(prev => ({ ...prev, expiryDate: cleaned }));
      } else {
        const month = cleaned.substring(0, 2);
        const year = cleaned.substring(2, 4);
        setFormData(prev => ({ ...prev, expiryDate: `${month}/${year}` }));
      }
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate card name
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
      valid = false;
    }
    
    // Validate card number
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
      valid = false;
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      valid = false;
    }
    
    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      valid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
      valid = false;
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
        valid = false;
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
        valid = false;
      }
    }
    
    // Validate CVV
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
      valid = false;
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setCheckoutError('');
      
      try {
        // Create subscription
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planName: plan?.name,
            planId: planId,
            billingCycle: cycle,
            paymentMethod: 'credit_card',
            paymentId: `sim_${Date.now()}`, // Simulated payment ID
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Redirect to dashboard after successful subscription
          router.push('/dashboard');
        } else {
          setCheckoutError(data.error || 'Failed to process payment');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setCheckoutError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!plan) {
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
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            {checkoutError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
                <p className="text-red-500 text-sm">{checkoutError}</p>
              </div>
            )}
            
            <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                    placeholder="Name on card"
                  />
                  {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff9800] text-white rounded-md hover:bg-[#e68a00] transition-all duration-300 flex items-center justify-center mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${cycle === 'monthly' ? plan.price.monthly : plan.price.yearly}`
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-[#1e293b]/80 backdrop-blur-sm p-6