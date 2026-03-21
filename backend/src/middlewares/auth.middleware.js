const jwt = require("jsonwebtoken")
const tokenBlacklistedModel = require("../models/blacklist.model.js")

async function authUser(req,res,next){

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }

    const isTokenBlackisted = await tokenBlacklistedModel
        .findOne({ token })
        .lean()

    if(isTokenBlackisted) {
        return res.status(401).json({
            messgae: "token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    }catch(err){
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = { authUser }