const express = require('express');
const router = express.Router();

const {protect, authorize} = require("../middleware/auth");
const {updateConfig} = require('../controllers/config');

router.route("/").put(protect, authorize('admin'), updateConfig);

module.exports = router;

