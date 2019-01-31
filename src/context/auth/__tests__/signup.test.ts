import Auth from 'context/auth';
import db from 'test/db';

beforeAll(async () => db.setup());

afterAll(async () => db.teardown());

describe('Authentication: Signup', () => {
  // it('it throws an error if the form data is invalid', async () => {});

  // it('it throws an error if the email address is already registered', async () => {});

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
