const express = require('express')
const router = express.Router({mergeParams: true});
const {getReviews, getReview, addReview, updateReview, deleteReview} = require("../controllers/reviews");
const {protect, authorize} = require("../middleware/auth");

router.route("/").get(getReviews).post(protect, addReview);
router.route("/:id").get(getReview).put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
