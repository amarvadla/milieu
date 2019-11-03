const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use('/signUpUser', require('./routes/postUserDetails'))
app.use('/loginUser', require('./routes/loginUser'))
app.use('/post', require('./routes/createPost'))
app.use('/friends', require('./routes/sendFriendRequest'))
app.use('/homeFeeds', require('./routes/homeFeeds'))
app.use('/getQuiz', require('./routes/quiz'))
app.use('/dailyBonus', require('./routes/dailyBonus'))
app.use('/scrape', require('./routes/scraping'))

app.get('*', (req, res) => res.send('Page Not found 404'));
app.post('*', (req, res) => res.send('not available'));

const mongoDbUri = require('./config.js').localUri

mongoose.connect(mongoDbUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then((data) => {
    console.log("connected to mongodb : " + mongoDbUri)
}).catch((err) => {
    console.log(err);
})

const port = 5000

app.listen(port, () => {
    console.log("listening to " + port);
})