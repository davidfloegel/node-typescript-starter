import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import got from 'got';

When('I make a GET request to {string}', async url => {
  this.res = await got.get(`http://localhost:4000${url}`);
  return true;
});

Then('the response status code should be {int}', statusCode => {
  expect(this.res.statusCode).to.eql(statusCode);
});

Then('the body of the response should be {string}', res => {
  const body = JSON.parse(this.res.body);
  expect(body.data).to.eql(res);
});
