//Load env vars
const dotenv = require('dotenv');
const moment = require("moment");
dotenv.config({path:"./config/config.env"});

/* Email Service Provider */

const nodemailer = require('nodemailer');

let configOptions = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS
    }
}
const transporter = nodemailer.createTransport(configOptions);

/* ---------------------- */

exports.sendMail = async (sender, sendTo, subject, html) => {

    transporter.sendMail({
        sender: sender,
        to: sendTo,
        subject: subject,
        html: html
    }).then((res) => {
        console.log(res.response);
    }).catch(err => {
        console.error(err);
    });

}

exports.sendVerifyOTP = async (sendTo, otp) => {

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
    this.sendMail("TungTee888", sendTo, "[TungTee888] Your email verification code.", emailBody);
}