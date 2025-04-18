const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Route files
const hotels = require("./routes/hotels");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const user = require("./routes/user");

const app = express();
app.use(express.json());

//Load env vars
dotenv.config({path:"./config/config.env"});

//Connect to database
connectDB();

//Cookie Parser
app.use(cookieParser());

app.use(cors());

app.use("/api/v1/hotels", hotels);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);
app.use("/user", user);

app.get("/", (req, res) => {
    res.status(200).json({success: true, data:{id:1}});
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.HOST}:${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});
