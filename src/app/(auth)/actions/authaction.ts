'use server';

import { signupSchema } from '@/lib/authvalidations/authschema';
import z from 'zod';

export async function signupAction(previousState: unknown, formdata: FormData) {
  try {
    const singupdata = {
      email: formdata.get('email'),
      password: formdata.get('password'),
      confirmPassword: formdata.get('confirmPassword'),
    };

    const result = signupSchema.safeParse(singupdata);

    if (!result.success) {
      return {
        success: false,
        errors: z.flattenError(result.error).fieldErrors,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      errors: 'login falied',
    };
  }
}
