const express = require('express')
const router = express.Router()
const userProp = require('../model/userProp')
const userSett = require('../model/userSetting')

router.post('/', (req, res) => {

    var input = req.body

    var userSchema = new userProp()

    if (validation(input).statusCode != 0) {
        userSchema.firstName = input.firstName
        userSchema.lastName = input.lastName
        userSchema.mobile = input.mobile
        userSchema.email = input.email
        userSchema.gender = input.gender
        userSchema.birthDay = input.birthDay
        userSchema.password = userSchema.generateHash(input.password);

        userProp.find({ $or: [{ email: input.email }, { mobile: input.mobile }] }, (err, data) => {
            if (data.length > 0) {
                res.send({ statusCode: 0, statusMessage: "email/mobile already exists" })
            } else {
                userSchema.save().then((data) => {
                    res.send({
                        statusCode: 1,
                        statusMessage: 'profile created',
                        data: {
                            id: data._id
                        }
                    })
                }).catch(e => console.log(e))
            }
        })

    } else {
        res.send(validation(input))
    }

})

var validation = function (input) {

    if (!input.firstName) {
        return { statusCode: 0, statusMessage: 'firstName is required' }
    } else if (!input.lastName) {
        return { statusCode: 0, statusMessage: 'lastName is required' }
    } else if (!input.password) {
        return { statusCode: 0, statusMessage: 'password is required' }
    } else if (!input.mobile && !input.email) {
        return { statusCode: 0, statusMessage: 'mobile/email is required' }
    } else if (!input.birthDay) {
        return { statusCode: 0, statusMessage: 'birthDay is required' }
    } else {
        return { statusCode: 1, statusMessage: '' }
    }

}

router.post('/userInfo', (req, res) => {

    var input = req.body

    var userSettModel = new userSett()

    userSettModel.ownerId = input.userId
    userSettModel.profileType = input.profileType
    userSettModel.profilePicture = input.profilePicture
    userSettModel.intrests = input.intrests
    userSettModel.postingPrivacy = input.postingPrivacy
    // userSettModel.freindsList = userSettModel.freindsList

    userSettModel.save().then((result) => {

        if (result) {
            res.send({
                statusCode: 1,
                statusMessage: 'profile updated',
                data: {
                    id: result.ownerId,
                    profilePicture: result.profilePicture,
                    intrests: result.intrests
                }
            })
        }

    }).catch((e) => {
        res.send({
            statusCode: 0,
            statusMessage: e
        })
    })

})

module.exports = router