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
    this.mongod = new MongoMemoryServer({ autoStart: false });
  }

  public async setup() {
    this.mongod.start();
    const mongoUri = await this.mongod.getConnectionString();
    return mongoose.connect(
      mongoUri,
      { useNewUrlParser: true },
      err => {
        if (err) {
          // tslint:disable-next-line
          console.error(err);
        }
      }
    );
  }

  public async teardown() {
    await mongoose.disconnect();
    await this.mongod.stop();
  }
}

export default new MongoEnvironment();
