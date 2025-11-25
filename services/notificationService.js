const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Notification = require("../models/notificationModel");
const io = require("../server"); // import Socket.IO instance

// @desc create notification
// @access public user admin manager
const createNotification = async (data) => {
  const notification = await Notification.create(data);

  // Emit real-time notification to all connected clients
  io.emit("new-notification", {
    id: notification._id,
    title: notification.title,
    user: notification.user,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    time: notification.createdAt, // frontend can convert to "x minutes ago"
  });

  return notification;
};

// @desc get all notification by user id
// @route GET api/v1/notifications
// @access user admin manager
const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({
      createdAt: -1,
    })
    .lean();
  console.log(notifications);

  res.status(200).json({
    status: "success",
    data: notifications,
  });
});

// @desc delete specific notification
// @route DELETE api/v1/notifications/:id
// @access user admin manager
const deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndDelete({ _id: id });

  if (!notification) {
    return next(new ApiError(`No notification with this id ${id}`, 404));
  }

  res.status(204).send();
});

// @desc delete all notifications
// @route DELETE api/v1/notifications
// @access user admin manager
const deleteNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({});
  res.status(204).send();
});

// Export all functions
module.exports = {
  createNotification,
  getNotifications,
  deleteNotification,
  deleteNotifications,
};
