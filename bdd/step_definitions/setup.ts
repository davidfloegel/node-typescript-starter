import { expect } from 'chai';
import { Given } from 'cucumber';
import faker from 'faker';
import mongoose from 'mongoose';

import { User } from '../../src/context/auth/interfaces';
import RecoveryTokenSchema from '../../src/context/auth/schema/recoveryToken';
import UserSchema from '../../src/context/auth/schema/user';
import VerificationTokenSchema from '../../src/context/auth/schema/verificationToken';
import { generateToken } from '../../src/context/auth/utils';

const { ObjectId } = mongoose.mongo;

Given(/^I am logged in$/, async function() {
  const newUser = new UserSchema({
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@user.com',
    password: '12345',
    flags: {
      accountConfirmedAt: new Date(),
    },
  });

  await newUser.save();

  this.token = generateToken(newUser._id);

  return false;
});

Given(/^I attach a valid authorization token to the request$/, function() {
  this.requestHeaders = {
    Authorization: this.token,
  };
});

Given(/^there (?:is|are) the following (?:user|users):$/, async function(
  table
) {
  const users = table.hashes();

  try {
    const saved = await Promise.all(
      users.map((u: any) =>
        new UserSchema({
          _id: u.id || null,
          firstName: u.firstName || faker.name.firstName(),
          lastName: u.lastName || faker.name.lastName(),
          email: u.email || faker.internet.email(),
          password: u.password || faker.internet.password(),
          flags: {
            accountConfirmedAt: u.confirmed === 'false' ? null : new Date(),
          },
        }).save()
      )
    );
    return true;
  } catch (e) {
    throw Error(e);
  }
});

Given(
  /^there (?:is|are) the following verification (?:token|tokens):$/,
  async function(table) {
    const tokens = table.hashes();

    try {
      const saved = await Promise.all(
        tokens.map((t: any) =>
          new VerificationTokenSchema({
            userId: t.userId || new ObjectId(),
            token: t.token,
            createdAt: new Date(),
          }).save()
        )
      );
      return true;
    } catch (e) {
      throw Error(e);
    }
  }
);

Given(
  /^there (?:is|are) the following recovery (?:token|tokens):$/,
  async function(table) {
    const tokens = table.hashes();

    try {
      const saved = await Promise.all(
        tokens.map((t: any) =>
          new RecoveryTokenSchema({
            userId: t.userId || new ObjectId(),
            token: t.token,
            createdAt: new Date(),
          }).save()
        )
      );
      return true;
    } catch (e) {
      throw Error(e);
    }
  }
);
