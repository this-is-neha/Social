// routing.config.js
const express = require("express");
const mainRoute = express.Router();
const authRouter = require('../modules/auth/auth.route')
const postRouter=require('../modules/Posts/posts.route')
mainRoute.get("/", (req, res) => {
    console.log("Welcome to the main route");

});
 mainRoute.use('/auth',authRouter)
 mainRoute.use('/post',postRouter)


module.exports = mainRoute;
