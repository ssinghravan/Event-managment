import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Heart } from 'lucide-react';

const stats = [
    { id: 1, label: 'Events Organized', value: '150+', icon: Calendar, color: 'text-blue-500' },
    { id: 2, label: 'Volunteers Joined', value: '100+', icon: Users, color: 'text-green-500' },
    { id: 3, label: 'Lives Impacted', value: '250+', icon: Heart, color: 'text-red-500' },
];

const StatsSection = () => {
    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Impact at a Glance</h2>
                    <p className="text-gray-200 max-w-2xl mx-auto">
                        Together, we are making a tangible difference in communities across the globe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-pink-500/20 hover:shadow-2xl transition-all text-center"
                        >
                            <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold mb-2 text-white">{stat.value}</h3>
                            <p className="text-gray-200 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
