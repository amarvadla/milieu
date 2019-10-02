const express = require('express')
const router = express.Router()
const userSchema = require('../model/userProp')
const postSchema = require('../model/post')

router.post('/', (req, res) => {

    var input = req.body;
    getUser(input.userId).then((data) => {
        if (data) {
            res.send(data)
        }else{
            res.send(404)
        }
    }).catch((e) => {
        res.send(e)
    })



})

function getUser(id) {
    return new Promise((resolve, reject) => {
        userSchema.findById(id, (data, err) => {
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