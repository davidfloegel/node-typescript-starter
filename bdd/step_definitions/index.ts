import { After, Before, Given } from 'cucumber';
import mongoose from 'mongoose';

import MongoEnvironment from '../../test/db';

Before(async () => {
  await MongoEnvironment.connect();
  return true;
});

After(async () => {
  await MongoEnvironment.teardown();
  return true;
});
