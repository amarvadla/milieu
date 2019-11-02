const router = require('express').Router()
const quizModel = require('../model/quizQuestions')
const userModel = require('../model/userProp')

router.post('/createQuestions', (req, res) => {

    var input = req.body

    userModel.findById(input.userId, (err, result) => {

        if (err) {
            res.send({
                statusCode: 0,
                statusMessage: 'wrong user Id'
            })
        } else if (result) {
            saveQuizQuestions(input).then((data) => {
                res.send(data)
            }).catch((e) => {
                res.send(e)
            })
        } else {
            res.send(result)
        }

    })

})

router.get('/question', (req, res) => {
    var input = req.query

    userModel.findById(input.userId, (err, result) => {

        if (err) {
            res.send({
                statusCode: 0,
                statusMessage: 'wrong user Id'
            })
        } else if (result) {

            quizModel.findById(input.questionId, (err, result) => {

                if (err) {

                    res.send({
                        statusCode: 0,
                        statusMessage: 'wrong question Id'
                    })

                } else if (result) {

                    var obj = {}
                    obj.id = obj._id
                    obj.question = result.question
                    var arr = []
                    result.options.forEach(element => {
                        let optObj = {}
                        optObj.optionValue = element.optionValue
                        optObj.isCorrectOption = element.isCorrectOption
                        optObj.answeredUsers = element.answeredUsers.length
                        optObj.isAnswered = false
                        if (element.answeredUsers.filter((elemnt) => elemnt.userId == input.userId).length > 0) {
                            optObj.isAnswered = true
                        }

                        arr.push(optObj)
                    });
                    obj.options = arr

                    res.send({
                        statusCode: 1,
                        statusMessage: 'success',
                        data: obj
                    })
                }


            })

        } else {
            res.send(result)
        }

    })
})

router.post('/answerQuiz', (req, res) => {

    var input = req.body

    userModel.findById(input.userId, (err, result) => {

        if (err) {
            res.send({
                statusCode: 0,
                statusMessage: 'wrong user Id'
            })
        } else if (result) {
            saveAnswers(input).then((data) => {
                res.send(data)
            }).catch((e) => {
                res.send(e)
            })
        } else {
            res.send(result)
        }

    })

})

function saveAnswers(input) {
    return new Promise((resolve, reject) => {

        quizModel.findById(input.id, (err, result) => {

            if (err) {
                res.send({
                    statusCode: 0,
                    statusMessage: 'wrong quiz id'
                })
            } else if (result) {
                for (let i = 0; i < result.options.length; i++) {
                    console.log(result.options[i].optionValue);

                    if (result.options[i].answeredUsers.filter((elemnt) => elemnt.userId == input.userId).length > 0) {
                        reject({
                            statusCode: 0,
                            statusMessage: 'user already participated'
                        })
                    }

                    if (result.options[i].optionValue == input.answeredOption) {
                        result.options[i].answeredUsers.push({ userId: input.userId })
                    }
                }

                result.save().then((data) => {
                    resolve(data)
                }).catch((e) => {
                    reject(e)
                })
            }

        })

    })
}

function saveQuizQuestions(input) {
    return new Promise((resolve, reject) => {

        var quiz = new quizModel()
        quiz.question = input.question
        quiz.options = input.options

        quiz.save().then((result) => {
            var obj = {}
            obj.id = obj._id
            obj.question = result.question
            var arr = []
            result.options.forEach(element => {
                let optObj = {}
                optObj.optionValue = element.optionValue
                optObj.isCorrectOption = element.isCorrectOption
                optObj.answeredUsers = element.answeredUsers.length

                arr.push(optObj)
            });
            obj.options = arr

            resolve(obj)
        }).catch((e) => {
            reject(e)
        })

    })
}

module.exports = router