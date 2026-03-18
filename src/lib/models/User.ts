import { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  uid: string;
  email: string;
  salt: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  googleId: string;
  picture: string;
  typeoflogin: 'google' | 'manual';
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
    picture: {
      type: String,
    },
    typeoflogin: {
      type: String,
      enum: ['google', 'manual'],
      default: 'manual',
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
