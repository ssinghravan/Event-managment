import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:5000/api/tasks/my-tasks', {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    const handleStatusUpdate = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    if (loading) return <div className="pt-24 text-center text-white">Loading tasks...</div>;

    return (
        <div className="pt-20 min-h-screen pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-white">My Tasks</h1>

                {tasks.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center">
                        <p className="text-gray-200">No tasks assigned to you yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task, index) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-2xl border-l-4 ${task.status === 'Completed' ? 'border-l-green-500' : 'border-l-yellow-500'
                                    } flex items-center justify-between hover:bg-white/15 transition-colors`}
                            >
                                <div>
                                    <h3 className={`font-bold text-lg text-white ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {task.event?.title || 'General Task'}
                                        </span>
                                        {task.dueDate && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStatusUpdate(task._id, task.status)}
                                    className={`p-2 rounded-full transition-colors ${task.status === 'Completed'
                                        ? 'text-green-400 hover:bg-green-500/20'
                                        : 'text-gray-400 hover:text-green-400 hover:bg-green-500/20'
                                        }`}
                                >
                                    {task.status === 'Completed' ? <CheckCircle className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDashboard;
