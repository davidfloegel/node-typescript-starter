import { expect } from 'chai';
import { After, AfterAll, Before, Given, Then, When } from 'cucumber';
import faker from 'faker';
import got from 'got';
import _ from 'lodash';
import mongoose from 'mongoose';

import { User } from '../../src/context/auth/interfaces';
import UserSchema from '../../src/context/auth/schema/user';
import TokenSchema from '../../src/context/auth/schema/verificationToken';
import MongoEnvironment from '../../test/db';

Before(async () => {
  await MongoEnvironment.connect();
  return true;
});

After(async () => {
  await MongoEnvironment.teardown();
  return true;
});

const { ObjectId } = mongoose.mongo;

// TODO extract into different steps file
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
            accountConfirmedAt: u.confirmed === 'true' ? new Date() : null,
          },
        }).save()
      )
    );
    return true;
  } catch (e) {
    throw Error(e);
  }
});
//
// TODO extract into different steps file
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

When('I make a GET request to {string}', async url => {
  try {
    this.res = await got.get(`http://localhost:4000${url}`);
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a POST request to {string} with payload:', async (url, table) => {
  try {
    const body = table && table.hashes ? table.hashes()[0] : {};
    this.res = await got.post(`http://localhost:4000${url}`, {
      json: true,
      body,
    });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a POST request to {string}', async url => {
  try {
    this.res = await got.post(`http://localhost:4000${url}`, {
      json: true,
    });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a PUT request to {string} with payload:', async (url, table) => {
  try {
    const body = table && table.hashes ? table.hashes()[0] : {};
    this.res = await got.put(`http://localhost:4000${url}`, {
      json: true,
      body,
    });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a PUT request to {string}', async url => {
  try {
    this.res = await got.put(`http://localhost:4000${url}`, {
      json: true,
    });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

Then('the response status code should be {int}', statusCode => {
  expect(this.res.statusCode).to.eql(statusCode);
});

Then(/^the response (error|message) should be "([^"]*)"$/, (type, msg) => {
  expect(this.res.body[type]).to.eql(msg);
});

Then(/^the response should contain a "([^"]*)" property$/, field => {
  expect(this.res.body.data).to.have.property(field);
});

Then(
  /^the response should contain a "([^"]*)" property with the attributes:$/,
  (field, table) => {
    const expectedObj: any = {};

    table.hashes().forEach((row: any) => {
      expectedObj[row.key] = row.values ? [row.values] : row.value;
    });

    expect(this.res.body.data).to.have.property(field);
    expect(this.res.body.data[field]).to.eql(expectedObj);
  }
);
