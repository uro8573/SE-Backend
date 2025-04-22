//Load env vars
const dotenv = require('dotenv');
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