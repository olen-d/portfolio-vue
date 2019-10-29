// Packages
const nodemailer = require("nodemailer");

exports.send_mail = (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.gandi.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `${email}`,
    to: "contact@olen.dev",
    subject: `[OLEN.DEV] Website Contact Form Message From ${name}`,
    text: `${message} \n\n Contact Name: ${name} \nContact Email: ${email}`
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(success);
    }
  });
};
