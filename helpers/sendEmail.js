const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

function sendEmail(message) {
  return transport.sendMail(message);
}

function sendVerificationEmail(recipient, verificationToken) {
  const message = {
    to: recipient,
    from: process.env.MAILTRAP_EMAIL_FROM || 'example@example.com',
    subject: 'Welcome to the Contacts application!!!',
    html: `Please click the following link to confirm your registration: <a href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm Registration</a>`,
    text: `Please click the following link to confirm your registration: http://localhost:3000/api/users/verify/${verificationToken}`,
  };
  return sendEmail(message);
}

module.exports = { sendEmail, sendVerificationEmail };
