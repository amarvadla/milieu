const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')
const userSetting = require('../model/userSetting')


router.post('/sendRequest', (req, res) => {

    var input = req.body

    var ownerUser = getUser(input.friendId)
    var friendUser = getUser(input.userId)

    var promiseArray = [ownerUser, friendUser]

    Promise.all(promiseArray).then((result) => {
        if (result.length == 2) {
            saveFriendRequest(result[0]._id, result[1]._id, res)
        }
    }).catch((e) => {
        res.send(e)
    })

})

router.get('/getFriendRequests', (req, res) => {

    var input = req.query

    getUser(input.userId).then((data) => {

        userSetting.findOne({ ownerId: input.userId }, (err, result) => {

            if (result) {

                var array = []

                result.friendRequests.forEach((element) => {
                    var obj = {}

                    obj.id = element._id
                    obj.userId = element.userId
                    obj.date = element.date
                    obj.blocked = element.blocked

                    array.push(obj)
                })

                res.send({
                    statusCode: 1,
                    statusMessage: 'success',
                    data: array
                })
            } else if (err) {
                res.send(err)
            }
        })
    }).catch(e => res.send(e))


})


router.post('/respondFriendRequest', (req, res) => {

    var input = req.body

    getUser(input.userId).then((data) => {

        if (data) {

            userSetting.findOne({ ownerId: input.userId }, (err, result) => {

                if (result) {

                    if (input.accepted) {
                        Promise.all([removeFromrequestList(input), addTofreindsList(input)]).then((promiseData) => {

                            if (promiseData.length == 2) {
                                res.send({
                                    statusCode: 1,
                                    statusMessage: 'successfully added to freindsList'
                                })
                            }

                        }).catch((e) => {
                            res.send(e)
                        })
                    } else {
                        removeFromrequestList(input).then((data) => {
                            res.send({
                                statusCode: 1,
                                statusMessage: 'deleted from requestList'
                            })
                        })
                    }

                } else {
                    res.send({
                        statusCode: 0,
                        statusMessage: 'create your profile to accept'
                    })
                }

            })

        }

    }).catch(e => res.send(e))

})

function removeFromrequestList(input) {

    return new Promise((resolve, reject) => {

        userSetting.update({ ownerId: input.userId },
            { $pull: { friendRequests: { userId: input.friendId } } }, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )

    })

}

function addTofreindsList(input) {

    return new Promise((resolve, reject) => {

        userSetting.update({ ownerId: input.userId },
            { $push: { freindsList: { userId: input.friendId } } }, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )

    })
}

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
                var freindsList = data.freindsList

                var alreadySent = false
                var message = ''

                friendRequests.forEach((element) => {
                    if (element.userId.equals(friendId)) {
                        alreadySent = true
                        message = 'request already sent'
                    }
                })

                freindsList.forEach((element) => {
                    if (element.userId.equals(friendId)) {
                        alreadySent = true
                        message = 'already in you friends list'
                    }
                })

                // var boolArray = friendRequests.map(obj => obj.userId.equals(friendId))

                // console.log(alreadySent);


                if (alreadySent) {
                    reject(message)
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
