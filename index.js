// to import express
const express = require("express")
const postData = require("./data/posts")

// we need to have a app variable to setput the express server
const app = express()


app.get('/posts', (req, res) => {
    res.json({ message: "success", data: postData.postArr })
})

// the app variable will therfore listen to the specified port
app.listen(5000)