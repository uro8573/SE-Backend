const express = require("express");
const {getMe} = require("../controllers/user");

const router = express.Router();

const {protect} = require("../middleware/auth");

router.get('/', protect, getMe);

module.exports = router;