// test.js
import db from '../../../../test/db';

import User from '../schema';

beforeAll(async () => {
  // tslint:disable-next-line
  console.log('before all');

  await db.setup();

  // tslint:disable-next-line
  console.log('before all done');
});

afterAll(async () => {
  await db.stop();
});

it('should aggregate docs from collection', async () => {
  const user = await new User({
    email: 'test',
    password: '123',
    firstName: 'david',
    lastName: 'floegel',
  }).save();

  // tslint:disable-next-line
  console.log('created user', user);
  expect(user).toHaveProperty('firstName', 'david');

  // const files = db.collection('files');

  // await files.insertMany([
  //   { type: 'Document' },
  //   { type: 'Video' },
  //   { type: 'Image' },
  //   { type: 'Document' },
  //   { type: 'Image' },
  //   { type: 'Document' },
  // ]);

  // const topFiles = await files
  //   .aggregate([
  //     { $group: { _id: '$type', count: { $sum: 1 } } },
  //     { $sort: { count: -1 } },
  //   ])
  //   .toArray();

  // expect(topFiles).toEqual([
  //   { _id: 'Document', count: 3 },
  //   { _id: 'Image', count: 2 },
  //   { _id: 'Video', count: 1 },
  // ]);
});
