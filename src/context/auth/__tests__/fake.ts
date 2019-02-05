import faker from 'faker';
import UserModel from '../schema';

export default (data: any = {}) => {
  return new UserModel({
    email: data.email || faker.internet.email(),
    password: data.password || faker.internet.password(),
    firstName: data.firstName || faker.name.firstName(),
    lastName: data.lastName || faker.name.lastName(),
    // flags: {
    //   accountConfirmedAt: data.flags.accountConfirmedAt || new Date(),
    // },
  });
};
