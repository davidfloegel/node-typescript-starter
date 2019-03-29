import nodemailer from 'nodemailer';
import { SENDGRID_PASSWORD, SENDGRID_USER } from '../utils/secrets';

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    pass: process.env.SENDGRID_PASSWORD,
    user: process.env.SENDGRID_USER,
  },
});
