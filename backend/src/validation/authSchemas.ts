import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
