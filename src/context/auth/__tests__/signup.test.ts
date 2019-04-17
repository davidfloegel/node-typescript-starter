import bcrypt from 'bcrypt-nodejs';

import Auth from 'context/auth';
import { fakeUser } from 'context/auth/__tests__/fake';
import { EmailExistsError, ValidationError } from 'src/lib/errors';
import db from 'test/db';

beforeAll(async () => db.setup([fakeUser({ email: 'existing@gmail.com' })]));

afterAll(async () => db.teardown());

describe('Authentication: Signup', () => {
  it('it throws an error if the form data is invalid', async () => {
    await expect(
      Auth.signup({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      })
    ).rejects.toThrowError(ValidationError);
  });

  it('it throws an error if the email address is already registered', async () => {
    await expect(
      Auth.signup({
        email: 'existing@gmail.com',
        password: 'iexist',
        firstName: 'Ialready',
        lastName: 'Exist',
      })
    ).rejects.toThrowError(EmailExistsError);
  });

  it('it creates a new and unconfirmed user', async () => {
    const newUser = await Auth.signup({
      email: 'newuser@gmail.com',
      password: 'hello123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(newUser).toBeDefined();

    expect(newUser).toHaveProperty('_id');
    expect(newUser).toHaveProperty('createdAt');

    expect(newUser).toHaveProperty('email', newUser.email);
    expect(newUser).toHaveProperty('password');
    expect(newUser).toHaveProperty('firstName', newUser.firstName);
    expect(newUser).toHaveProperty('lastName', newUser.lastName);
    expect(newUser).toHaveProperty('flags.accountConfirmedAt', null);
  });

  it('it hashes the password', async () => {
    const salt = bcrypt.genSaltSync(10);
    bcrypt.genSaltSync = jest.fn().mockImplementation(() => salt);

    const newUser = await Auth.signup({
      email: 'mark.junior@gmail.com',
      password: 'hashme',
      firstName: 'Mark',
      lastName: 'Junior',
    });

    expect(newUser).toHaveProperty('password', bcrypt.hashSync('hashme', salt));
  });

  it('it converts the email address to lowercase', async () => {
    const newUser = await Auth.signup({
      email: 'IAmMixedCase@gmail.com',
      password: 'hello123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(newUser).toHaveProperty('email', 'iammixedcase@gmail.com');
  });
});
