const mongoose = require("mongoose")
const tokenBlacklistModel = require("../models/blacklist.model")

async function connectToDB(){
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to database")
    }
    catch (err) {
        console.log(err)
    }

}

module.exports = connectToDB
