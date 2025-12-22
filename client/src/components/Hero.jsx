import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Image with Zoom Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/Yan17GBgrzT9bojZ/community-AoPWDJPr7LiGrrkB.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Floating Gradient Orbs */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-20 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                    Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Impact</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-200"
                >
                    Join the movement. Organize events, manage volunteers, and make a difference in your community with Helping Hands.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col md:flex-row gap-4 justify-center"
                >
                    <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                        Get Started
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>
                    </Link>
                    <Link to="/about" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full font-bold text-lg transition-all flex items-center justify-center hover:scale-105">
                        Learn More
                    </Link>
                </motion.div>
            </div>

            {/* Animated Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center text-white/60 cursor-pointer hover:text-white/90 transition-colors"
                >
                    <span className="text-sm mb-2">Scroll to explore</span>
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
