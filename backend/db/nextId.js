const { userArr } = require("./users");

const nextId = userArr[userArr.length - 1].id + 1;
module.exports = { nextId };
