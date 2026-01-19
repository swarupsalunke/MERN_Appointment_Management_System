const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

BASEURL = 'http://localhost:7006/uploads/'

const register = async (req, res) => {
    console.log(req.body)
    let { name, email, password, contactNumber, address } = req.body
    imagePath = req.file ? req.file.filename : null
    try {

        const existingUser = await User.findOne({ email: email })


        if (!existingUser) {
            console.log(password)
            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(req.body.password, salt)

            console.log("hashed password", password)
            const newUser = await User.create({ name, email, password, contactNumber, address, imagePath });

            await newUser.save()
            res.status(200).send({ msg: "Register successfully", success: true })
        }
        if (existingUser) {
            res.status(200).send({ msg: "User already exists", success: false })
        }
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}

const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    try {
        const loggedUser = await User.findOne({ email: email })
        console.log(loggedUser, "logged user")
        if (!loggedUser) {
           return res.status(400).send({ msg: "User not found", success: false })
        }
        if (await bcrypt.compare(password, loggedUser.password)) {
            const payload = { id: loggedUser.id, role: loggedUser.role }
            console.log(payload)
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' })
            console.log(token, "token in controller")
            return res.status(202).send({ msg: "Logged in succesfull", success: true, token: token })
        } else {
            res.status(400).send({ msg: "password incorrect!!!" })
        }

    } catch (error) {
        res.status(500).send({ msg: "server error" })
    }
};

const getUserInfo = async (req, res) => {
    try {
        const loggedUser = await User
            .findById(req.user.id)
            .select('-password')

        if (loggedUser.imagePath) {
            loggedUser.imagePath = BASEURL + loggedUser.imagePath
        }

        return res.status(200).send({
            user: loggedUser,
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ msg: "Image not provided" })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { imagePath: req.file.filename },
      { new: true }
    ).select('-password')

    // 👇 IMPORTANT: yahin URL bana do
    if (user.imagePath) {
      user.imagePath = BASEURL + user.imagePath
    }

    res.status(200).send({
      success: true,
      msg: "Profile image updated",
      user
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "server error" })
  }
}


const doctorList = async (req, res) => {
  try {
    const doctors = await User
      .find({ role: "Doctor" })
      .select("_id name email imagePath")

    res.status(200).send({
      success: true,
      doctors
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "server error" })
  }
}


const getAllUsers = async (req, res) => {
  try {
    const users = await User
      .find()
      .select('-password') 

    res.status(200).send({
      success: true,
      users
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "server error" })
  }
}



module.exports = { register, login, getUserInfo, doctorList, updateProfileImage, getAllUsers }

