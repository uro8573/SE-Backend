const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Config = require('../models/Config');
dotenv.config({ path: './config/config.env' });

const deleteOldNotifications = async () => {

  const data = await Config.findOne();
  
  const days = data.noti_period;

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const result = await Notification.deleteMany({ createdAt: { $lt: cutoff } });
    console.log(`✅ Deleted ${result.deletedCount} notifications older than ${days} days.`);
  } catch (err) {
    console.error("❌ Error deleting old notifications:", err);
  }
};

module.exports = deleteOldNotifications;
