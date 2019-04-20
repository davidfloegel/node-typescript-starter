import { expect } from 'chai';
import { Given } from 'cucumber';
import faker from 'faker';
import mongoose from 'mongoose';

import { User } from '../../src/context/auth/interfaces';
import UserSchema from '../../src/context/auth/schema/user';
import TokenSchema from '../../src/context/auth/schema/verificationToken';

const { ObjectId } = mongoose.mongo;

Given(/^there (?:is|are) the following (?:user|users):$/, async table => {
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
  async table => {
    const tokens = table.hashes();

    try {
      const saved = await Promise.all(
        tokens.map((t: any) =>
          new TokenSchema({
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
