const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  const transporter = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions)

};

module.exports = sendEmail
