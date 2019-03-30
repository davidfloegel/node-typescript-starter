import * as Errors from 'src/lib/errors';

describe('Test Errors & Error Codes', () => {
  it('MongoDb Error Codes', () => {
    expect(Errors.DUPLICATE_ERROR_CODE).toBe(11000);
  });

  it('Unauthorized Error', () => {
    const e = new Errors.UnauthorizedError();

    expect(e).toBeInstanceOf(Error);
    expect(e).toHaveProperty('code', 'unauthorized');
    expect(e).toHaveProperty('statusCode', 401);
    expect(e).toHaveProperty(
      'message',
      'You are not authorized to access this endpoint'
    );
  });

  it('Internal Error', () => {
    const e = new Errors.InternalError();

    expect(e).toBeInstanceOf(Error);
    expect(e).toHaveProperty('code', 'internal-server-error');
    expect(e).toHaveProperty('statusCode', 500);
    expect(e).toHaveProperty('message', 'Internal Server Error');
  });

  it('Validation Error', () => {
    const e = new Errors.ValidationError({
      firstName: 'First name is too long',
      lastName: 'Last name is too short',
    });

    expect(e).toBeInstanceOf(Error);
    expect(e).toHaveProperty('code', 'validation-error');
    expect(e).toHaveProperty('statusCode', 400);
    expect(e).toHaveProperty('message', 'Form validation failed');
    expect(e).toHaveProperty('errors', {
      firstName: 'First name is too long',
      lastName: 'Last name is too short',
    });
  });

  it('Email Exists Error', () => {
    const e = new Errors.EmailExistsError();

    expect(e).toBeInstanceOf(Error);
    expect(e).toHaveProperty('code', 'email-exists');
    expect(e).toHaveProperty('statusCode', 400);
    expect(e).toHaveProperty('message', 'Email address is already registered');
    expect(e).toHaveProperty('errors', [
      { email: 'Email address is already registered' },
    ]);
  });
});
