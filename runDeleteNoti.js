const mongoose = require("mongoose");
const connectDB = require("./config/db");
const deleteOldNotifications = require("./utils/autoDeleteNotifications");

const days = process.argv[2] ? parseInt(process.argv[2]) : 30; // admin can pass custom days

const run = async () => {
  await connectDB();
  await deleteOldNotifications(days);
  mongoose.connection.close();
};

run();
