const express = require('express');
const router = express.Router();

const {protect, authorize} = require("../middleware/auth");
const {updateConfig, getConfig} = require('../controllers/config');

router.route("/").get(protect, authorize('admin'), getConfig).put(protect, authorize('admin'), updateConfig);

module.exports = router;

