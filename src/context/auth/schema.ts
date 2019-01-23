import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';

export type User = mongoose.Document & {
  email: string;
  password: string;

  firstName: string;
  lastName: string;

  flags: {
    accountConfirmedAt: Date;
  };

  gravatar: (size: number) => string;

  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) => void;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,

    firstName: String,
    lastName: String,

    flags: {
      accountConfirmedAt: Date,
    },
  },
  { timestamps: true }
);

const comparePassword: comparePasswordFunction = function(
  candidatePassword,
  cb
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    }
  );
};

userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size: number) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);
export default User;
