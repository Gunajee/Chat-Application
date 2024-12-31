const mongodb = require("mongodb");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String, // Correctly specify the type here
      required: true,
    },
    users: Array, // If `users` is an array of specific types, you might want to define that.
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Messages", messageSchema);
