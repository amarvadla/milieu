const mongoose = require('mongoose')
const Schema = mongoose.Schema

let pagesSchema = new Schema({

    creatorId: {
        type: Schema.Types.ObjectId
    },
    createdTime: {
        type: Date,
        default: Date.now()
    },
    followers: [Schema.Types.ObjectId],
    blockedUsers: [Schema.Types.ObjectId],
    createdLocation: {
        type: [Number],
        index: '2d'
    }
}, { versionKey : false, collection : 'pages'})

let pagesModel = mongoose.model('pages' , pagesSchema)
module.exports = pagesModel