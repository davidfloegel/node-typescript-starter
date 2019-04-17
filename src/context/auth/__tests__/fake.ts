import faker from 'faker';
import mongoose from 'mongoose';

import UserModel from '../schema/user';
import VerificationTokenModel from '../schema/verificationToken';

const { ObjectId } = mongoose.mongo;

export const fakeUser = (data: any = {}) => {
  return new UserModel({
    email: data.email || faker.internet.email(),
    password: data.password || faker.internet.password(),
    firstName: data.firstName || faker.name.firstName(),
    lastName: data.lastName || faker.name.lastName(),
    flags: {
      accountConfirmedAt: data.accountConfirmedAt ? new Date() : null,
    },
  });
};

export const fakeVerificationToken = (data: any = {}) => {
  return new VerificationTokenModel({
    userId: data.userId ? new ObjectId(data.userId) : new ObjectId(),
    token: data.token,
    createdAt: new Date(),
  });
};
