const express = require("express");
const posts = express.Router();
const passport = require("passport");
const { postsArr } = require("../db/posts.js");

const { authenticateToken } = require("../helpers/authenticateToken");

posts.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res
    .status(200)
    .json(postsArr.filter((post) => post.username === req.user.username));
});

module.exports = posts;
