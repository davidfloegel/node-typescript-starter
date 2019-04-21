import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import { NextFunction } from 'express';
import mongoose from 'mongoose';

import { comparePasswordFunction, User } from '../interfaces';
import { hashPassword } from '../utils';

const userSchema = new mongoose.Schema(
  {
    email: { required: true, type: String, unique: true, lowercase: true },
    password: { required: true, type: String, select: false },

    firstName: { required: true, type: String },
    lastName: { required: true, type: String },

    flags: {
      accountConfirmedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Before saving the user, hash the password
userSchema.pre<User>('save', function(next: NextFunction) {
  this.password = hashPassword(this.password);
  next();
});

// compare the users password to a candidate
const comparePassword: comparePasswordFunction = async function(
  candidatePassword: string
): Promise<boolean> {
  try {
    return bcrypt.compareSync(candidatePassword, this.password);
  } catch (err) {
    throw Error(err);
  }
};

userSchema.methods.comparePassword = comparePassword;

// virtuals
userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

// Generate a gravatar for the user
userSchema.methods.gravatar = function(size: number) {
  if (!size) {
    size = 200;
  }

  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export default mongoose.model<User>('user', userSchema);
