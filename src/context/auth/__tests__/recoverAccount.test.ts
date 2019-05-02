import Auth from 'context/auth';
import { fakeRecoveryToken, fakeUser } from 'context/auth/__tests__/fake';
import { BadRequestError, ValidationError } from 'src/lib/errors';
import db from 'test/db';
import Mailer from 'thirdparty/mailer';

import TokenModel from '../schema/recoveryToken';
import UserModel from '../schema/user';

Mailer.send = jest.fn();

const user1 = fakeUser();
const user2 = fakeUser();

beforeAll(async () =>
  db.setup([
    user1,
    user2,
    fakeRecoveryToken({
      userId: user2._id,
      token: 'iamatoken',
    }),
  ]));

afterAll(async () => db.teardown());

describe('Authentication: Recover Account', () => {
  it('it throws an error if the email address is invalid', async () => {
    await expect(
      Auth.recoverAccount({ email: 'invalidemail' })
    ).rejects.toThrowError(ValidationError);
  });

  it('it throws an error if the email address is not registered', async () => {
    await expect(
      Auth.recoverAccount({ email: 'idontexist@gmail.com' })
    ).rejects.toThrowError(BadRequestError);
  });

  it('it successfully generates a new recovery token', async () => {
    const status = await Auth.recoverAccount({ email: user1.email });

    expect(status).toBeTruthy();

    const token = await TokenModel.findOne({ userId: user1._id });
    expect(token).toBeDefined();
    expect(token).toHaveProperty('token');
  });

  it('it overrides an existing token if one already exists', async () => {
    const prevToken = await TokenModel.findOne();
    expect(prevToken).toBeDefined();
    expect(prevToken).toHaveProperty('token', 'iamatoken');

    // request new token
    const status = await Auth.recoverAccount({ email: user2.email });

    expect(status).toBeTruthy();

    const newToken = await TokenModel.findOne({ userId: user2._id });
    expect(newToken).toBeDefined();
    expect(newToken).toHaveProperty('token');
    expect(newToken).not.toEqual('iamatoken');

    expect(Mailer.send).toHaveBeenCalledWith({
      recipient: {
        firstName: user2.firstName,
        lastName: user2.lastName,
        email: user2.email,
      },
      subject: 'Your password reset link',
      html: expect.anything(), // @TODO not enough!
    });
  });
});
