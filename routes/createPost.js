const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')
const postSchema = require('../model/post')
const ObjectId = require('mongoose').Types.ObjectId

router.post('/createPost', (req, res) => {

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

        likeOrNot(input.postId, input.userId).then((result) => {


            if (!result[0].likeStatus) {
                postSchema.update({
                    _id: input.postId
                }, { $push: { likes: { userId: input.userId } } }, (err, postData) => {
                    if (postData) {
                        res.send({
                            statusCode: 1,
                            statusMessage: 'successfully liked',
                            data: {
                                id: postData._id
                            }
                        })
                    }
                })
            } else {
                postSchema.update({
                    _id: input.postId
                }, { $pull: { likes: { userId: input.userId } } }, (err, postData) => {
                    if (postData) {
                        res.send({
                            statusCode: 1,
                            statusMessage: 'successfully unliked',
                            data: {
                                id: postData._id
                            }
                        })
                    }
                })
            }

        })
    }).catch((e) => {
        res.send({
            statusCode: 0,
            statusMessage: e
        })
    })
})


function likeOrNot(postId, userId) {
    return new Promise((resolve, reject) => {
        postSchema.aggregate([
            { $match: { '_id': ObjectId(postId) } },
            {
                $project: {
                    'likeStatus': {
                        $in: [ObjectId(userId), '$likes.userId']
                    }
                }
            }
        ]).exec((err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

router.get('/getUserPosts', (req,res) => {

    var input = req.query

    getUser(input.userId).then((data) => {
        if(data){

            var postArray = []

            postSchema.find({ userId : input.userId} , (err,data) => {

                for(var i=0;i<data.length;i++){

                    var post = {}

                    post.id = data[i]._id
                    post.createdDate = data[i].createdDate
                    post.comments = data[i].comments.length
                    post.likes = data[i].likes.length
                    post.postType = data[i].postType
                    post.sourceUrl = data[i].sourceUrl
                    post.postText = data[i].postText

                    postArray.push(post)

                }

                res.send({
                    statusCode : 1,
                    statusMessage: 'success',
                    data : postArray
                })

            })

        }
    }).catch((e) => {
        res.send({
            statusCode : 1,
            statusMessage: e
        })
    })

})

module.exports = router