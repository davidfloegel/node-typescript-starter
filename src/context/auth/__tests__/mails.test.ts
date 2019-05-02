import * as mails from '../mails';

describe('Authentiction Emails', () => {
  test('sign up email copy', () => {
    const email = mails.signupEmail('John', '12345');

    expect(email).toContain('Hi John');
    expect(email).toContain('?token=12345');
  });

  test('account confirmed email copy', () => {
    const email = mails.accountVerified('John');

    expect(email).toContain('Hi John');
  });

  test('password reset link email copy', () => {
    const email = mails.resetPassword('Mark', '12345');

    expect(email).toContain('Hi Mark');
    expect(email).toContain('?token=12345');
  });

  test('password reset confirmation email copy', () => {
    const email = mails.passwordResetComplete('John');

    expect(email).toContain('Hi John');
  });
});
