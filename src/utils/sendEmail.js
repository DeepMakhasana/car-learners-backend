const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    // service: "gmail",
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.log("Error", err);
      return false;
    } else {
      console.log("Email Sent");
      return true;
    }
  });
};

module.exports = sendEmail;
