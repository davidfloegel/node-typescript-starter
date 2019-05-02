import secrets from 'utils/secrets';

export const signupEmail = (firstName: string, verificationToken: string) => `
  Hi ${firstName},
  <br /><br />
  Before you can get started you need to verify your account.
  <br />
  Please click on the link below: <br />
  ${secrets.appUrl}/verify?token=${verificationToken}
  <br /><br />
  Thanks!
`;

export const accountVerified = (firstName: string) => `
  Hi ${firstName},
  <br /><br />
  Amazing, your account has successfully been verified!
  <br />
  Enjoy using our platform!
`;

export const resetPassword = (firstName: string, token: string) => `
  Hi ${firstName},
  <br /><br />
  You have requested a link to reset your password.
  <br />
  To do so, please click on the link below: <br />
  ${secrets.appUrl}/reset-password?token=${token}
  <br /><br />
  Once you have set a new password, you can log back in!
`;

export const passwordResetComplete = (firstName: string) => `
  Hi ${firstName},
  <br /><br />
  You have successfully reset your password!
  <br />
  You can now log back in to your account.
  <br /><br />
  Thanks!
`;
