import { decodeToken, generateToken } from 'context/auth/utils';

jest.mock('utils/secrets', () => ({ sessionSecret: 'mysecret' }));

describe('Authentication: Utils', () => {
  it('it should generate a new JWT', () => {
    const token = generateToken('57293');
    expect(token).toBeDefined();
  });

  it('it should decode an existing JWT and return the users id', () => {
    const existingToken = generateToken('12345');

    expect(decodeToken(existingToken)).toEqual('12345');
  });
});
