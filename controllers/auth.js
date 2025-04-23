const User = require("../models/User");
const { sendVerifyOTP } = require('./email');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    try {
        const {name, email, password, role, tel} = req.body;

        /* Otp generator */

        const generateOTP = () => {
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < 6; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
        };

        const otp = generateOTP();

        
        /*-------------------------- */
        
        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            tel,
            verificationCode: otp,
        });
        await sendTokenResponse(user, 200, res);

        await sendVerifyOTP(email, otp);

    } catch(err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    } 
}

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    // Validate email & password
    if(!email || !password) {
        return res.status(400).json({success: false, msg:"Please provide an email and password"});
    }
    
    // Check for user
    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return res.status(400).json({success: false, msg: "Invalid credentials"});
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch) {
        return res.status(401).json({success: false, msg: "Invalid credentials"});
    }

    sendTokenResponse(user, 200, res);
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV==="production") {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
}

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
}

//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
}

//@desc     Verify OTP by user
//@route    GET /api/v1/auth/verify
//@access   Private
exports.verify = async(req, res, next) => {
    
    try {
    
        const user = await User.findById(req.user.id);
    
        if(user.isVerify) {
            return res.status(409).json({
                success: false,
                message: "This account is already verified."
            });
        }

        const { verificationCode } = req.body;

        if(!verificationCode) {
            return res.status(400).json({
                success: false,
                message: "You must send 'verificationCode' body into this route."
            });
        }

        if(verificationCode != user.verificationCode) {
            return res.status(403).json({
                success: false,
                message: "Your OTP code is wrong or invalid."
            });
        }

        await User.updateOne(user, {
            isVerify: true
        });

        res.status(200).json({
            success: true,
            message: "Verify Successful!"
        });

    } catch(err) {
        res.status(400).json({
            success: false
        });
        console.log(err.stack);
    }

}

//@desc     Re-sending OTP code to user
//@route    GET /api/v1/auth/re-verify
//@access   Private
exports.reVerify = async(req, res, next) => {

    try {
    
        const user = await User.findById(req.user.id);
    
        if(user.isVerify) {
            return res.status(409).json({
                success: false,
                message: "This account is already verified."
            });
        }

        /* Otp generator */

        const generateOTP = () => {
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < 6; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
        };

        const otp = generateOTP();

        
        /*-------------------------- */

        await User.updateOne(user, {
            verificationCode: otp
        });

        await sendVerifyOTP(user.email, otp);

        res.status(200).json({
            success: true,
            message: "Re-sending OTP Successful!"
        });

    } catch(err) {
        res.status(400).json({
            success: false
        });
        console.log(err.stack);
    }

}