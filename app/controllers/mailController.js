// Packages
const dnsPromises = require("dns").promises;
const nodemailer = require("nodemailer");

exports.check_mx = async (req, res) => {
  // const { authorized } = req; // TODO: update this to use API key when implemented

  // if (authorized) {
  const { email } = req.params;

  const mxExists = async emailAddress => {
    const hostname = emailAddress.split("@")[1];

    try {
      const addresses = await dnsPromises.resolveMx(hostname);

      if (addresses && addresses.length > 0) {
        return addresses[0].exchange ? true : false;
      }
    } catch (error) {
      // TODO: Deal with the error
      return false;
    }
  };

  try {
    const result = await mxExists(email);
    res.status(200).json({ status: 200, message: "ok", mxExists: result });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error", mxExists: false });
  }
  // } else {
  //   res.sendStatus(403);
  // }
};

exports.send_mail = (req, res) => {
  const {
    body: { mailOptions }
  } = req;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMPT_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(success);
    }
  });
};
