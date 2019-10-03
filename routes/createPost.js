const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')
const postSchema = require('../model/post')

router.post('/', (req, res) => {

    var input = req.body;
    getUser(input.userId).then((data) => {
        if (data) {

            var post = new postSchema()

            post.userId = input.userId
            post.postType = input.postType
            post.sourceUrl = input.sourceUrl
            post.postText = input.postText

            post.save().then((data) => {
                if (data) {
                    res.send({
                        statusCode: 1,
                        statusMessage: "success",
                        data: {
                            postId: data._id,
                            postType: data.postType,
                            sourceUrl: data.sourceUrl,
                            postText: data.postText,
                            createdDate: data.createdDate,
                            modifiedDate: data.modifiedDate
                        }
                    })
                } else {
                    res.send({
                        statusCode: 0,
                        statusMessage: "failed"
                    })
                }
            })
        } else {
            res.send({
                statusCode: 0,
                statusMessage: "failed"
            })
        }
    }).catch((e) => {
        res.send(e)
    })


})

function getUser(id) {
    return new Promise((resolve, reject) => {
        userSchema.findById(id, (err, data) => {
            if (err) {
                reject({
                    statusCode: 0,
                    statusMessage: 'wrong user id'
                })
            } else if (data) {
                resolve(data)
            } else {
                reject({
                    statusCode: 0,
                    statusMessage: 'wrong user id'
                })
            }
        })
    })
}

router.post('/like', (req, res) => {
    var input = req.body

    getUser(input.userId).then((data) => {
        if (data) {
            
        }
    }).catch((e) => {

    })
})

module.exports = router