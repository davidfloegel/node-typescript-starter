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
  html: string;
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

    const toEmail =
      (secrets.dev && secrets.sendgrid.catchAll) || data.recipient.email;

    const email = {
      from: 'hello@gomuso.io',
      to: toEmail,
      subject: data.subject,
      html: data.html,
    };

    return transporter.sendMail(email, (err: any, info: any) => {
      if (err) {
        logger.error(`Couldn't send email: ${err}`);
      } else {
        logger.info(`Email sent: ${info.response}`);
      }
    });
  }
}

export default new Mailer();
