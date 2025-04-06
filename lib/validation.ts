import { z } from 'zod';

// User validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Subscription validation schema
export const subscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Billing cycle must be monthly or yearly' })
  })
});

// Office validation schema
export const officeSchema = z.object({
  name: z.string().min(3, 'Office name must be at least 3 characters'),
  capacity: z.number().int().positive('Capacity must be a positive number')
});

// Validation helper function
export function validate<T>(schema: z.ZodType<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  error?: string 
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Invalid data provided' };
  }
}