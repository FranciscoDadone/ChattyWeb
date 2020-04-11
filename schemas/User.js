var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
    ID: {type: Number, unique: true},
    username: { type: String },
    email: { type: String, unique: true},
    password: { type: String }
}));