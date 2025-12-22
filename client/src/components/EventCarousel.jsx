import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const EventCarousel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/events');
                const data = await response.json();
                // Limit to first 3 events for home page
                setEvents(data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">Loading events...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Upcoming Events</h2>
                        <p className="text-gray-200">Join us in our upcoming initiatives.</p>
                    </div>
                    <Link to="/events" className="hidden md:flex items-center gap-2 text-pink-300 font-bold hover:text-white hover:gap-3 transition-all">
                        View All <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                        <p className="text-gray-200">No upcoming events at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-pink-500/20 transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800'}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                        {event.category}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-pink-400" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-pink-400" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-pink-300 transition-colors">{event.title}</h3>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="block w-full py-3 border border-white/30 rounded-xl font-medium text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:border-transparent transition-all text-center"
                                    >
                                        Volunteer Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link to="/events" className="inline-flex items-center gap-2 text-pink-300 font-bold hover:text-white">
                        View All Events <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventCarousel;
