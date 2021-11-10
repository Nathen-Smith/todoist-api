// Load required packages
var mongoose = require("mongoose");

// Define our user schema
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pendingTasks: [String],
  dateCreated: Date,
});

// Export the Mongoose model
module.exports.User = mongoose.model("User", UserSchema);
