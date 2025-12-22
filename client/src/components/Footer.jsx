import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-bold group">
                            <div className="bg-white p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                                <img src="/logo.jpg" alt="Helping Hands Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span>Helping Hands</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Empowering communities through organized volunteering and efficient event management. Join us in making a difference today.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/helpinghandsngo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://x.com/bobsingh1977"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/helpinghand9943/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@HelpingHandsNews-z2z"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Upcoming Events', path: '/events' },
                                { name: 'Volunteer Opportunities', path: '/volunteers' },
                                { name: 'Contact Support', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary hover:pl-2 transition-all flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-400">
                                <MapPin className="w-6 h-6 text-primary shrink-0" />
                                <a
                                    href="https://www.google.com/maps/place/Helping+Hands/@22.542556,88.382824,13z/data=!4m6!3m5!1s0x3a0277e27db50691:0xcfb17f30da50c04c!8m2!3d22.542556!4d88.3828245!16s%2Fg%2F11fd4lnq0d?hl=en-US&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    7A Mahendra Roy Lane, Gobinda Khatick Rd<br />Topsia, Kolkata, West Bengal 700046, India
                                </a>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Mail className="w-6 h-6 text-primary shrink-0" />
                                <a href="mailto:bob1977singh@gmail.com" className="hover:text-white transition-colors">bob1977singh@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Phone className="w-6 h-6 text-primary shrink-0" />
                                <a href="tel:+919038334810" className="hover:text-white transition-colors">+91 9038334810</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">Subscribe to our newsletter for the latest updates and impact stories.</p>
                        <form className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 transition-all"
                                />
                            </div>
                            <button className="w-full py-3 bg-primary rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group">
                                Subscribe
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Helping Hands. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
