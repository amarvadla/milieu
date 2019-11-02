const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answeredUsersSchema = new Schema({

    userId : {
        type : Schema.Types.ObjectId
    },
    createdDate : {
        type : Date,
        default : Date.now()
    }

})

const optionsSchema = new Schema({
    optionValue : {
        type : String,
        required : true
    },
    isCorrectOption : {
        type : Boolean
    },
    answeredUsers : [answeredUsersSchema]
})


const quizModel = new Schema({

    question : {
        type : String,
        required : true
    },
    options : [optionsSchema]

} , {versionKey : false , collection : 'quizSchema'})

const quizSchemaModel = mongoose.model('quizSchema', quizModel)
module.exports = quizSchemaModel