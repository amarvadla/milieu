const mongoose = require('mongoose')
const Schema = mongoose.Schema

const unlock = new Schema({

    coins: {
        type: Number
    },
    userId: {
        type: Schema.Types.ObjectId
    },
    visits: {
        type: Number
    }

}, { versionKey: false, collection: 'unlock' })

const unlockModel = mongoose.model('unlock', unlock)
module.exports = unlockModel