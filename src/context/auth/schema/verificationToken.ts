import { NextFunction } from 'express';
import mongoose from 'mongoose';

import { VerificationToken } from '../interfaces';

const verificationTokenSchema = new mongoose.Schema({
  userId: { type: 'ObjectId', unique: true, required: true, ref: 'user' },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, expires: 43200 },
});

export default mongoose.model<VerificationToken>(
  'verificationToken',
  verificationTokenSchema
);
