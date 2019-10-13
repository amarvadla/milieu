const express = require('express')
const router = express.Router()
const userPropSchema = require('../model/userProp')
const userSettingSchema = require('../model/userSetting')
const postSchema = require('../model/post')

router.get('/', (req, res) => {

    var input = req.query

    userPropSchema.findOne({ _id: input.userId }, (err, result) => {

        if (err) {
            res.send({
                statusCode: 0,
                statusMessage: 'wrong userId'
            })
        } else if (result) {

            getFreindsList(input).then((data) => {

                getFreindsPosts(input, data, res).catch(e => res.send(e))

            }).catch(e => res.send({ statusCode: 0, statusMessage: e }))

        }

    })

})


async function getFreindsPosts(input, data, res) {

    var postsArray = []

    new Promise((resolve, reject) => {

        data.forEach((element, index, arr) => {

            postSchema.find({ userId: element.userId }, (err, result) => {
                if (result) {
                    postsArray.push(result)
                    if (index == arr.length - 1) {
                        resolve(postsArray)
                    }
                }
            })

        });

    }).then((posts) => {
        res.send({ statusCode: 1, statusMessage: 'success', data: posts })
    }).catch(e => res.send(e))


}


function getFreindsList(input) {

    return new Promise((resolve, reject) => {

        userSettingSchema.findOne({ ownerId: input.userId }, (err, result) => {

            if (err) {
                reject('please complete usserSettings')
            } else if (result) {

                resolve(result.freindsList)

            }
        })

    })

}

module.exports = router