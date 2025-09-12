const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  console.error('ERROR: SENDGRID_API_KEY is not set or is invalid in your .env file. It must start with "SG.".');
  // In a real application, you might want to exit the process
  // process.exit(1); 
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}


const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: process.env.FROM_EMAIL,
    subject: options.subject,
    html: options.message,
  };
  
  return sgMail.send(msg);
};

module.exports = sendEmail;