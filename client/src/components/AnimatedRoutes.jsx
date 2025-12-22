import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/CreateEvent';
import Volunteers from '../pages/Volunteers';
import TaskDashboard from '../pages/TaskDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Profile from '../pages/Profile';

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <PageTransition>
                        <Home />
                    </PageTransition>
                } />
                <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                <Route path="/events/:id" element={<PageTransition><EventDetails /></PageTransition>} />
                <Route path="/create-event" element={<PageTransition><CreateEvent /></PageTransition>} />
                <Route path="/volunteers" element={<PageTransition><Volunteers /></PageTransition>} />
                <Route path="/tasks" element={<PageTransition><TaskDashboard /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
