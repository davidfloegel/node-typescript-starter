import bcrypt from 'bcrypt-nodejs';

import UserSchema from '../schema';

const salt = bcrypt.genSaltSync(10);

const hashPassword = (pw: string) => bcrypt.hashSync(pw, salt);

const user = new UserSchema({
  email: 'testuser@gmail.com',
  password: hashPassword('12345'),

  firstName: 'John',
  lastName: 'Doe',
});

describe('User Schema', () => {
  it('it initialises a new user with default values', () => {
    expect(user).toHaveProperty('flags');
    expect(user).toHaveProperty('flags.accountConfirmedAt', null);

    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });

  // it('it hashes the password upon save', async () => {
  //   // TODO implement somehow
  // });

  it('it generates a full name with virtuals', () => {
    expect(user).toHaveProperty('fullName', 'John Doe');
  });

  it('it compares the users password', async () => {
    expect(await user.comparePassword('bla')).toBeFalsy();
    expect(await user.comparePassword('12345')).toBeTruthy();
  });
});
