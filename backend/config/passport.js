require("dotenv").config();
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { userArr } = require("../db/users");

const accessToken = process.env.ACCESS_TOKEN_SECRET;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: accessToken,
};

const strategy = new jwtStrategy(options, (payload, done) => {
  const user = userArr.find((user) => user.id === payload.sub);
  try {
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  passport.use(strategy);
};
