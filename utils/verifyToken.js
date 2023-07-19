const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return jwt.verify(token, "anykey", (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
};

module.exports = verifyToken;
