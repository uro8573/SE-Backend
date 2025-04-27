const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    noti_period: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Config", ConfigSchema);