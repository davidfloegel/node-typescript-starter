import { expect } from 'chai';
import { Then, When } from 'cucumber';
import got from 'got';
import _ from 'lodash';

When('I make a GET request to {string}', async url => {
  try {
    const headers = this.requestHeaders || {};
    console.log(headers)
    this.res = await got.get(`http://localhost:4001${url}`, { headers });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a POST request to {string} with payload:', async (url, table) => {
  try {
    const body = table && table.hashes ? table.hashes()[0] : {};
    this.res = await got.post(`http://localhost:4001${url}`, {
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
    this.res = await got.post(`http://localhost:4001${url}`, {
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
    this.res = await got.put(`http://localhost:4001${url}`, {
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
    this.res = await got.put(`http://localhost:4001${url}`, {
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

    expect(this.res.body.data).to.have.property(field);

    table.hashes().forEach((row: any) => {
      // _.set(expectedObj, row.key, row.value);
      expect(_.get(this.res.body.data[field], row.key)).to.eql(row.value);
    });
  }
);
