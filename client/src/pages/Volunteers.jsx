import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Users, Mail, Phone, CheckCircle, XCircle, Search, Filter, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import fetchWithRetry from '../utils/fetchWithRetry';

const Volunteers = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');

                if (isAdmin) {
                    // Fetch all volunteers for admin
                    const response = await fetchWithRetry(`${API_BASE_URL}/api/volunteers/all`, {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    const data = await response.json();
                    setVolunteers(data);
                } else {
                    // Fetch user's events for regular users
                    const response = await fetchWithRetry(`${API_BASE_URL}/api/volunteers/my-events`, {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, isAdmin]);

    // Filter and search volunteers
    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(volunteer => {
            const matchesSearch = volunteer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                volunteer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                volunteer.phone?.includes(searchQuery);
            const matchesRole = roleFilter === 'all' || volunteer.role === roleFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'verified' && volunteer.isVerified) ||
                (statusFilter === 'pending' && !volunteer.isVerified);
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [volunteers, searchQuery, roleFilter, statusFilter]);

    // Get role badge styling
    const getRoleBadge = (role) => {
        const badges = {
            admin: { color: 'from-red-500 to-pink-500', text: 'Admin', icon: Shield },
            volunteer: { color: 'from-blue-500 to-cyan-500', text: 'Volunteer', icon: UserCheck },
            coordinator: { color: 'from-purple-500 to-violet-500', text: 'Coordinator', icon: Users }
        };
        return badges[role] || badges.volunteer;
    };

    if (!user) {
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4 text-white">Volunteer Dashboard</h1>
                    <p className="text-gray-200 mb-8">Please login to view your upcoming volunteer activities.</p>
                    <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg inline-block">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    // Admin View - Show all volunteers
    if (isAdmin) {
        return (
            <div className="pt-20 min-h-screen pb-12">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-pink-400" />
                            All Users
                        </h1>
                        <p className="text-gray-200">Manage and view all registered users in the system.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-white">Loading users...</div>
                    ) : volunteers.length === 0 ? (
                        <div className="text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                            <p className="text-gray-200">No users registered yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Search and Filter Bar */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                                    />
                                </div>

                                {/* Role Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="all" className="bg-gray-800">All Roles</option>
                                        <option value="volunteer" className="bg-gray-800">Volunteers</option>
                                        <option value="coordinator" className="bg-gray-800">Coordinators</option>
                                        <option value="admin" className="bg-gray-800">Admins</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="all" className="bg-gray-800">All Status</option>
                                        <option value="verified" className="bg-gray-800">Verified</option>
                                        <option value="pending" className="bg-gray-800">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/20">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Phone</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {filteredVolunteers.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                                        No users found matching your filters.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredVolunteers.map((volunteer, index) => {
                                                    const roleBadge = getRoleBadge(volunteer.role);
                                                    const RoleIcon = roleBadge.icon;
                                                    return (
                                                        <motion.tr
                                                            key={volunteer._id || index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="hover:bg-white/5 transition-colors"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-3">
                                                                    {volunteer.image ? (
                                                                        <img src={volunteer.image} alt={volunteer.name} className="w-10 h-10 rounded-full object-cover" />
                                                                    ) : (
                                                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleBadge.color} flex items-center justify-center text-white font-bold`}>
                                                                            {volunteer.name?.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-white font-medium">{volunteer.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 text-gray-300">
                                                                    <Mail className="w-4 h-4 text-pink-400" />
                                                                    <span>{volunteer.email}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 text-gray-300">
                                                                    <Phone className="w-4 h-4 text-pink-400" />
                                                                    <span>{volunteer.phone || 'N/A'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${roleBadge.color} text-white`}>
                                                                    <RoleIcon className="w-3 h-3" />
                                                                    {roleBadge.text}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {volunteer.isVerified ? (
                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Verified
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                                                        <XCircle className="w-3 h-3" />
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                                                                {new Date(volunteer.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 bg-white/5 border-t border-white/20 flex justify-between items-center">
                                    <p className="text-gray-300 text-sm">
                                        Showing <span className="font-bold text-white">{filteredVolunteers.length}</span> of <span className="font-bold text-white">{volunteers.length}</span> users
                                    </p>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-gray-400">
                                            Verified: <span className="text-green-300 font-bold">{volunteers.filter(v => v.isVerified).length}</span>
                                        </span>
                                        <span className="text-gray-400">
                                            Pending: <span className="text-yellow-300 font-bold">{volunteers.filter(v => !v.isVerified).length}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Regular User View - Show their volunteered events
    return (
        <div className="pt-20 min-h-screen pb-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">My Volunteer Activities</h1>
                    <p className="text-gray-200">Track your upcoming events and impact.</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-white">Loading...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                        <p className="text-gray-200 mb-4">You haven't signed up for any events yet.</p>
                        <Link to="/events" className="text-pink-300 font-bold hover:text-white hover:underline transition-colors">
                            Browse Upcoming Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-pink-500/20 transition-all group"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={event.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800'}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-pink-300 transition-colors">{event.title}</h3>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Calendar className="w-4 h-4 text-pink-400" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <MapPin className="w-4 h-4 text-pink-400" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="inline-flex items-center gap-2 text-pink-300 font-bold hover:text-white hover:gap-3 transition-all"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Volunteers;
