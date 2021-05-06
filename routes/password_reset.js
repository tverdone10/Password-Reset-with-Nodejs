const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Here we will send a post request to reset our password
// If a user forgets their password, they can input the email associated with their account and recieve an email allowing them to reset it
router.post("/", async (req, res) => {
try {
  // Here we are creating a token.
  // This token will be attached to their User object in the database, and will be in the link we send to them as a parameter
  // We'll compare these tokens against each other to ensure that the user trying to reset their password is the person who has access to this email address
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    console.log(token);

    // Find the user based on the email they input
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        // If no User with this email exists, send an error
        console.log("user does not exist");
        return res
          .status(404)
          .send({ error: "A Member with this email address doesn't exist!" });
      } else {
    // Here we'll create a test nodemailer account just for demonstration purposes
    // All nodemailer stuff was copied from nodemailer's starter documentation, which can be found here: https://nodemailer.com/about/
    let testAccount = await nodemailer.createTestAccount()

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

    // If this User does exist, set their passwordResetToken to the token we created earlier
    // See ../models/user if you would like to see where we've added this in our userSchema
    user.passwordResetToken = token;
    await user.save().then((result) => {
        transporter.sendMail({
            to: user.email,
            from: '"Fred Foo 👻" <foo@example.com>',
            subject: "CLLCTVE Password Reset",
            //NOTE: Link for Staging is http://localhost:3000/creator/account/reset-password/:token
            //NOTE: Link for Prod is https://www.cllctve.com/creator/account/reset-password/:token
            // text: `Hello, you have forgotten your password. Here is your token: http://localhost:3000/creator/account/reset-password/${token}`
            html: `<p>Hey ${user.firstName}<br><br>You can reset your password at http://localhost:5000/api/password_reset/changePassword/${token}</p>`
        })
    })
    return res.status(200).json({
        resetToken: token,
        email: req.body.email
    })
    
      }
    })
}) 
}
catch (error) {
        res.status(404).send("something went wrong!")
    }
})
