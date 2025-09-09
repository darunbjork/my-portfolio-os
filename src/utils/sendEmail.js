const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey", // This is literally the string "apikey"
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const message = {
    from: process.env.FROM_EMAIL, // Use FROM_EMAIL from .env, which should be verified
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Email sent: %s', info.messageId);
};

module.exports = sendEmail;