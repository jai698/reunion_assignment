const Task = require("../models/taskSchema");

exports.getStats = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.taskStatus === 'finished').length;
    const pendingTasks = totalTasks - completedTasks;

    const percentCompleted = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    const percentPending = totalTasks ? (pendingTasks / totalTasks) * 100 : 0;

    const timeStats = tasks.reduce((acc, task) => {
      const timeLapsed = task.taskStatus === 'pending' ? Math.max(0, (new Date() - task.startTime) / 3600000) : 0;
      const balanceTime = task.taskStatus === 'pending' ? Math.max(0, (task.endTime - new Date()) / 3600000) : 0;
      const actualTime = task.taskStatus === 'finished' ? (task.endTime - task.startTime) / 3600000 : 0;

      acc.timeLapsed += timeLapsed;
      acc.balanceTime += balanceTime;
      acc.actualTime += actualTime;
      acc.completedCount += task.taskStatus === 'finished' ? 1 : 0;

      return acc;
    }, { timeLapsed: 0, balanceTime: 0, actualTime: 0, completedCount: 0 });

    const averageCompletionTime = timeStats.completedCount ? timeStats.actualTime / timeStats.completedCount : 0;

    res.json({
      totalTasks,
      percentCompleted,
      percentPending,
      timeLapsed: timeStats.timeLapsed,
      balanceTime: timeStats.balanceTime,
      averageCompletionTime
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(400).json({ message: error.message });
  }
};