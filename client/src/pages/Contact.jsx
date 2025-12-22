import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { isValidEmail, isRequired } from '../utils/validators';
import API_BASE_URL from '../config/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for touched fields
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (name) => {
        setTouched({ ...touched, [name]: true });
        validateField(name, formData[name]);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'name':
                if (!isRequired(value)) {
                    newErrors.name = 'Name is required';
                } else if (value.trim().length < 2) {
                    newErrors.name = 'Name must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    newErrors.name = 'Name must be less than 50 characters';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'email':
                if (!isRequired(value)) {
                    newErrors.email = 'Email is required';
                } else if (!isValidEmail(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'message':
                if (!isRequired(value)) {
                    newErrors.message = 'Message is required';
                } else if (value.trim().length < 10) {
                    newErrors.message = 'Message must be at least 10 characters';
                } else {
                    delete newErrors.message;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const fields = ['name', 'email', 'message'];
        fields.forEach(field => validateField(field, formData[field]));

        setTouched({
            name: true,
            email: true,
            message: true
        });

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                // Reset form
                setFormData({ name: '', email: '', message: '' });
                setErrors({});
                setTouched({});

                // Hide success message after 5 seconds
                setTimeout(() => setSuccess(false), 5000);
            } else {
                // Handle server error
                alert(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-white">Get in Touch</h1>
                        <p className="text-gray-200">We'd love to hear from you. Send us a message!</p>
                    </div>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg flex items-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6" />
                            <span>Thank you! Your message has been sent successfully.</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Email</p>
                                        <p className="font-medium text-white">bob1977singh@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Phone</p>
                                        <p className="font-medium text-white">+91 9038334810</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Address</p>
                                        <a
                                            href="https://www.google.com/maps/place/Helping+Hands/@22.542556,88.382824,13z/data=!4m6!3m5!1s0x3a0277e27db50691:0xcfb17f30da50c04c!8m2!3d22.542556!4d88.3828245!16s%2Fg%2F11fd4lnq0d?hl=en-US&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-white hover:text-pink-400 transition-colors"
                                        >
                                            7A Mahendra Roy Lane, Gobinda Khatick Rd, Topsia, Kolkata, West Bengal 700046, India
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.name && touched.name ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none`}
                                    placeholder="Your name"
                                />
                                {errors.name && touched.name && (
                                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.email && touched.email ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && touched.email && (
                                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('message')}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.message && touched.message ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none`}
                                    placeholder="How can we help?"
                                />
                                {errors.message && touched.message && (
                                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-700'
                                    }`}
                            >
                                {submitting ? 'Sending...' : (
                                    <>
                                        Send Message <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
