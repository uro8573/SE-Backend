const Review = require ('../models/Review');
const Hotel = require("../models/Hotel");

// @desc     Get reviews for each hotel along with related info
// @route    GET /api/v1/hotels/:hotelId/reviews
// @access   Public / Admin
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

// @desc     Get a single review for a hotel along with relatable info
// @route    GET /api/v1/hotels/:hotelId/review/:reviewId
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
//@route    POST /api/v1/hotels/:hotelId/review
//@access   Private


//อันนี้ไม่รู้ทำทำไม

exports.addReview = async (req, res, next) => {
    try {
        req.body.hotel = req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);
        if(!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`
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
//@route    PUT /api/v1/reviewss/:id
//@access   Private
exports.updateReview = async (req, res, next) => {
    try {
        let reviews = await Reviews.findById(req.params.id);

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