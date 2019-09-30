const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')

router.post('/', (req, res) => {
    var input = req.body

    userSchema.find({ email: input.email }, (err, data) => {

        if (err) {
            res.send(err)
        } else if (data) {

            userSchema.validatePassword(input.email, input.password).then((data) => {
                res.send({
                    statusCode: 1,
                    statusMessage: "logged in"
                })
            }).catch(e => {
                res.send({
                    statusCode: 0,
                    statusMessage: "email/mobile or password is wrong"
                })
            });

        }
    })
})

module.exports = router