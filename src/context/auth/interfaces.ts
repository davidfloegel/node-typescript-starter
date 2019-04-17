import mongoose from 'mongoose';
import { ObjectId } from 'src/typings';

interface IFlags {
  accountConfirmedAt: Date | null;
}

export type User = mongoose.Document & {
  email: string;
  password: string;

  firstName: string;
  lastName: string;

  flags: IFlags;

  gravatar: (size: number) => string;

  comparePassword: comparePasswordFunction;
};

export type comparePasswordFunction = (
  candidatePassword: string
) => Promise<boolean>;

export type VerificationToken = mongoose.Document & {
  userId: ObjectId;
  token: string;
  createdAt: Date;
};
