const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;

const createToken = (data) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  return jwt.sign(data, key);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
