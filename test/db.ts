import { MongoClient } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);

// set the timeout because the memory server needs to download a db version
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

class MongoEnvironment {
  private mongod: any;
  private connection: any;
  private db: any;

  constructor() {
    this.mongod = new MongoMemoryServer({ debug: true, autoStart: false });
  }

  public async setup(insertBefore: any = []) {
    this.mongod.start();
    const mongoUri = await this.mongod.getConnectionString();
    await mongoose.connect(
      mongoUri,
      { useNewUrlParser: true },
      err => {
        if (err) {
          // tslint:disable-next-line
          console.error(err);
        }
      }
    );

    if (insertBefore.length > 0) {
      await Promise.all(insertBefore.map((x: any) => x.save()));
    }

    return true;
  }

  public async teardown() {
    await mongoose.disconnect();
    await this.mongod.stop();
  }
}

export default new MongoEnvironment();
