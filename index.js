// enable dotenv
require("dotenv").config()

// to import express
const express = require("express")
const jwt = require("jsonwebtoken")
const postData = require("./data/posts")


// we need to have a app variable to setput the express server
const app = express()
let accessTokenArr = [];
let refreshTokenArr = []
// this will allow us to convert the chunks into json objects which are being fetch from the payload -> body while an API request
app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
    res.json({ message: "success", data: postData.postArr })
})


app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    accessTokenArr.push(accessToken);
    refreshTokenArr.push(refreshToken)
    res.json({ message: "success", data: { accessToken, refreshToken } })
})

app.delete("/logout", (req, res) => {
    if (accessTokenArr.includes(req.body.accessToken)) accessTokenArr.filter((uniqueToken) => uniqueToken !== req.body.accessToken)
    if (refreshTokenArr.includes(req.body.refreshToken)) refreshTokenArr.filter((uniqueToken) => uniqueToken !== req.body.refreshToken)
    res.sendStatus(204)
})
app.post("/token/refresh", (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null || !refreshTokenArr.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        // forbidden
        if (err) return res.sendStatus("403")
        const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' })
        accessTokenArr.push(accessToken);
        res.json({ message: "success", data: { accessToken, refreshToken } })
    })
})


// middleware
function authenticateToken(req, res, next) {

    // the token will be in form if "BEARER ACCESS_TOKEN"
    const authToken = req.headers['authorization'];

    const token = authToken && authToken.split(" ")[1]
    if (token === null || !accessTokenArr.includes(token)) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // forbidden
        if (err) {
            if (accessTokenArr.includes(token)) accessTokenArr.filter((uniqueToken) => uniqueToken !== token)
            return res.sendStatus("403")
        }
        // not res, it will be a added to the payload which was passed by the api call
        req.user = user;

        // perforn the next functionality
        next()
    })
}

// the app variable will therfore listen to the specified port
app.listen(5000)