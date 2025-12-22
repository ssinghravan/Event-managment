import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckSquare, Activity, ShieldCheck, Check, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingAdmins, setPendingAdmins] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPendingAdmins = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/auth/admin/pending`, {
                    headers: { 'x-auth-token': token }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPendingAdmins(data.pendingAdmins || []);
                }
            } catch (error) {
                console.error('Error fetching pending admins:', error);
            }
        };

        fetchStats();
        fetchPendingAdmins();
    }, []);

    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/approve/${userId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setPendingAdmins(pendingAdmins.filter(admin => admin.id !== userId));
                alert('Admin approved successfully!');
            }
        } catch (error) {
            console.error('Error approving admin:', error);
        }
    };

    const handleReject = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/reject/${userId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setPendingAdmins(pendingAdmins.filter(admin => admin.id !== userId));
                alert('Admin request rejected. User downgraded to volunteer.');
            }
        } catch (error) {
            console.error('Error rejecting admin:', error);
        }
    };

    if (loading) return <div className="pt-24 text-center">Loading dashboard...</div>;
    if (!stats) return <div className="pt-24 text-center">Error loading stats.</div>;

    const chartData = [
        { name: 'Users', count: stats.totalUsers },
        { name: 'Events', count: stats.totalEvents },
        { name: 'Volunteers', count: stats.totalVolunteers },
        { name: 'Tasks', count: stats.totalTasks },
    ];

    return (
        <div className="pt-20 min-h-screen pb-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
                    <p className="text-gray-200">Welcome back, {user?.name}. Here's what's happening.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard icon={Users} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                    <StatsCard icon={Calendar} title="Total Events" value={stats.totalEvents} color="bg-purple-500" />
                    <StatsCard icon={Activity} title="Volunteers" value={stats.totalVolunteers} color="bg-green-500" />
                    <StatsCard icon={CheckSquare} title="Tasks" value={stats.totalTasks} color="bg-orange-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Platform Overview</h3>
                        <div style={{ width: '100%', height: '320px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-800 font-medium">{activity.text}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pending Admin Approvals */}
                {pendingAdmins.length > 0 && (
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-purple-500" />
                            Pending Admin Approvals ({pendingAdmins.length})
                        </h3>
                        <div className="space-y-4">
                            {pendingAdmins.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-800">{admin.name}</p>
                                        <p className="text-sm text-gray-600">{admin.email}</p>
                                        {admin.phone && <p className="text-xs text-gray-500">{admin.phone}</p>}
                                        <p className="text-xs text-gray-400 mt-1">
                                            Requested: {new Date(admin.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(admin.id)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(admin.id)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4"
    >
        <div className={`p-4 rounded-xl text-white ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </motion.div>
);

export default AdminDashboard;
