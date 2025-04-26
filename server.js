const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const cors = require('cors');

const { CronJob } = require("cron");
const deleteOldNotifications = require('./utils/autoDeleteNotifications');

// Route files
const hotels = require("./routes/hotels");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const user = require("./routes/user");
const reviews = require("./routes/reviews")
const notification = require("./routes/notification")

const app = express();
app.use(express.json());

// Set security headers
app.use(helmet());

// Sanitize date
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollutions
app.use(hpp());

// Prevent request that not from origin
app.use(cors({
    origin: "*",
    credentials : false
}));

// Rate Limiting
const limiter = rateLimit({
    windowsMs: 10*60*1000, // 10 minutes
    max: 1000
});
app.use(limiter);

//Load env vars
dotenv.config({path:"./config/config.env"});

//Connect to database
connectDB();

//Cookie Parser
app.use(cookieParser());


app.use("/api/v1/hotels", hotels);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/user", user);
app.use("/api/v1/notifications", notification);

// ------ Swagger ------ //

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "TungTee888 API Library",
            version: '1.0',
            description: 'Simple Express TungTee888 API'
        }
    },
    apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/* -------------------- */

app.get("/", (req, res) => {
    res.status(200).json({success: true, data:{id:1}});
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.HOST}:${PORT}`);
});

/* Cron Job */

new CronJob("* * * * *", () => {
    deleteOldNotifications();
}, null, true);

/* -------- */

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});
