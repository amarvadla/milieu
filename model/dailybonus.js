const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const dailyBonus = new Schema({

    consecutiveDays: {
        type: Number
    },
    recentDate: {
        type: Date
    },
    userId: {
        type: Schema.Types.ObjectId
    }

}, { versionKey: false, collection: 'dailyBonus' })

const dailyBonusModel = mongoose.model('dailyBonus', dailyBonus)
module.exports = dailyBonusModel