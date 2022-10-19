// Models
const createUser = require("../models/createUser");
const readOneUser = require("../models/readOneUser");
const {
  readOneUserByEmail,
  readOneUserByUserName,
  updateOneUserByUsername,
  updateOnePasswordByUserName
} = require("../models/users");

// Packages
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

// Helpers
const auth = require("../helpers/auth-module");
const bcrypt = require("../helpers/bcrypt-module");

exports.create_user = (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  bcrypt.newPass(password).then(pwdRes => {
    if (pwdRes.status === 200) {
      const userInfo = {
        firstName,
        lastName,
        email,
        username,
        password: pwdRes.passwordHash
      };

      createUser
        .data(userInfo)
        .then(resolve => {
          delete resolve.password;
          jwt.sign(
            resolve,
            process.env.secret,
            { expiresIn: "1h" },
            (err, token) => {
              return res.send({
                isLoggedIn: true,
                token
              });
            }
          );
        })
        .catch(err => {
          res.json(err);
        });
    }
  });
};

exports.read_one_user = (req, res) => {
  const username = req.params.username;
  readOneUser
    .data(username)
    .then(resolve => {
      let userObj = {
        user: resolve
      };
      delete userObj.user.password;
      res.send(userObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_one_user_by_email = async (req, res) => {
  const {
    params: { email }
  } = req;

  try {
    const data = await readOneUserByEmail(email);
    res.status(200).send({ status: 200, message: "ok", data });
  } catch (error) {
    res
      .status(500)
      .send({ status: 500, message: "Internal Server Error", error });
  }
};

exports.read_login = async (req, res) => {
  const {
    body: { username, password }
  } = req;

  try {
    const data = await readOneUserByUserName(username);

    if (data != null) {
      const checkPasswordResult = await bcrypt.checkPass(
        password,
        data.password
      );

      if (checkPasswordResult.status === 200 && checkPasswordResult.login) {
        delete data.password;
        data.iss = "Portfolio Vue";
        jwt.sign(
          data,
          process.env.secret,
          { expiresIn: "1h" },
          (error, token) => {
            if (error) {
              return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                error
              });
            } else {
              return res.status(200).json({
                status: 200,
                message: "ok",
                data: {
                  isLoggedIn: true,
                  token
                }
              });
            }
          }
        );
      } else {
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: "Username or password was incorrect."
        });
      }
    } else {
      // User not found. Return a 500 instead of 404 to avoid leaking usernames.
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: "Username or password was incorrect."
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error
    });
  }
};

// Password Reset Controllers

// Reset the Password
exports.password_reset = async (req, res) => {
  const {
    body: { password: newPassword, token }
  } = req;

  const {
    payload: { userName: decodedUserName }
  } = jwt.decode(token);

  try {
    const data = await readOneUserByUserName(decodedUserName); // ! TODO: Update this to use readOneUserById after switch to official MongoDB driver
    const { _id: userId, firstName, lastName, password } = data;

    const created = new Date(
      parseInt(userId.toString().substring(0, 8), 16) * 1000
    );
    const secret = password + created.getTime();

    jwt.verify(token, secret, async (error, verified) => {
      if (error) {
        res.status(400).json({ status: 403, message: "Forbidden", error });
      } else if (verified) {
        const isValidPassword = await validatePassword(newPassword);

        if (!isValidPassword) {
          res.status(400).json({
            status: 400,
            message: "Bad Request",
            error: "Invalid password."
          });
        } else {
          const encryptPasswordResult = await bcrypt.newPass(newPassword);

          if (encryptPasswordResult.status !== 200) {
            res.status(500).json({
              status: 500,
              messsage: "Internal Server Error",
              error: "Could not encrypt password."
            });
          } else {
            const {
              payload: { id: verifiedUserId, userName: verifiedUserName }
            } = verified;

            const updatePasswordResult = await updateOnePasswordByUserName(
              verifiedUserName,
              encryptPasswordResult.passwordHash
            );

            if (updatePasswordResult.ok !== 1) {
              res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                error:
                  "Something went terribly awry with the database when attempting to update the password."
              });
            } else {
              const { n, nModified } = updatePasswordResult;

              if (n === 0 || nModified === 0) {
                res.status(500).json({
                  status: 500,
                  message: "Internal Server Error",
                  error: "Password was not updated."
                });
              } else {
                // ! TODO FIRST: Send the password has been updated email.
                res.status(200).json({
                  status: 200,
                  message: "ok",
                  data: "Password updated successfully."
                });
              }
            }
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error:
        "We have no idea what went wrong, but it was catastrophic and your password was not updated."
    });
  }
};

// Send the Reset Password Email
exports.reset_password = async (req, res) => {
  const {
    body: { email }
  } = req;

  // Check that the email exists
  try {
    const token = null; // await tokens.create(-99); // userId of -99 for now, TODO: set up a special "server" user for tokens

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/users/email/${email}`
    );
    const json = response.ok ? await response.json() : null;

    if (json.error) {
      const isValidEmail = await checkEmail(email);

      if (!isValidEmail) {
        res.status(400).json({
          status: 400,
          message:
            "Bad request. Invalid email address. Please check the email address you submitted and try again."
        });
      } else {
        const mailOptions = {
          from: '"Portfolio Password Reset" <reset@olen.dev>',
          to: email,
          subject: "[OLEN.DEV] Password Reset Attempted",
          text: `We received a request to reset your Portfolio password. However, there is no Portfolio account associated with this email address. \n\nIf you have a Portfolio account and were expecting this email, please try again with the address you provided when signing up. \n\nIf you don't have a Portfolio account, please ignore this email. \n\nRegards, \n\nThe Portfolio Support Team`,
          html: `<html><body><p>We received a request to reset your Portfolio password. However, there is no Portfolio account associated with this email address. </p><p>If you have a Portfolio account and were expecting this email, please try again with the address you provided when signing up. </p><p>If you don't have a Portfolio account, please ignore this email. </p><p>Regards, </p><p>The Portfolio Support Team</p></body></html>`
        };

        // Send the email
        const sendResponse = await fetch(
          `${process.env.API_BASE_URL}/api/mail/send`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ mailOptions })
          }
        );

        const sendJson = sendResponse.ok ? await sendResponse.json() : null;

        if (sendJson && !sendJson.error) {
          res.status(200).json({ status: 200, message: "ok", data: sendJson });
        } else {
          res.status(500).json({
            status: 500,
            message:
              "Internal server error. An email could not be sent. Please check the email address you entered and try again."
          });
        }
      }
    } else {
      const { _id: id, password, firstName, lastName, userName } = json.data; // ! TODO: fix this destructuring fail should be { data: {...}, } = json
      const payload = { id, userName };

      const created = new Date(parseInt(id.substring(0, 8), 16) * 1000);
      const secret = password + created.getTime();

      const tempToken = jwt.sign({ payload }, secret, { expiresIn: "1h" });

      // Create the password reset link
      const passwordResetLink = `${
        process.env.FRONT_END_URL
      }/login/reset-password/${tempToken}`;

      // Create the email
      const mailOptions = {
        from: '"Portfolio Password Reset" <reset@olen.dev>',
        to: email,
        subject: "[OLEN.DEV] Reset Your Password",
        text: `Hi ${firstName} ${lastName},\n\nWe received a request to reset your Portfolio password. If it wasn't you, don't worry, your password is safe and you can ignore this email. \n\nTo reset your password, copy and paste the following link: \n\n${passwordResetLink}>\n\nThe password reset link will expire in one hour.`,
        html: `<html><body><p>Hi ${firstName} ${lastName},</p><p>We received a request to reset your Portfolio password. If it wasn't you, don't worry, your password is safe and you can ignore this email. </p><p>To reset your password use the following link: <a href=${passwordResetLink}>Reset My Password</a>. </p><p>The password reset link will expire in one hour. </p></body></html>`
      };
      // Send the email
      const sendResetResponse = await fetch(
        `${process.env.API_BASE_URL}/api/mail/send`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ mailOptions })
        }
      );

      // eslint-disable-next-line prettier/prettier
      const sendResetJson = sendResetResponse.ok ? await sendResetResponse.json() : null;

      if (sendResetJson && !sendResetJson.error) {
        res
          .status(200)
          .json({ status: 200, message: "ok", data: sendResetJson });
      } else {
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: "Could not send email."
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error", error });
  }
};

// Check for MX record

const checkEmail = async email => {
  const expression = /.+@.+\..+/i;

  if (expression.test(String(email).toLowerCase())) {
    const result = await fetch(
      `${process.env.API_BASE_URL}/api/mail/check-mx/${email}`
    );
    const data = await result.json();
    const { mxExists } = data;

    return mxExists ? true : false;
  } else {
    return false;
  }
};

exports.update_one_user_by_username = async (req, res) => {
  // TODO - validate the input
  const { body, params: { username} } = req

  const result = await updateOneUserByUsername(username, body)
  if (result === 204) {
    res.status(204)
  }
}

/**
 * Validate that a potential password meets minimum requirements
 * @author Olen Daelhousen <matchr@olen.dev>
 * @param {string} password - the password to be tested
 * @returns {Promise} Promise object represents true if the password passes validation or false if not
 */

const validatePassword = password => {
  return new Promise((resolve, reject) => {
    try {
      const oneUpper = /[A-Z]/;
      const oneLower = /[a-z]/;
      const oneDigit = /\d/;
      const oneSpecial = /[!@#$%^&*()-+=]/;

      const isOneUpper = oneUpper.test(password);
      const isOneLower = oneLower.test(password);
      const isOneDigit = oneDigit.test(password);
      const isOneSpecial = oneSpecial.test(password);
      const isLength = password && password.length >= 8; // Short circuit to avoid promise rejection if null or undefined password is passed

      if (
        isOneUpper &&
        isOneLower &&
        (isOneDigit || isOneSpecial) &&
        isLength
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch {
      reject(false);
    }
  });
};
