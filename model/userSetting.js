const mongoose = require('mongoose')
const Schema = mongoose.Schema

var freindsListSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    blocked: {
        type: Boolean,
        default: false
    }
})

var userSetting = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    profileType: {
        type: Boolean,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    intrests: [String],
    postingPrivacy: {
        type: Boolean,
        default: true
    },
    freindsList: [freindsListSchema]
}, { versionKey: false, collection: "userSetting" })

const userSettingModel = mongoose.model("userSetting", userSetting)
module.exports = userSettingModel