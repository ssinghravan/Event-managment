import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Tag, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [volunteering, setVolunteering] = useState(false);
    const [isVolunteered, setIsVolunteered] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/events/${id}`);
                if (!response.ok) throw new Error('Event not found');
                const data = await response.json();
                setEvent(data);

                // Check if user is already volunteered
                // Note: data.volunteers might be array of IDs or objects depending on populate
                if (user && data.volunteers) {
                    const userId = user.id || user._id;
                    const hasVolunteered = data.volunteers.some(v =>
                        (typeof v === 'string' ? v : v._id) === userId
                    );
                    setIsVolunteered(hasVolunteered);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user]);

    const handleVolunteer = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setVolunteering(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:5000/api/volunteers/${id}/join`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setIsVolunteered(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setVolunteering(false);
        }
    };

    if (loading) return <div className="pt-24 text-center text-white">Loading...</div>;
    if (error) return <div className="pt-24 text-center text-red-400">{error}</div>;
    if (!event) return null;

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-700 pb-12">
            <div className="container mx-auto px-4">
                <Link to="/events" className="inline-flex items-center gap-2 text-pink-300 hover:text-white mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="h-64 md:h-96 relative">
                        <img
                            src={event.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=2000'}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-primary">
                            {event.category}
                        </div>
                    </div>

                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">{event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Calendar className="w-5 h-5 text-pink-400" />
                                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-pink-400" />
                                    <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="w-5 h-5 text-pink-400" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Tag className="w-5 h-5 text-pink-400" />
                                    <span>Category: {event.category}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <User className="w-5 h-5 text-pink-400" />
                                    <span>Organizer: {event.organizer || 'Helping Hands Team'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none mb-8">
                            <h3 className="text-xl font-bold mb-4 text-white">About this Event</h3>
                            <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {user ? (
                                <button
                                    onClick={handleVolunteer}
                                    disabled={volunteering || isVolunteered}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-colors shadow-lg ${isVolunteered
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/50 cursor-default shadow-none'
                                        : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                                        }`}
                                >
                                    {volunteering ? 'Processing...' : isVolunteered ? 'You have volunteered!' : 'Volunteer Now'}
                                </button>
                            ) : (
                                <Link to="/login" className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg text-center">
                                    Login to Volunteer
                                </Link>
                            )}
                            <button className="flex-1 py-3 border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
                                Share Event
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
