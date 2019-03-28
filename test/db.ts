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
    await mongoose.connect(
      MONGODB_URI,
      { useCreateIndex: true, useNewUrlParser: true }
    );
    // await mongoose.connection.db.dropDatabase();

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
