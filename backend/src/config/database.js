const mongoose = require("mongoose")
const tokenBlacklistModel = require("../models/blacklist.model")

async function connectToDB(){
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to database")

    // Ensure indexes exist for fast auth middleware lookups.
    // (Safe in dev; one-time cost.)
    await tokenBlacklistModel.syncIndexes()
    }
    catch (err) {
        console.log(err)
    }

}

module.exports = connectToDB