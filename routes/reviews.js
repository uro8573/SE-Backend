const express = require('express')
const router = express.Router();
const {getReviews, getReview, addReview, updateReview, deleteReview} = require("../controllers/reviews");
const {protect, authorize} = require("../middleware/auth");

router.route("/").get(protect, getReviews).post(protect, addReview);
router.route("/:id").get(protect, getReview).put(protect, authorize('admin'), updateReview).delete(protect, authorize('admin'), deleteReview);

module.export = router;