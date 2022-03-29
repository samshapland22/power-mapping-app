const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const _id = user.id;
  const expiresIn = "60m";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

module.exports = {
  generateAccessToken,
};
