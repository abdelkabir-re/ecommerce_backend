const express = require("express");

const router = express.Router();

const {
  getNotifications,
  deleteNotification,
  deleteNotifications,
} = require("../services/notificationService");

const authRoute = require("../services/authService");

// Protect all routes and allow specific roles
router.use(authRoute.protect, authRoute.allowedTo("user", "admin", "manager"));

// Route for all notifications
router.route("/").get(getNotifications).delete(deleteNotifications);

// Route for a single notification by ID
router.route("/:id").delete(deleteNotification);

module.exports = router;
