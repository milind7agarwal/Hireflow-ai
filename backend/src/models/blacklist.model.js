const mongoose = require("mongoose")


const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "token is required to be added in blacklist"]
    }
},{
        timestamps: true
})

// Ensure fast blacklist checks by token string.
blacklistTokenSchema.index({ token: 1 })

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel