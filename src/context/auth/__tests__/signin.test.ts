import bcrypt from 'bcrypt-nodejs';

import Auth from 'context/auth';
import { fakeUser } from 'context/auth/__tests__/fake';
import {
  CrendentialsInvalidError,
  EmailExistsError,
  UnauthorizedError,
  YupValidationError,
} from 'src/lib/errors';
import db from 'test/db';

import VerificationTokenModel from 'context/auth/schema/verificationToken';

const user1 = fakeUser({
  email: 'notconfirmed@gmail.com',
  password: 'notconfirmed',
  notConfirmed: true,
});
const user2 = fakeUser({
  email: 'confirmed@gmail.com',
  password: 'mypassword',
});

beforeAll(async () => db.setup([user1, user2]));

afterAll(async () => db.teardown());

describe('Authentication: Sign In', () => {
  it('it throws an error if the form data is invalid', async () => {
    await expect(
      Auth.login({
        email: '',
        password: '',
      })
    ).rejects.toThrowError(YupValidationError);
  });

  it('it throws an error if the email address is not registered', async () => {
    await expect(
      Auth.login({
        email: 'idontexist@gmail.com',
        password: 'wrong',
      })
    ).rejects.toThrowError(CrendentialsInvalidError);
  });

  it("it throws an error if the account hasn't been confirmed", async () => {
    await expect(
      Auth.login({
        email: 'notconfirmed@gmail.com',
        password: 'notconfirmed',
      })
    ).rejects.toThrowError(UnauthorizedError);
  });

  it('it throws an error if the password for the account is incorrect', async () => {
    await expect(
      Auth.login({
        email: 'confirmed@gmail.com',
        password: 'incorrect',
      })
    ).rejects.toThrowError(CrendentialsInvalidError);
  });

  it('it logs a user in and returns a JWT', async () => {
    const authInfo = await Auth.login({
      email: 'confirmed@gmail.com',
      password: 'mypassword',
    });

    expect(authInfo).toBeDefined();

    expect(authInfo.user).toHaveProperty('_id', user2._id);
    expect(authInfo.user).toHaveProperty('firstName', user2.firstName);
    expect(authInfo.user).toHaveProperty('lastName', user2.lastName);

    expect(authInfo).toHaveProperty('token');
  });
});
