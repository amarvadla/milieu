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
userModel.statics.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


userModel.statics.validatePassword = function (email, password) {

    var userModel = this;

    return userModel.findOne({ email }).then((user) => {
        
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, bool) => {
                if (bool) {
                    resolve(user);
                } else {
                    reject("password is wrong");
                }
            });
        })
    })
}

const schemaModel = mongoose.model("userProp", userModel)
module.exports = schemaModel