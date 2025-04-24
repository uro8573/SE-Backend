const express = require("express");
const { getNotifications, getNotification, addNotification, deleteNotification, updateNotification, cleanupNotifications } = require('../controllers/notification');
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, addNotification)
router.route('/:id').get(protect, getNotification).delete(protect, deleteNotification).put(protect, updateNotification)
router.route('/cleanup/:id').delete(protect, cleanupNotifications)

module.exports = router;