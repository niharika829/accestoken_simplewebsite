// enable dotenv
require("dotenv").config()

// to import express
const express = require("express")
const jwt = require("jsonwebtoken")
const postData = require("./data/posts")


// we need to have a app variable to setput the express server
const app = express()

// this will allow us to convert the chunks into json objects which are being fetch from the payload -> body while an API request
app.use(express.json())

app.get('/posts', (req, res) => {
    res.json({ message: "success", data: postData.postArr })
})


app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.json({ message: "success", data: accessToken })
})
// the app variable will therfore listen to the specified port
app.listen(5000)