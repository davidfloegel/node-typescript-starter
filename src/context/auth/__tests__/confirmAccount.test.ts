import Auth from 'context/auth';
import { fakeUser, fakeVerificationToken } from 'context/auth/__tests__/fake';
import { BadRequestError } from 'src/lib/errors';
import db from 'test/db';
import Mailer from 'thirdparty/mailer';

import UserModel from '../schema/user';
import TokenModel from '../schema/verificationToken';

Mailer.send = jest.fn();

const user1 = fakeUser();
const user2 = fakeUser({ notConfirmed: true });

beforeAll(async () =>
  db.setup([
    user1,
    user2,
    fakeVerificationToken({
      token: 'iamatoken',
    }),
    fakeVerificationToken({
      userId: user1._id,
      token: 'alreadyverified',
    }),
    fakeVerificationToken({
      userId: user2._id,
      token: 'verifyme',
    }),
  ]));

afterAll(async () => db.teardown());

describe('Authentication: Confirm Account', () => {
  it('it throws an error if the token is invalid', async () => {
    await expect(Auth.confirmAccount('idonotexist')).rejects.toThrowError(
      BadRequestError
    );
  });

  it('it throws an error if no user exists for the given token', async () => {
    await expect(Auth.confirmAccount('iamatoken')).rejects.toThrowError(
      BadRequestError
    );
  });

  it('it throws an error if the account is already confirmed', async () => {
    await expect(Auth.confirmAccount('alreadyverified')).rejects.toThrowError(
      BadRequestError
    );
  });

  it('it successfully confirms the user account', async () => {
    const status = await Auth.confirmAccount('verifyme');

    const user = await UserModel.findById({ _id: user2._id });
    expect(user.flags.accountConfirmedAt).toBeInstanceOf(Date);

    const token = await TokenModel.findOne({ token: 'verifyme' });
    expect(token).toBeNull();

    expect(Mailer.send).toHaveBeenCalledWith({
      recipient: {
        firstName: user2.firstName,
        lastName: user2.lastName,
        email: user2.email,
      },
      subject: 'Account confirmed!',
      html: expect.anything(), // @TODO not enough!
    });
  });
});
