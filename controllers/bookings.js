const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const sendEmail = require("./email");
const crypto = require("crypto");

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async(req, res, next) => {
    let query;
    // General users can see only their bookings
    if(req.user.role !== 'admin') {
        query = Booking.find({user: req.user.id}).populate({
            path: 'hotel',
            select: 'name description tel id picture'
        });
    } else {
        if(req.params.hotelId) {
            console.log(req.params.hotelId);
            query = Booking.find({ hotel: req.params.hotelId }).populate({
                path: 'hotel',
                select: 'name description tel id picture'
            });
        } else {
            query = Booking.find().populate({
                path: 'hotel',
                select: 'name description tel id picture'
            });
        }
    }
    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
}

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'hotel',
            select: 'name description tel id picture'
        });

        if(!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        if(booking.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this booking`
            });
        }
     
        res.status(200).json({
            success: true,
            data: booking
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
}

//@desc     Add booking
//@route    POST /api/v1/hotels/:hotelId/booking
//@access   Private
exports.addBooking = async (req, res, next) => {
    try {
        const hotel = await Hotel.findOne({ id: req.params.hotelId });

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`,
            });
        }

        req.body.hotel = hotel._id;
        req.body.user = req.user.id;

        const { checkInDate, checkOutDate } = req.body;
        const bookingDateDiff = new Date(checkOutDate) - new Date(checkInDate);

        if (bookingDateDiff > 259200000) {
            return res.status(400).json({
                success: false,
                message: `User must book less than or equal to 3 nights.`,
            });
        }

        const booking = await Booking.create(req.body);

        // สร้างโทเค็นสำหรับยืนยันการจอง
        const confirmationToken = crypto.randomBytes(20).toString("hex");
        booking.confirmationToken = confirmationToken;
        await booking.save();

        // สร้างลิงก์สำหรับยืนยันการจอง
        const confirmationUrl = `${req.protocol}://${req.get("host")}/api/v1/bookings/confirm/${booking._id}/${confirmationToken}`;

        const message = `กรุณากดยืนยันการจองของคุณโดยคลิกที่ลิงก์ด้านล่าง:\n\n<a href="${confirmationUrl}">ยืนยันการจอง</a>`;

        try {
            await sendEmail.sendBookingConfirmation(req.user.email, confirmationUrl);

            res.status(201).json({
                success: true,
                message: "ระบบได้ส่งอีเมลยืนยันการจองไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลและคลิกลิงก์เพื่อยืนยัน",
                data: booking,
            });
        } catch (err) {
            console.error("Error sending email:", err);
            // หากส่งอีเมลไม่สำเร็จ อาจจะต้องลบ booking ที่สร้างไปแล้ว
            await Booking.findByIdAndDelete(booking._id);
            return res.status(400).json({
                success: false,
                message: "ไม่สามารถส่งอีเมลยืนยันการจองได้ กรุณาลองใหม่อีกครั้ง",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Booking",
        });
    }
};

//@desc     Update Booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        // Make sure user is the booking owner

        if(booking.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`
            });
        }

        // Make sure user is not update booking date more than 3 nights
        const { checkInDate, checkOutDate } = req.body;
        const bookingDateDiff = new Date(checkOutDate) - new Date(checkInDate);
        console.log(bookingDateDiff);
        if(bookingDateDiff > 259200000) {
            return res.status(400).json({
                success: false,
                message: `User must book less or equal than 3 nights.`
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
}

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        // Make sure user is the booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Booking"
        });
    }
}



exports.confirmBooking = async (req, res, next) => {
    try {
        const { bookingId, token } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลการจองนี้",
            });
        }

        // ตรวจสอบว่าโทเค็นตรงกันหรือไม่
        if (booking.confirmationToken !== token) {
            return res.status(400).json({
                success: false,
                message: "ลิงก์ยืนยันไม่ถูกต้องหรือไม่ถูกต้อง",
            });
        }

        // อัปเดตสถานะการจอง (สมมติว่ามีฟิลด์ 'isConfirmed' ใน Booking Model)
        booking.isConfirmed = true;
        booking.confirmationToken = undefined; // ลบโทเค็นหลังจากใช้งานแล้ว
        await booking.save();

        res.status(200).json({
            success: true,
            message: "การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว!",
        });

        // หรือจะ redirect ไปยังหน้าสำเร็จบน frontend
        // res.redirect('/booking/confirmation/success');
    } catch (error) {
        console.error("Error confirming booking:", error);
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการยืนยันการจอง",
        });
    }
};
