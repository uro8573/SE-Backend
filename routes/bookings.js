const express = require("express");
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking,
    confirmBooking, 
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getBookings).post(protect, addBooking);
router
    .route("/:id")
    .get(protect, getBooking)
    .put(protect, updateBooking)
    .delete(protect, deleteBooking);


router.route("/confirm/:bookingId/:token").get(confirmBooking);

module.exports = router;