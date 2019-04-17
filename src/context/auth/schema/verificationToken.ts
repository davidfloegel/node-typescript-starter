import { NextFunction } from 'express';
import mongoose from 'mongoose';

import { VerificationToken } from '../interfaces';

const verificationTokenSchema = new mongoose.Schema({
  userId: { type: 'ObjectId', required: true, ref: 'user' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, expires: 43200 },
});

verificationTokenSchema.pre<VerificationToken>('save', function(
  next: NextFunction
) {
  this.createdAt = new Date();
  next();
});

export default mongoose.model<VerificationToken>(
  'verificationToken',
  verificationTokenSchema
);
