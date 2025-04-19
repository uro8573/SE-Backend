const express = require("express");
const {getMe} = require("../controllers/user");

const router = express.Router();

const {protect} = require("../middleware/auth");

// Include other resource routers
const { userReview } = require('../controllers/reviews');

// Re route into other resource routers
router.use("/:userId/reviews", userReview);

router.get('/', protect, getMe);

module.exports = router;