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

interface IEmailData {
  recipient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  subject: string;
}

class Mailer {
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = secrets.sendgrid.enabled;
  }

  public send(data: IEmailData) {
    if (!this.isEnabled) {
      logger.warn('Attempted to send email but mailer is not enabled.');
      return null;
    }

    const email = {
      from: 'hello@gomuso.io',
      to: data.recipient.email,
      subject: data.subject,
      text: 'Hello world',
      html: '<b>Hello world</b>',
    };

    return transporter.sendMail(email, (err: any, info: any) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(info.response);
      }
    });
  }
}

export default new Mailer();
