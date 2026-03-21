const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 *  @name registerUserController
 *  @description Register a anew user, expects username , email and password in the request body
 *  @access Public
 */
async function registerUserController(req,res){ 
    const { username , email , password } = req.body
    if (!username || !email || !password ){
        return res.status(400).json({
            message: "please provide username, email or password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username },{ email }]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "user already exists "
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message: "user registered sucessfully",
        user: {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

/**
 *  @name loginUserController
 *  @description login a user, expects email and password in the request body
 *  @access Public
 */
async function loginUserController(req,res){
    const { email, password} = req.body

    const user = await userModel.findOne({email})

    if (!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
 
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(200).json({
        message:"user logged in sucessfully",
        user:{
            id : user._id,
            username : user.username,
            email: user.email
        }
    })
}

/**
 *  @route GET /api/auth/logout
 *  @description clear token from user cookie and add user in the blacklist
 *  @access Public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")
 
    res.status(200).json({
        message: "user logged out sucessfully"
    })
}

/**
 *  @name getMeController
 *  @description get the current logged in user detail
 *  @access private
 */

async function getMeController(req,res){
    // Select only fields needed by the frontend (avoid pulling password/hash).
    const user = await userModel.findById(req.user.id).select("username email")

    res.status(200).json({
        message: "user detail fetched sucessfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController, loginUserController, logoutUserController, getMeController
}