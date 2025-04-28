const Review = require ('../models/Review');
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Load env vars
dotenv.config({path:"./config/config.env"});

// @desc     Get reviews for each hotel along with related info
// @route    GET /api/v1/hotels/:hotelId/reviews
// @access   Public
exports.getReviews = async (req, res, next) => {
    let query;
    
    if (req.params.hotelId) {

        const find_hotel_by_id = await Hotel.findOne({id: req.params.hotelId});

        if(!find_hotel_by_id) {
            return res.status(404).json({
                success: false,
                message: `Can't find hotel with specify id ${req.params.hotelId}`
            });
        }

        query = Review.find({ hotel: find_hotel_by_id._id }).populate({
            path: 'hotel',
            select: 'name'
        }).populate({
            path: 'user',
            select: '_id name' // Populate user details
        });
    } else {

        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorize to access this route"
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch(err) {
            console.log(err.stack);
            return res.status(401).json({
                success: false,
                message: "Not authorize to access this route"
            });
        }

        if (req.user.role !== "admin") {
            query = Review.find({user : req.user.id}).populate({
                path: 'hotel',
                select: 'name address tel'
            }).populate({
                path: 'user',
                select: 'name email'
            });
        } else {    
            query = Review.find().populate({
                path: 'hotel',
                select: 'name address tel'
            }).populate({
                path: 'user',
                select: 'name email'
            });
        }
    }

    try {
        const reviews = await query;

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Reviews"
        });
    }
}

// @desc     Get current reviews from userId
// @route    GET /api/v1/user/:userId/reviews
// @access   Public
exports.userReview = async (req, res, next) => {

    try {

        const reviews = await Review.find({ user: req.params.userId });

        if(!reviews) {
            return res.status(404).json({
                success: false,
                message: `Can't find review from user id: ${req.params.userId}.`
            });
        }

        // Check if the user is authorized to view this review
        if (reviews.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this review`
            });
        }
        
        res.status(200).json({
            success: true,
            count: reviews.count,
            data: reviews
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: `Can't get user review.`
        })
    }

}
// @desc     Get a single review for a hotel along with relatable info
// @route    GET /api/v1/reviews/:reviewId
// @access   Public

exports.getReview = async (req, res, next) => {

    try {
        const review = await Review.findById(req.params.id)
            .populate({
                path: 'hotel',
                select: 'name description tel address' // Populate hotel details
            })
            .populate({
                path: 'user',
                select: 'name email' // Populate user details
            });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`
            });
        }

        // Check if the user is authorized to view this review
        if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this review`
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Review"
        });
    }
}

//@desc     Add Review
//@route    POST /api/v1/hotels/:hotelId/reviews
//@access   Private

exports.addReview = async (req, res, next) => {
    try {

        console.log(req.body);

        if(!req.params.hotelId) {
            return res.status(400).json({
                success: false,
                message: `Must specify hotelId in params before sending request to this route.`
            });
        }

        
        const hotel = await Hotel.findOne({id: req.params.hotelId});
        
        if(!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`
            });
        }

        req.body.hotel = hotel._id;

        // Check if user can be able to review or not.

        // Check by user booking date.
        const booking = await Booking.findOne({
            user: req.user.id,
            hotel: req.body.hotel,
            checkOutDate: { $lt: new Date() }
        });

        if (!booking) {
            return res.status(403).json({
                success: false,
                message: "You must have completed a stay at this hotel before leaving a review."
            });
        }

        // Check by user already review or not.
        const userReview = await Review.findOne({
            user: req.user.id,
            hotel: req.body.hotel
        });

        if (userReview) {
            return res.status(403).json({
                sucesss: false,
                message: "You have already reviewed this hotel."
            })
        }

        // add user id to req.body
        req.body.user = req.user.id;

        const review = await Review.create(req.body);
        res.status(201).json({
            success: true,
            data: review
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Review"
        });
    }
}

//@desc     Update Reviews
//@route    PUT /api/v1/reviews/:id
//@access   Private
exports.updateReview = async (req, res, next) => {
    try {
        let reviews = await Review.findById(req.params.id);

        if(!reviews) {
            return res.status(404).json({
                success: false,
                message: `No reviews with the id of ${req.params.id}`
            });
        }

        // Make sure user is the reviews owner

        if(reviews.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reviews`
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: review
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Review"
        });
    }
}

//@desc     Delete reviews
//@route    DELETE /api/v1/reviews/:id
//@access   Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if(!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`
            });
        }

        // Make sure user is the review owner
        if(review.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this review`
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Review"
        });
    }
}
