const express = require('express')
const router = express.Router()
const pageSchema = require('../model/page')
const userSchema = require('../model/userProp')

router.post('/', (req, res) => {

    var input = req.body

    userSchema.findById(input.userId, (err, result) => {

        if(!err && result){
            var page = new pageSchema();

            page.creatorId = input.userId
            page.createdLocation = input.createdLocation

            page.save().then((data) => {

                let obj = {}
                obj.creatorId = data.creatorId
                obj.createdTime = data.createdTime
                obj.followers = data.followers.length
                obj.createdLocation = data.createdLocation

                res.send({
                    statusCode : 1,
                    statusMessage : 'succesfully created',
                    data : obj
                })
            })
        }

    })

})

module.exports = router