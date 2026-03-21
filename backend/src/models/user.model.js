const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique:[true,"username is not available"],
        required: true
    },

    email:{
        type: String,
        unique: [true, "account already exist"],
        required: true
    },

    password:{
        type: String,
        required: true
    }
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel