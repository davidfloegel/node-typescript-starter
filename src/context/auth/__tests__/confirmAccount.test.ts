import Auth from 'context/auth';
import { fakeUser, fakeVerificationToken } from 'context/auth/__tests__/fake';
import { BadRequestError } from 'src/lib/errors';
import db from 'test/db';

const user1 = fakeUser();
const user2 = fakeUser({
  flags: {
    accountConfirmedAt: null,
  },
});

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
      userId: user1._id,
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

    // TODO find a way to check the error details
  });

  it('it throws an error if the account is already confirmed', async () => {
    await expect('alreadyverified').rejects.toThrowError(BadRequestError);

    // TODO find a way to check the error details
  });

  it('it successfully confirms the user account', async () => {
    const status = await Auth.confirmAccount('verifyme');

    expect(status).toBeDefined();
  });
});
