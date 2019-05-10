import { expect } from 'chai';
import { Then } from 'cucumber';
import _ from 'lodash';

Then('the response status code should be {int}', function(statusCode) {
  expect(this.res.statusCode).to.eql(statusCode);
});

Then(/^the response (error|message) should be "([^"]*)"$/, function(type, msg) {
  expect(this.res.body[type]).to.eql(msg);
});

Then(/^the response should contain a "([^"]*)" property$/, function(field) {
  expect(this.res.body.data).to.have.property(field);
});

Then(
  /^the response should contain a "([^"]*)" property with the attributes:$/,
  function(field, table) {
    const expectedObj: any = {};

    expect(this.res.body.data).to.have.property(field);

    table.hashes().forEach((row: any) => {
      expect(_.get(this.res.body.data[field], row.key)).to.eql(row.value);
    });
  }
);
