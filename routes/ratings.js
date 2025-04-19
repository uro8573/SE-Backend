const express = require('express');
const router = express.Router({ mergeParams: true });
const { addRating, updateRating } = require('../controllers/ratings');
const { protect, authorize } = require("../middleware/auth");

router.route("/").post(addRating, protect).put(updateRating, protect, authorize('admin'));

module.exports = router;