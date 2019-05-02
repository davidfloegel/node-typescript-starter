import { expect } from 'chai';
import { When } from 'cucumber';
import got from 'got';

When('I make a GET request to {string}', async function(url) {
  try {
    const headers = this.requestHeaders || {};
    this.res = await got.get(`http://localhost:4001${url}`, { headers });
    return true;
  } catch (e) {
    this.res = e;
    return;
  }
});

When('I make a POST request to {string} with payload:', async function(
  url,
  table
) {
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

When('I make a POST request to {string}', async function(url) {
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

When('I make a PUT request to {string} with payload:', async function(
  url,
  table
) {
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

When('I make a PUT request to {string}', async function(url) {
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
