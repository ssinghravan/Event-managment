import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="py-20 bg-transparent text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20" />
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Ready to Make a Difference?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-200"
                >
                    Join thousands of volunteers and organizations transforming communities today.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-4 justify-center"
                >
                    <Link to="/register" className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center">
                        Become a Volunteer
                    </Link>
                    <Link to="/create-event" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        Start an Event <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
