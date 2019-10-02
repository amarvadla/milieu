const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentsLikesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

const commentsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    comment: {
        type: String,
        required: true
    },
    commentLikes: [commentsLikesSchema]
})

const likesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

const execludeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    postType: {
        type: String
    },
    sourceUrl: {
        type: String
    },
    comments: [commentsSchema],
    likes: [likesSchema],
    execludeUserIds: [execludeSchema]
},{versionKey:false, collection:'postSchema'})

const postSchemaModel = mongoose.model('postSchema', postSchema)
module.exports = postSchemaModel