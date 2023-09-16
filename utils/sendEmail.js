const nodemailer = require("nodemailer");

module.exports = async (email, subject, html) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transport.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
    });

    return "An email has been sent to your account for verification. Please verify before login.";
    
  } catch (error) {
    console.log("Error", error);
  }
};
