import mongoose from 'mongoose';
import bluebird from 'bluebird';

import secrets from '../src/utils/secrets';

mongoose.Promise = bluebird;

class MongoEnvironment {
  private mongod: any;
  private connection: any;
  private db: any;

  private async _clearCollections() {
    for (var collection in mongoose.connection.collections) {
      await mongoose.connection.collections[collection].deleteMany({});
    }

    return true;
  }

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
}

export default new MongoEnvironment();
