const Config = require("../models/Config");

//@desc     Change Config with specify body
//@route    PUT /api/v1/config
//@access   Private
exports.updateConfig = async (req, res, next) => {
    try {
        
        let config = await Config.findOne();
        
        config = await Config.findOneAndUpdate(config, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: config
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Cannot update config with error ${err}.`
        });
    }
}