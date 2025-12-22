import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Volunteers', path: '/volunteers' },
        { name: 'Tasks', path: '/tasks' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-primary/95 backdrop-blur-md shadow-lg py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="bg-white p-2 rounded-xl shadow-md">
                            <img src="/logo.jpg" alt="Helping Hands Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight transition-colors animate-rgb-text">
                        Helping Hands
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative font-medium text-sm tracking-wide transition-colors animate-rgb-text ${isActive(link.path)
                                    ? 'font-bold'
                                    : ''
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`relative font-medium text-sm tracking-wide transition-colors animate-rgb-text ${isActive('/admin')
                                    ? 'font-bold'
                                    : ''
                                    }`}
                            >
                                Admin Dashboard
                                {isActive('/admin') && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                                    />
                                )}
                            </Link>
                        )}
                    </div>

                    <div className="pl-6 border-l border-gray-200/20">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center shadow-md ring-2 ring-white/20 overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="hidden lg:block animate-rgb-text">
                                        <p className="text-sm font-bold leading-none">{user.name}</p>
                                        <p className="text-xs capitalize">{user.role || 'Volunteer'}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all hover:scale-105"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg animate-rgb-text ${scrolled
                                    ? 'bg-white hover:bg-indigo-50 shadow-black/10'
                                    : 'bg-white hover:bg-gray-50 shadow-black/10'
                                    }`}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden relative z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X className="w-8 h-8 text-gray-900" />
                    ) : (
                        <Menu className="w-8 h-8 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-0 bg-white/95 backdrop-blur-md z-40 md:hidden flex flex-col pt-24 px-6 h-screen"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex items-center justify-between p-4 rounded-xl animate-rgb-text ${isActive(link.path) ? 'bg-primary/5 font-bold' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-lg font-bold">{link.name}</span>
                                        <ChevronRight className="w-5 h-5 opacity-50" />
                                    </motion.div>
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: navLinks.length * 0.1 }}
                                        className={`flex items-center justify-between p-4 rounded-xl animate-rgb-text ${isActive('/admin') ? 'bg-primary/5 font-bold' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-lg font-bold">Admin Dashboard</span>
                                        <ChevronRight className="w-5 h-5 opacity-50" />
                                    </motion.div>
                                </Link>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-auto mb-8 border-t pt-6"
                        >
                            {user ? (
                                <div className="space-y-4">
                                    <Link to="/profile" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(false)}>
                                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold overflow-hidden">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                                            <p className="text-gray-500">{user.email}</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 bg-white rounded-xl font-bold text-center shadow-lg shadow-indigo-200 animate-rgb-text"
                                >
                                    Login / Register
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
