'use server';

import { LoginInput, SignupInput } from '@/lib/authvalidations/authschema';
import User from '@/lib/models/User';
import {
  comparePassword,
  generateSalt,
  hashedPassword,
} from '../core/passwordHasher';
import { createUsersession } from '../core/session';

export async function signupAction(formdata: SignupInput) {
  try {
    const { email, password, confirmPassword, username } = formdata;
    if (!email || !password || !confirmPassword || !username)
      return { status: false, message: 'Required all details' };
    const isexistingUser = await User.findOne({ email });
    if (isexistingUser) return { status: false, message: 'User Already Exist' };
    const salt: string = generateSalt();
    const passwordHashed: string = await hashedPassword(password, salt);
    const newUser = new User({
      username: username,
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
    const isuserExist = await User.findOne({ email: email });
    if (!isuserExist) return { status: false, message: 'Invalid Credentials' };
    const isPasswordcorrect = await comparePassword(
      password,
      isuserExist.salt,
      isuserExist.password,
    );

    if (!isPasswordcorrect)
      return { status: false, message: 'Invalid credentials' };
    await createUsersession(isuserExist?._id);
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: 'Login Failed',
    };
  }
}
