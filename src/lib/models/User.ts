import { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  uid: string;
  email: string;
  salt: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
