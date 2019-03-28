import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { MONGODB_URI } from '../src/util/secrets';

mongoose.Promise = bluebird;

// set the timeout because the memory server needs to download a db version
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

class MongoEnvironment {
  private mongod: any;
  private connection: any;
  private db: any;

  public async setup(insertBefore: any = []) {
    async function clearCollections() {
      for (var collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteMany({});
      }

      return true;
    }

    await mongoose.connect(
      MONGODB_URI,
      { useCreateIndex: true, useNewUrlParser: true }
    );

    await clearCollections();

    if (insertBefore.length > 0) {
      await Promise.all(insertBefore.map((x: any) => x.save()));
    }

    return true;
  }

  public async teardown() {
    await mongoose.connection.close();
  }
}

export default new MongoEnvironment();
