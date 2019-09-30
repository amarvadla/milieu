const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs');

const userModel = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    birthDay: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    }

}, { versionKey: false, collection: "userProp" })

userModel.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userModel.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const schemaModel = mongoose.model("userProp", userModel)
module.exports = schemaModel