const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    
    // this is where we'll hold our password reset token when our user needs to reset their password

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },

    // this is where we'll hold our password reset token when our user needs to reset their password
    passwordResetToken: String,

    joined: {type: Date, default: Date.now}
})

module.exports = mongoose.model("User", userSchema)
