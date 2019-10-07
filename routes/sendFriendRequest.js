const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')
const userSetting = require('../model/userSetting')


router.post('/sendRequest', (req, res) => {

    var input = req.body

    var ownerUser = getUser(input.userId)
    var friendUser = getUser(input.friendId)

    var promiseArray = [ownerUser, friendUser]

    Promise.all(promiseArray).then((result) => {
        if (result.length == 2) {
            saveFriendRequest(result[0]._id, result[1]._id, res)
        }
    }).catch((e) => {
        res.send(e)
    })

})

function saveFriendRequest(userId, friendId, res) {

    if (userId.equals(friendId)) {
        res.send({
            statusCode: 0,
            statusMessage: 'id\'s cannot be same'
        })
    } else {

        isRequestSent(userId, friendId).then((data) => {

            if (data) {
                userSetting.update(
                    { ownerId: userId },
                    { $push: { friendRequests: { userId: friendId } } }, (err, result) => {
                        if (result) {
                            res.send({
                                statusCode: 1,
                                statusMessage: 'success'
                            })
                        } else {
                            res.send({
                                statusCode: 1,
                                statusMessage: err
                            })
                        }
                    }
                )
            }

        }).catch((e) => {
            res.send({
                statusCode: 0,
                statusMessage: e
            })
        })


    }

}

function isRequestSent(userId, friendId) {

    return new Promise((resolve, reject) => {
        userSetting.findOne({ ownerId: userId }, (err, data) => {
            if (data) {
                var friendRequests = data.friendRequests

                var alreadySent = false

                friendRequests.forEach((element) => {
                    if (element.userId.equals(friendId)) {
                        alreadySent = true
                    }
                })

                // var boolArray = friendRequests.map(obj => obj.userId.equals(friendId))

                console.log(alreadySent);


                if (alreadySent) {
                    reject('request already sent')
                } else {
                    resolve(true)
                }
            } else {
                reject('wrong userId')
            }

        })
    })

}

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

module.exports = router
