const express = require('express')
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user")
const app = express()

app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use(express.json())

const PORT = 3000;

app.listen(PORT, () => {
    console.log("App is listening on port 3000!")
})