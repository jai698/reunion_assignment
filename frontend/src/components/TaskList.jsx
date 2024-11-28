import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    priority: '',
    status: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    priority: 1,
    taskStatus: 'pending'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: 'startTime',
    direction: 'asc'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task/getTasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success('Task created successfully');
      setNewTask({
        title: '',
        startTime: '',
        endTime: '',
        priority: 'low',
        status: 'pending'
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}task/updateTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success('Task updated successfully');
      setShowEditModal(false);
      setIsEditing(false);
      setEditingId(null);
      resetTask();
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetTask = () => {
    setNewTask({
      title: '',
      startTime: '',
      endTime: '',
      priority: 'low',
      taskStatus: 'pending'
    });
  };

  const EditModal = () => {
    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTask(editingId);
          }}>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                  className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                  required
                />
                <input
                  type="datetime-local"
                  value={newTask.endTime}
                  onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                  className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                  required
                />
              </div>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
                className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value={1}>Very Low Priority</option>
                <option value={2}>Low Priority</option>
                <option value={3}>Medium Priority</option>
                <option value={4}>High Priority</option>
                <option value={5}>Very High Priority</option>
              </select>
              <select
                value={newTask.taskStatus}
                onChange={(e) => setNewTask({ ...newTask, taskStatus: e.target.value })}
                className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  resetTask();
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const aValue = new Date(a[sortConfig.field]).getTime();
      const bValue = new Date(b[sortConfig.field]).getTime();
      
      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority === Number(filters.priority)
      );
    }

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => 
        task.taskStatus === filters.status
      );
    }

    return sortTasks(filteredTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar - matching Dashboard */}
      <nav className="bg-black/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/Dashboard')}
              className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              Dashboard
            </button>
            <button
              className="px-4 py-2 rounded-lg transition-colors bg-white text-black"
            >
              Task List
            </button>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/signin');
            }}
            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
          >
            <option value="">All Priorities</option>
            <option value="1">Priority 1 (Very Low)</option>
            <option value="2">Priority 2 (Low)</option>
            <option value="3">Priority 3 (Medium)</option>
            <option value="4">Priority 4 (High)</option>
            <option value="5">Priority 5 (Very High)</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
          <select
            value={`${sortConfig.field}-${sortConfig.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortConfig({ field, direction });
            }}
            className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
          >
            <option value="startTime-asc">Start Time (Earliest First)</option>
            <option value="startTime-desc">Start Time (Latest First)</option>
            <option value="endTime-asc">End Time (Earliest First)</option>
            <option value="endTime-desc">End Time (Latest First)</option>
          </select>
        </div>

        {/* Create/Edit Task Form */}
        <form onSubmit={isEditing ? () => handleUpdateTask(editingId) : handleCreateTask} 
              className="mb-8 bg-black/30 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              required
            />
            <input
              type="datetime-local"
              value={newTask.startTime}
              onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
              className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              required
            />
            <input
              type="datetime-local"
              value={newTask.endTime}
              onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
              className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              required
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="px-4 py-2 bg-black/30 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
            >
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium"
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="grid gap-4">
          {getFilteredAndSortedTasks().map((task) => (
            <div key={task._id} 
                 className="bg-black/30 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {new Date(task.startTime).toLocaleString()} - {new Date(task.endTime).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority >= 4 ? 'bg-red-500/20 text-red-400' :
                      task.priority === 3 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      Priority {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.taskStatus === 'finished' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {task.taskStatus}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingId(task._id);
                      setNewTask({
                        title: task.title,
                        startTime: new Date(task.startTime).toISOString().slice(0, 16),
                        endTime: new Date(task.endTime).toISOString().slice(0, 16),
                        priority: task.priority,
                        taskStatus: task.taskStatus
                      });
                      setShowEditModal(true);
                    }}
                    className="px-3 py-1 text-sm border border-blue-400/50 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-3 py-1 text-sm border border-red-400/50 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer theme="dark" />
      <EditModal />
    </div>
  );
};

export default TaskList;