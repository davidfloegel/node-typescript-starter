import bcrypt from 'bcrypt-nodejs';

import Auth from 'context/auth';
import { fakeRecoveryToken, fakeUser } from 'context/auth/__tests__/fake';
import { BadRequestError, ValidationError } from 'src/lib/errors';
import db from 'test/db';

import TokenModel from '../schema/recoveryToken';
import UserModel from '../schema/user';
import { hashPassword } from '../utils';

const user1 = fakeUser();
const user2 = fakeUser();

beforeAll(async () =>
  db.setup([
    user1,
    user2,
    fakeRecoveryToken({
      token: 'nouserfortoken',
    }),
    fakeRecoveryToken({
      userId: user2._id,
      token: 'iamatoken',
    }),
  ]));

afterAll(async () => db.teardown());

describe('Authentication: Reset Password', () => {
  it('it throws an error if the token is invalid', async () => {
    await expect(
      Auth.resetPassword({
        token: 'idontexist',
        newPassword: '12345',
        confirmPassword: '12345',
      })
    ).rejects.toThrowError(BadRequestError);
  });

  it('it throws an error if the no user exists for the given token', async () => {
    await expect(
      Auth.resetPassword({
        token: 'nouserfortoken',
        newPassword: '12345',
        confirmPassword: '12345',
      })
    ).rejects.toThrowError(BadRequestError);
  });

  it('it throws an error if the new password is invalid', async () => {
    await expect(
      Auth.resetPassword({
        token: 'iamatoken',
        newPassword: 'a',
        confirmPassword: 'b',
      })
    ).rejects.toThrowError(ValidationError);
  });

  it('it throws an error if the password confirmation is invalid', async () => {
    await expect(
      Auth.resetPassword({
        token: 'iamatoken',
        newPassword: 'newPW',
        confirmPassword: null,
      })
    ).rejects.toThrowError(ValidationError);
  });

  it("it throws an error if the new password and confirmation don't match", async () => {
    await expect(
      Auth.resetPassword({
        token: 'iamatoken',
        newPassword: 'newPW',
        confirmPassword: 'newPW2',
      })
    ).rejects.toThrowError(BadRequestError);
  });

  it('it successfully resets the users password', async () => {
    // bcrypt.genSaltSync = jest.fn();
    jest
      .spyOn(bcrypt, 'genSaltSync')
      .mockImplementation(() => '$2a$10$s2Z.yWoC9AKG8QG.ZekUU.');

    const status = await Auth.resetPassword({
      token: 'iamatoken',
      newPassword: 'newPW',
      confirmPassword: 'newPW',
    });

    expect(status).toBeTruthy();

    // check password has been hashed
    const user = await UserModel.findById(user2._id, { password: 1 });
    expect(user).toHaveProperty('password', hashPassword('newPW'));

    // check token has been deleted
    const token = await TokenModel.findOne({ userId: user2._id });
    expect(token).toBeNull();
  });
});
