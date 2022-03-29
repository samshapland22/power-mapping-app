require("dotenv").config();
const express = require("express");
const users = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../helpers/authentication");

//REPLACE WITH DB LATER
const { userArr } = require("../db/users");
let { refreshTokens } = require("../db/refreshTokens");
let { nextId } = require("../db/nextId");

users.get("/", (req, res) => {
  res.json(users);
});

//CREATE NEW USER
users.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      password: hashedPassword,
      id: nextId,
    };
    nextId++;
    console.log(nextId);
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    userArr.push(user);
    res.status(201).json({
      success: true,
      user: user,
      accessToken: accessToken.token,
      accessTokenExpires: accessToken.expires,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

//CREATE REFRESH TOKEN
users.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  //replace with Sequelize query later
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

//EXISTING USER LOGIN
users.post("/login", async (req, res) => {
  //replace with DB and Sequelize query later
  const user = userArr.find((user) => user.username === req.body.username);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "could not find user" });
  }
  try {
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isValidPassword) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({
        success: true,
        user: user,
        accessToken: accessToken.token,
        accessTokenExpires: accessToken.expires,
        refreshToken: refreshToken,
      });
    } else {
      res.status(401).json({ success: false, message: "incorrect password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//EXISTING USER LOGOUT
users.delete("/logout", (req, res) => {
  //replace with Sequelize query later
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

module.exports = users;
