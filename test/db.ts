import bluebird from 'bluebird';
import mongoose from 'mongoose';

import secrets from '../src/utils/secrets';

mongoose.Promise = bluebird;

class MongoEnvironment {
  private mongod: any;
  private connection: any;
  private db: any;

  public async connect() {
    await mongoose.connect(
      secrets.mongodbURI,
      { useCreateIndex: true, useNewUrlParser: true }
    );

    await this._clearCollections();
  }

  public async setup(insertBefore: any = []) {
    await this.connect();

    if (insertBefore.length > 0) {
      await Promise.all(insertBefore.map((x: any) => x.save()));
    }

    return true;
  }

  public async teardown() {
    await mongoose.connection.close();
  }

  private async _clearCollections() {
    for (const collection in mongoose.connection.collections) {
      if (collection) {
        await mongoose.connection.collections[collection].deleteMany({});
      }
    }

    return true;
  }
}

export default new MongoEnvironment();
