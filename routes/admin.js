const { Router } = require('express')
const express = require('express')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config")
const adminMiddleware = require('../middleware/admin')
const { Admin, Course, User } = require("../db/index")
const router = Router()

router.use(express.json())

// Admin routes

// create a new admin
router.post('/signup', async (req, res) => {
    const { username, password } = req.body

    // check if a user with this username already exist
    const adminExists = await Admin.findOne({username})
    if (adminExists) {
        return res.status(403).json({msg: "Username already exists"})
    }

    await Admin.create({username, password})

    console.log("Admin created successfully!")
    res.json({msg: "Admin created successfully"});
})

// Logs in an admin account and returns jwt token
router.post('/signin', async (req, res) => {
    const { username, password } = req.body

    const admin = await User.findOne({username, password})

    if (!admin) {
        return res.status(403).json("Invalid username or password")
    }

    const jwtToken = jwt.sign({username}, JWT_SECRET)

    res.json({jwtToken})
})

// create a new course
router.post('/courses', adminMiddleware, async (req, res) => {
    const { title, description, price, imageLink } = req.body

    // check if the course already exists
    const courseExists = await Course.findOne({title})

    if (courseExists) {
        return res.status(403).json({msg: `Course ${title} already exists`})
    }

    const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink,
        isPublished: true
    })

    console.log(newCourse);

    res.json({
        message: "Course created successsfully",
        courseId: newCourse._id
    })
})

// Returns all the courses
router.get('/courses',adminMiddleware, async (req, res) => {
    const courses = await Course.find().select("-__v")

    res.json({courses})
})

module.exports = router