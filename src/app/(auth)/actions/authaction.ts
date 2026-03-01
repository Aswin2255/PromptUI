'use server';

import { LoginInput, SignupInput } from '@/lib/authvalidations/authschema';
import User from '@/lib/models/User';
import { generateSalt, hashedPassword } from '../core/passwordHasher';
import { createUsersession } from '../core/session';
import { redirect } from 'next/navigation';

export async function signupAction(formdata: SignupInput) {
  try {
    const { email, password, confirmPassword } = formdata;
    if (!email || !password || !confirmPassword)
      return { status: false, message: 'Required all details' };
    const isexistingUser = await User.findOne({ email });
    if (isexistingUser) return { status: false, message: 'User Already Exist' };
    const salt: string = generateSalt();
    const passwordHashed: string = await hashedPassword(password, salt);
    const newUser = new User({
      email: email,
      password: passwordHashed,
    });
    const createdUser = await newUser.save();
    await createUsersession(createdUser?._id);

    //redirect("/")
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: 'login falied',
    };
  }
}

export async function loginAction(formdata: LoginInput) {
  try {
    const { email, password } = formdata;
    if (!email || !password)
      return { status: false, message: 'Required all details' };
  } catch {}
}
