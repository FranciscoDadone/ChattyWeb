const Mongoose = require('mongoose');

let User = new Mongoose.Schema({

    ID: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    authCookie: {
        type: String,
        required: false,
        unique: false,
        default: "Invalid"
    },
    registrationDate: {
        type: Date,
        required: true,
        unique: false,
        delfault: Date.now()
    },
    lastLogin: {type: Date}
    
});


module.exports = Mongoose.model('User', User);