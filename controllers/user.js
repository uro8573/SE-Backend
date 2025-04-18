const User = require("../models/User");

//@desc     Get current Logged in user
//@route    GET /user
//@access   Public
exports.getMe = async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
}