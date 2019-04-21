import { NextFunction } from 'express';
import mongoose from 'mongoose';

import { RecoveryToken } from '../interfaces';

const recoveryTokenSchema = new mongoose.Schema({
  userId: { type: 'ObjectId', unique: true, required: true, ref: 'user' },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, expires: 43200 },
});

export default mongoose.model<RecoveryToken>(
  'recoveryToken',
  recoveryTokenSchema
);
