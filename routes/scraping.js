const express = require('express'),
    router = express.Router(),
    request = require('request'),
    cheerio = require('cheerio')

router.get('/', (req, res) => {

    url = 'https://www.ndtv.com';

    request(url, (err, response, html) => {

        if (!err) {
            var $ = cheerio.load(html)

            var productsBlock = $('.featured_desc')

            $('.featured_cont').children('ul').each((i, el) => {
                    const item = $(el).text()
                    const link = $(el).children('h2').attr('href')

                    console.log(item , link);
                    
            })

            // res.send(productsBlock.text())

        }

    })

})

module.exports = router