const Notification = require('../models/Notification');


//@desc     Get all notifications
//@route    GET /api/v1/notifications
//@access   Public

exports.getNotifications = async (req, res, next) => {
    let query;

    if(req.user.role !== 'admin') {
        query = Notification.find({user : req.user.id})
    } else {
        query = Notification.find()
    }

    try {
        const noti = await query

        res.status(200).json({
            success: true,
            count: noti.length,
            data: noti
        });
    } catch (err) {
        console.error("Cannot find Notification" , err);
        return res.status(500).json({
            success: false,
            message: "Cannot find Notification"
        });
    }
}


//@desc     Get single notifications
//@route    GET /api/v1/notifications/:id
//@access   Public

exports.getNotification = async (req, res, next) => {
    try {
            const noti = await Notification.findById(req.params.id)

            if (!noti) {
                return res.status(404).json({
                    success : false,
                    msg : `can't find notification with ${req.params.id}`
                })
            }

            if (noti.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({
                    success : false,
                    msg : `User ${req.user.id} is not authorized to view this notification`
                })
            }

            res.status(200).json({
                success: true,
                data: noti
            });
    
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Cannot find Notification"
            });
        }
}

//@desc     Add notification
//@route    POST /api/v1/notifications
//@access   Private

exports.addNotification = async (req, res, next) => {
    
    if (req.user.role !== 'admin') {
        return res.status(401).json({
            success : false,
            msg : `User ${req.user.role} is not authorize to use add notification`
        })
    }

    if(!req.body.user) req.body.user = req.user.id;

    try {

        const noti = await Notification.create(req.body);
        res.status(201).json({
            success : true,
            data: noti
        })

    } catch (err) {
        console.error('Cannot create notification' , err);
        res.status(500).json({
            success:'false',
            msg:'Cannot Create notification'
        })
    }
}


//@desc     Delete notification
//@route    DELETE /api/v1/notifications/:id
//@access   Private

exports.deleteNotification = async (req, res, next) => {
    try {
        const noti = await Notification.findById(req.params.id);

        if (!noti) {
            return res.status(404).json({
                success: false,
                msg : `Cannot find notification with id ${req.params.id}`
            })
        }

        if (req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                msg : `User ${req.user.id} is not authorize to delete review`
            })
        }

        await noti.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {

        console.error(err);
        res.status('Cannot delete notification');
    }
}

//@desc     Update notification
//@route    PUT /api/v1/notifications/:id
//@access   Private
exports.updateNotification = async (req , res ,next) => {
    try{
        let noti = await Notification.findById(req.params.id);
        if(!noti){
            return res.status(404).json({
                success: false,
                message: `No notification with the id of ${req.params.id}`
            });
        }

        const isRead = req.body.isRead ? false : req.body.isRead; // Check body isRead is valid.

        if(req.user.role !== 'admin') req.body = { isRead }

        noti = await Notification.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: noti
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update notification"
        });
}
}