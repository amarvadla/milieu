const express = require('express'),
    router = express.Router()
const dailybonus = require('../model/dailybonus')

router.post('/', (req, res) => {

    var input = req.body

    dailybonus.findOne({ userId: input.userId }, (err, data) => {

        if (err) {

        } else if (data) {
            var dbDate = data.recentDate
            var today = Date.now()

            var time_difference = new Date(today).getTime() - new Date(dbDate).getTime()
            var Difference_In_Days = Math.floor(time_difference / (1000 * 3600 * 24));
            
            if (Difference_In_Days == 1) {
                data.recentDate = Date.now()
                data.consecutiveDays += 1
                saveTheData(res, data)
            } else if (Difference_In_Days > 1) {
                data.recentDate = Date.now()
                data.consecutiveDays = 0
                saveTheData(res, data)
            } else if (Difference_In_Days == 0) {
                res.send({
                    statusCode: 0,
                    statusMessage: 'already claimed'
                })
            }

        } else {

            var dailybonusObj = new dailybonus()
            dailybonusObj.consecutiveDays = 1
            dailybonusObj.recentDate = Date.now()
            dailybonusObj.userId = input.userId

            dailybonusObj.save().then((data) => {
                res.send({
                    statusCode: 1,
                    statusMessage: 'successfully created',
                    day: data.consecutiveDays,
                    points: 10
                })
            }).catch((e) => {

            })

        }

    })

})

function saveTheData(res, data) {
    data.save().then((result) => {

        var obj = {
            statusCode: 1,
            statusMessage: 'success',
            day: result.consecutiveDays
        }

        if (result.consecutiveDays > 6) {
            obj.points = 50
        } else if (result.consecutiveDays > 3 && result.consecutiveDays <= 6) {
            obj.points = 20
        } else if (result.consecutiveDays > 0 && result.consecutiveDays <= 3) {
            obj.points = 10
        }

        res.send(obj)

    }).catch((e) => {
        res.send(e)
    })
}

module.exports = router