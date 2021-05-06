const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const user = require("../models/user");

// Here we will send a post request to reset our password
// If a user forgets their password, they can input the email associated with their account and recieve an email allowing them to reset it
router.post("/", (req, res) => {
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
        // If this User does exist, set their passwordResetToken to the token we created earlier
        // See ../models/user if you would like to see where we've added this in our userSchema
        user.passwordResetToken = token;
        user.save().then((transporter) => {
          return res.status(200).json({
            resetToken: token,
            email: req.body.email,
          });
        });
      }
    });
  });
});

router.post("/changePassword/:token", (req, res) => {

    const newPassword = req.body.newPassword
    const sentToken = req.params.token

    User.findOne({passwordResetToken: sentToken})
        .then(user => {
            if (!user) {
                return res.status(422).json({error: "Try again, something went wrong"})
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) =>{
                    res.json({message: "Password has been updated"})
                })
            })
        }).catch(err=>{
            console.log(err)
        })
})



module.exports = router;
