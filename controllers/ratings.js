const Hotel = require('../models/Hotel');

//@desc         Add hotel rating
//@route        POST /api/v1/hotels/:hotelId/rating
//@access       Private
exports.addRating=async(req,res,next)=>{
    try {
        const hotel = await Hotel.findOne({id: req.params.hotelId});

        if(!hotel || !req.body.rating) {
            return res.status(400).json({success:false});
        }

        const currentRating = hotel.ratingSum;
        const currentUserVotes = hotel.userRatingCount;
        
        await Hotel.updateOne(hotel, {
            ratingSum: currentRating + req.body.rating,
            userRatingCount: currentUserVotes + 1,
        });

        res.status(200).json({success:true, data: hotel});
    } catch(err) {
        console.error(err);
        res.status(400).json({success: false});
    }
}

//@desc         Update hotel rating
//@route        PUT /api/v1/hotels/:hotelId/rating
//@access       Private
exports.updateRating = async(req,res,next)=>{
    try {
        const hotel = await Hotel.findOne({id: req.params.hotelId});

        if(!hotel || !req.body.ratingSum || !req.body.userRatingCount) {
            return res.status(400).json({
                success:false,
                message: `Bad gateway due to missing some body or hotel id can't be found.`
            });
        }
        
        await Hotel.updateOne(hotel, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({success:true, data: hotel});
    } catch(err) {
        res.status(400).json({success: false});
    }
}