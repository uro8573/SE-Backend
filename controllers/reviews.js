const Review = require ('../models/Review');
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// @desc     Get reviews for each hotel along with related info
// @route    GET /api/v1/hotels/:hotelId/reviews
// @access   Public
exports.getReviews = async (req, res, next) => {
    let query;
    
    if (req.params.hotelId) {
        query = Review.find({ hotel: req.params.hotelId }).populate({
            path: 'hotel',
            select: 'name address tel'
        }).populate({
            path: 'user',
            select: 'name email' // Populate user details
        });
    } else {
        query = Review.find().populate({
            path: 'hotel',
            select: 'name address tel'
        }).populate({
            path: 'user',
            select: 'name email' // Populate user details
        });
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
        const review = await Review.findById(req.params.reviewId)
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
                message: `No review with the id of ${req.params.reviewId}`
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
//@route    POST /api/v1/reviews
//@access   Private

exports.addReview = async (req, res, next) => {
    try {

        if(!req.body.hotel) {
            return res.status(400).json({
                success: false,
                message: `Must specify hotelId in body before sending request to this route.`
            });
        }

        const hotel = await Hotel.findById(req.body.hotel);

        if(!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.body.hotel}`
            });
        }

        const booking = await Booking.findOne({
            user: req.user.id,
            hotel: req.body.hotel,
            checkOutDate: { $lt: new Date() }
        })

        if (!booking) {
            return res.status(403).json({
                success: false,
                message: "You must have completed a stay at this hotel before leaving a review."
            });
        }

        // add user id to req.body
        req.body.user = req.user.id;

        const review = await Review.create(req.body);
        res.status(200).json({
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