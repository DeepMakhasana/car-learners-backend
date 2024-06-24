const bcrypt = require("bcryptjs");
const saltRounds = 10;

function encryptPassword(password) {
  var salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

function decryptPassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
  encryptPassword,
  decryptPassword,
};
