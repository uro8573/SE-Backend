const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can't be more than 50 characters"]
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
    },
    district: {
        type: String,
        required: [true, "Please add a district"]
    },
    province: {
        type: String,
        required: [true, "Please add a province"]
    },
    postalcode: {
        type: String,
        required: [true, "Please add a postal code"],
        maxlength: [5, "Postal code can't be more than 5 digits"]
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, "Please add a region"]
    },
    ratingSum: {
        type: Number,
        default: 0
    },
    userRatingCount: {
        type: Number,
        default: 0
    },
    dailyRate: {
        type: String,
        required: [true, "Please add a dailyRate"]
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

HotelSchema.plugin(AutoIncrement, {inc_field: 'id'});

// Reverse populate with virtuals
HotelSchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'hotel',
    justOne: false
});

module.exports = mongoose.model("Hotel", HotelSchema);