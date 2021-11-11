// Load required packages
var mongoose = require("mongoose");

// Define our user schema
var TaskSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    deadline: Date,
    completed: Boolean,
    assignedUser: { type: String, default: "" },
    assignedUserName: { type: String, default: "unassigned" },
    dateCreated: Date,
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: false } }
);

// Export the Mongoose model
module.exports.Task = mongoose.model("Task", TaskSchema);
