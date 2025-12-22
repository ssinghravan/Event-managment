import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const filteredEvents = filter === 'All'
        ? events
        : events.filter(event => event.category === filter);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/events`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="pt-20 min-h-screen pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-white">Upcoming Events</h1>
                        <p className="text-gray-200">Discover opportunities to make a difference</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 [&>option]:text-gray-900"
                        >
                            <option value="All">All Categories</option>
                            <option value="Community">Community</option>
                            <option value="Environment">Environment</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                            <option value="Animals">Animals</option>
                        </select>
                        {user && (
                            <Link
                                to="/create-event"
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                            >
                                <Plus className="w-4 h-4" /> Create Event
                            </Link>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-white">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                        <p className="text-gray-200 mb-4">No events found.</p>
                        {user && (
                            <Link to="/create-event" className="text-pink-300 font-bold hover:text-white hover:underline transition-colors">
                                Create the first event!
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event, index) => (
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
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

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

export default Events;
