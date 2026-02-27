import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.email('Invalid Email address'),
    password: z.string().min(8, 'Password must be atleast 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password doesnot matched',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email('Invalid Email Address'),
  password: z.string().min(8, 'Password must be atleast 8 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
