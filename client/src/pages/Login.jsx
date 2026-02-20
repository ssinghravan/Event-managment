import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isRequired } from '../utils/validators';
import API_BASE_URL from '../config/api';
import fetchWithRetry from '../utils/fetchWithRetry';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validate individual field
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'email':
                if (!isRequired(value)) {
                    error = 'Email is required';
                } else if (!isValidEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!isRequired(value)) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            default:
                break;
        }

        return error;
    };

    // Handle field blur
    const handleBlur = (name) => {
        setTouched({ ...touched, [name]: true });
        const value = name === 'email' ? email : password;
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    // Handle email change
    const handleEmailChange = (value) => {
        setEmail(value);
        if (touched.email) {
            const error = validateField('email', value);
            setErrors({ ...errors, email: error });
        }
    };

    // Handle password change
    const handlePasswordChange = (value) => {
        setPassword(value);
        if (touched.password) {
            const error = validateField('password', value);
            setErrors({ ...errors, password: error });
        }
    };

    // Validate all fields
    const validateForm = () => {
        const emailError = validateField('email', email);
        const passwordError = validateField('password', password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        setTouched({
            email: true,
            password: true
        });

        return !emailError && !passwordError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Use AuthContext login
            login(data.user, data.token);

            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    // Check if form has errors
    const hasErrors = errors.email || errors.password;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
                            <div className="bg-white p-2 rounded-xl shadow-md">
                                <img src="/logo.jpg" alt="Helping Hands Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span>Helping Hands</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                        <p className="text-gray-200">Sign in to continue your journey</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.email && touched.email ? 'border-red-500' : 'border-white/10'
                                        } text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && touched.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.password && touched.password ? 'border-red-500' : 'border-white/10'
                                        } text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={hasErrors}
                            className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${hasErrors ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-700'
                                }`}
                        >
                            Sign In <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-300">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-white font-bold hover:text-pink-300 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
