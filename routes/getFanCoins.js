const express = require('express')
const router = express.Router()
const userModel = require('../model/userProp')
const unlockModel = require('../model/unlock')

router.get('/', (req, res) => {

    let input = req.query

    userModel.findById(input.userId, (err, data) => {
        if (data) {

            unlockModel.findOne({ userId: input.userId }, (err, result) => {
                let coinsGenerated = Math.floor(Math.random() * 50)
                if (result) {
                    result.visits += 1;
                    if (result.visits % 10 == 0) {
                        result.coins = coinsGenerated
                    }

                    result.save().then((data) => {
                        res.send({
                            statusCode: 1,
                            statusMessage: 'success',
                            coins: data.coins
                        })
                    }).catch(e => console.log(e))
                } else {
                    let unlockMod = new unlockModel()
                    unlockMod.visits = 1
                    unlockMod.coins = coinsGenerated
                    unlockMod.userId = input.userId

                    unlockMod.save().then((data) => {
                        res.send({
                            statusCode: 1,
                            statusMessage: 'success',
                            coins: data.coins
                        })
                    }).catch(e => console.log(e))
                }

            })

        }
    })

})

module.exports = router