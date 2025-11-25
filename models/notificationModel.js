const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["success", "info", "warning", "error"], // optional types
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "notification must be belong to user"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
