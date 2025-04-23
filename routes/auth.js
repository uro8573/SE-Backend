const express = require("express");
const {register, login, getMe, logout, verify, reVerify} = require("../controllers/auth");

const router = express.Router();

const {protect} = require("../middleware/auth");

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/verify', protect, verify);
router.get('/re-verify', reVerify);

module.exports = router;