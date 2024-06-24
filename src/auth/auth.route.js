const express = require("express");
const { register, login, verifyOTP } = require("./auth.controller");
const router = express.Router();

router.post("/register/:type", register);
router.post("/login/:type", login);
router.post("/verify/:type", verifyOTP);

module.exports = router;
