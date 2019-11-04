const express = require('express'),
    router = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    cron = require('node-cron')

var fs = require('fs')
var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

var cronJob = cron.schedule("50 * * * * *", () => {

    console.log('[rint')

    url = 'https://www.ndtv.com';

    request(url, (err, response, html) => {

        if (!err) {
            var $ = cheerio.load(html)

            var productsBlock = $('.featured_desc')

            var date = new Date();
            logger.write("\n \n -- > " + date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds() + "  " + date.getDate() + "/" + date.getMonth() + '/' + date.getFullYear())

            $('.featured_cont').children('ul').each((i, el) => {
                const item = $(el).text()
                const link = $(el).children('li').each((j, elem) => {
                    logger.write($(elem).children('h2').text())
                })
            })
        }

    })

})

module.exports = cronJob