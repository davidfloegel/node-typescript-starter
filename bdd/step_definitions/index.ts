import { expect } from 'chai';
import { Before, After, AfterAll, Given, Then, When } from 'cucumber';
import got from 'got';
import mongoose from 'mongoose';

import { MONGODB_URI } from '../../src/util/secrets';
import UserSchema, { User } from '../../src/context/auth/schema';

Before(async () => {
  await mongoose.connect(
    MONGODB_URI,
    { useCreateIndex: true, useNewUrlParser: true }
  );
  await mongoose.connection.db.dropDatabase();
  return true;
});

After(async () => {
  await mongoose.connection.close();
  return;
});

Given(/^there (?:is|are) the following (?:user|users)$/, async table => {
  const users = table.hashes();

  try {
    const saved = await Promise.all(
      users.map((u: User) => new UserSchema(u).save())
    );
    return true;
  } catch (e) {
    throw Error(e);
  }
});

When('I make a GET request to {string}', async url => {
  try {
    this.res = await got.get(`http://localhost:4000${url}`);
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a POST request to {string}', async (url, table) => {
  try {
    this.res = await got.post(`http://localhost:4000${url}`, table.hashes());
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

Then('the response status code should be {int}', statusCode => {
  expect(this.res.statusCode).to.eql(statusCode);
});

Then('the body of the response should be {string}', res => {
  const body = JSON.parse(this.res.body);
  expect(body.data).to.eql(res);
});
