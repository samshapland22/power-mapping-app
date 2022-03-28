require("dotenv").config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport")(passport);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json("welcome to local politics helper app");
});

app.use(require("./routes"));

app.get("*", (req, res) => {
  res.status(404).send("Page not found.");
});

module.exports = app;
