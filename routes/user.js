const { Router } = require('express')
const express = require('express')
const jwt = require('jsonwebtoken')
const { USER_JWT_SECRET } = require('../config')
const userMiddleware = require("../middleware/user")
const { User, Course } = require("../db/index")
const router = Router();

router.use(express.json())

// User routes

// Creates a new user account
router.post('/signup', async (req, res) => {
    const { username, password } = req.body

    const userExists = await User.findOne({username})

    if (userExists) {
        return res.status(403).json({messge: `User ${username} already exists`})
    }

    await User.create({
        username,
        password
    })

    console.log("User created successfully")
    res.json({message: "User created successfully"})
})

// Logs in an admin account and return a jwt token
router.post('/signin', async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username, password})

    if (!user) {
        res.status(403).json({message: "Invalid username or password"})
    }

    try {
        const jwtToken = jwt.sign({username}, USER_JWT_SECRET)
        res.json({jwtToken})
    }
    catch(err) {
        console.log(err)
    }
})

// Lists all the courses
router.get('/courses', async (req, res) => {
    // courses which are not published can only be viewed by admins
    const courses = await Course.find({isPublished: true})

    res.json({courses})
})

// Purchases a course
router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId
    const username = req.username

    const updateConfirmed = await User.updateOne(
        {username},
        {
            $push: {purchasedCourses: courseId}
        }
    )
    
    if (updateConfirmed) {
        res.json({message: "Course purchased successfully"})
    }
})

// Lists all the courses purchased by the user
router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.username

    const user = await User.findOne({username})

    const purchasedCourses = await Course.find({
        _id: {
            $in: user.purchasedCourses
        }
    })

    console.log(purchasedCourses)

    res.json({purchasedCourses})
})

module.exports = router;