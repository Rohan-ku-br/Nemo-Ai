const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const bcrypt = require('bcryptjs')

async function registerUser(req, res){
    const {username:{firstName, lastName}, email, password} = req.body

    const isUserAlreadyExist = await userModel.findOne({ email })

    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"username already exist! change username."
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username:{ firstName, lastName},
        email,
        password:hashPassword
    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({
        message:"user register successfully!",
        user:{
            email:user.email,
            _id: user. _id,
            fullName:user.fullName
        }
    })
}


async function loginUser(req, res){
    const {email, password} = req.body;

    isEmailExist = await userModel.findOne({email})

    if(!isEmailExist){
        return res.status(401).json({
            message:"envalid email or password!"
        })
    }

    const isPassword = await bcrypt.compare(password, user.password)

    if(!isPassword){
        return res.status(401).json({message:"Invalid Password "})
    }

    const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({message:"user login successfully!",
        user:{
             email:user.email,
            _id: user. _id,
            fullName:user.fullName
        }
    })
}



module.exports = {
    registerUser,
    loginUser
}