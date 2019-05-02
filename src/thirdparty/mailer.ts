import nodemailer from 'nodemailer';
import logger from 'utils/logger';
import secrets from 'utils/secrets';

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: secrets.sendgrid.user,
    pass: secrets.sendgrid.password,
  },
});

class Mailer {
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = true;
  }

  public send() {
    if (!this.isEnabled) {
      logger.warn('Attempted to send email but mailer is not enabled.');
    }

    const email = {
      from: 'hello@gomuso.io',
      to: 'mail@davidfloegel.com',
      subject: 'Hello',
      text: 'Hello world',
      html: '<b>Hello world</b>',
    };

    transporter.sendMail(email, (err, info) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(info.response);
      }
    });
  }
}

export default new Mailer();
