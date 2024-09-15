const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

mongoose.connect("mongodb+srv://admin:Smile476245@cluster0.el80i.mongodb.net/course-selling-app")
.then(() => console.log("Connected to mongodb succesfully!"))
.catch(() => console.log("Fail to connect to mongodb!"))

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    isPublished: Boolean
})

const Admin = mongoose.model('admin', adminSchema)
const User = mongoose.model('user', userSchema)
const Course = mongoose.model('course', courseSchema)

module.exports = {
    Admin,
    User,
    Course
}