const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }, 
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true
    },
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", ReviewSchema);