const cheerio = require('cheerio')
const cron = require('node-cron')
const request = require('request')
const express = require('express')
const router = express.Router()

// var cronJob = cron.schedule("* * * * *", () => {

//     var url = "https://www.cricbuzz.com/"

//     request(url, (err, response, html) => {

//         if (!err) {
//             var $ = cheerio.load(html)

//             var scoreBlock = $('.cb-col.cb-col-25.cb-mtch-blk')

//             console.log(scoreBlock);

//         }

//     })

// })

router.get('/', (req, res) => {

    var url = "https://genius.com/"

    request(url, (err, response, html) => {

        if (!err) {
            var $ = cheerio.load(html)

            var statsBlock = $('.PageGridFull-idpot7-0.icYXUj')

            // console.log(statsBlock.text());
            res.send(statsBlock.text())

        }

    })

})


module.exports = router
