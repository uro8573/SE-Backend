const User = require("../models/User");
const { sendMail } = require('./email');
const moment = require("moment");

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

        const emailBody = `
            <div style="font-family: Arial, sans-serif; background: #ffffff; text-align: center; padding: 40px 20px; color: #000;">
                <div style="width: 100px; height: 100px; background: #ccc; border-radius: 50%; margin: 0 auto 20px auto;"></div>
                <div style="font-size: 20px; margin-bottom: 20px; font-weight: bold;">Your Signup Verification Code</div>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 20px;">${otp}</div>
                <div style="margin-top: 10px; font-size: 14px;">Don't share this code to anyone!</div>

                <div style="background: #f9f6e6; padding: 15px; border-radius: 10px; display: inline-block; text-align: left; margin: 20px 0;">
                    <div style="font-weight: bold;">⚠️ Didn't request this code yourself?</div>
                    <div>This code was generated from a device or browser on <b>${moment().format("DD/MM/YYYY")}</b>. If you did not initiate this request, you can safely <b>ignore this email.</b></div>
                </div>

                <div style="font-size: 12px; color: #555;">This is an automated message. <b>Please do not reply.</b></div>

                <div style="margin-top: 20px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="Google" style="width: 32px; height: 32px; margin: 0 10px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="width: 32px; height: 32px; margin: 0 10px;">
                    <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png" alt="Discord" style="width: 32px; height: 32px; margin: 0 10px;">
                </div>
            </div>
        `

        
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

        await sendMail("TungTee888", email, "[TungTee888] Your email verification code.", emailBody);

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