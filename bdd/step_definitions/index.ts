import { expect } from 'chai';
import { After, AfterAll, Before, Given, Then, When } from 'cucumber';
import got from 'got';

import { User } from '../../src/context/auth/interfaces';
import UserSchema from '../../src/context/auth/schema/user';
import MongoEnvironment from '../../test/db';

Before(async () => {
  await MongoEnvironment.connect();
  return true;
});

After(async () => {
  await MongoEnvironment.teardown();
  return true;
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
    const body = table.hashes()[0];
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

Then('the response status code should be {int}', statusCode => {
  expect(this.res.statusCode).to.eql(statusCode);
});

Then(/^the response (error|message) should be "(.*)"$/, (type, msg) => {
  expect(this.res.body[type]).to.eql(msg);
});

Then(/^the response should contain a "(.*)" property/, field => {
  expect(this.res.body.data).to.have.property(field);
});

Then('the body of the response should be {string}', res => {
  const body = JSON.parse(this.res.body);
  expect(body.data).to.eql(res);
});
