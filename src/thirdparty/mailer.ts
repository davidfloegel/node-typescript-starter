import nodemailer from 'nodemailer';
import secrets from 'utils/secrets';

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    pass: secrets.sendgrid.user,
    user: secrets.sendgrid.password,
  },
});
