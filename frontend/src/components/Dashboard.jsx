import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      setStats(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="bg-black/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/Dashboard')}
              className="px-4 py-2 rounded-lg transition-colors bg-white text-black"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/tasklist')}
              className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              Task List
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto p-6">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Tasks Card */}
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Total Tasks</h3>
              <p className="text-3xl">{stats.totalTasks}</p>
            </div>

            {/* Completion Status Card */}
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Completion Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{stats.percentCompleted.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${stats.percentCompleted}%` }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{stats.percentPending.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-600 h-2.5 rounded-full"
                    style={{ width: `${stats.percentPending}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Time Stats Card */}
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Time Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Time Elapsed</span>
                  <span>{stats.timeLapsed.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Time</span>
                  <span>{stats.balanceTime.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Completion</span>
                  <span>{stats.averageCompletionTime.toFixed(1)} hrs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Dashboard;