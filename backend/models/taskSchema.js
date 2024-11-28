const mongoose = require("mongoose");
const User = require("./UserSchema");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    priority: {//should be 1-5 
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    taskStatus: {
        type: String,
        enum: ["pending", "finished"],
        default: "pending",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Task", taskSchema);

