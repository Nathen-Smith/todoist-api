// Load required packages
var mongoose = require("mongoose");

// Define our user schema
var UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    pendingTasks: [String],
    dateCreated: Date,
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: false } }
);

// https://stackoverflow.com/questions/12669615/add-created-at-and-updated-at-fields-to-mongoose-schemas

// Export the Mongoose model
module.exports.User = mongoose.model("User", UserSchema);
