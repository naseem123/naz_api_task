const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
    text: {
        type: String,
        required: [true, "Please add a task"],
        unique: true
    },
    day: {
        type: Date,
        default: Date.now,
    },
    reminder: {
        type: Boolean,
        required: [true, "Please add a reminder"]
     }
    },
    {
        timestamps : true
    }
);

const Task = mongoose.model("Task", taskSchema, 'tasks');

module.exports = Task;
