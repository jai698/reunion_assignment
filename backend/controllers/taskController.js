const Task = require("../models/taskSchema");

exports.getTasks = async (req, res) => {
    try {
        const { priority, status } = req.query;
        const filter = { userId: req.userId };
        if (priority) filter.priority = priority;
        if (status) filter.taskStatus = status;
        const tasks = await Task.find(filter).sort({ startTime: 1, endTime: 1 });
        console.log('User ID:', req.userId);
        console.log('Filter:', filter);
        console.log('Found tasks:', tasks);
        res.json(tasks);
    }catch (error) {
        console.error('Error in getTasks:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
      const { title, startTime, endTime, priority, status } = req.body;
      await Task.create({
        title:title,
        startTime:startTime,
        endTime:endTime,
        priority:priority,
        status:status,
        userId:req.userId
      });
      res.status(201).json({
        message:"Task created successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, startTime, endTime, priority, taskStatus } = req.body;
        
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.userId },
            {
                title,
                startTime,
                endTime,
                priority,
                taskStatus
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        res.json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(400).json({ message: error.message });
    }
};