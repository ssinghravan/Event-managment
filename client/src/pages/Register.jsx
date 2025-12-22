import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Lock, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidPhone, isRequired, checkPasswordStrength } from '../utils/validators';
import API_BASE_URL from '../config/api';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState('register'); // 'register' or 'otp'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'volunteer'
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({ strength: 'none', score: 0 });

    const validate = () => {
        const newErrors = {};

        if (!isRequired(formData.name)) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!isRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!isRequired(formData.phone)) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!isRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isRequired(formData.confirmPassword)) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true
        });
        return Object.keys(newErrors).length === 0;
    };

    // Handle field blur for validation
    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    // Handle form data change with real-time validation
    const handleFieldChange = (field, value) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);

        // Update password strength in real-time
        if (field === 'password') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
        }

        // Real-time validation for touched fields
        if (touched[field]) {
            const newErrors = { ...errors };

            switch (field) {
                case 'name':
                    if (!isRequired(value)) {
                        newErrors.name = 'Name is required';
                    } else if (value.trim().length < 2) {
                        newErrors.name = 'Name must be at least 2 characters';
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
                case 'phone':
                    if (!isRequired(value)) {
                        newErrors.phone = 'Phone number is required';
                    } else if (!isValidPhone(value)) {
                        newErrors.phone = 'Please enter a valid phone number';
                    } else {
                        delete newErrors.phone;
                    }
                    break;
                case 'password':
                    if (!isRequired(value)) {
                        newErrors.password = 'Password is required';
                    } else if (value.length < 6) {
                        newErrors.password = 'Password must be at least 6 characters';
                    } else {
                        delete newErrors.password;
                    }
                    // Also check confirmPassword if it's been touched
                    if (touched.confirmPassword && newFormData.confirmPassword) {
                        if (value !== newFormData.confirmPassword) {
                            newErrors.confirmPassword = 'Passwords do not match';
                        } else {
                            delete newErrors.confirmPassword;
                        }
                    }
                    break;
                case 'confirmPassword':
                    if (!isRequired(value)) {
                        newErrors.confirmPassword = 'Please confirm your password';
                    } else if (value !== newFormData.password) {
                        newErrors.confirmPassword = 'Passwords do not match';
                    } else {
                        delete newErrors.confirmPassword;
                    }
                    break;
                default:
                    break;
            }

            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});

        if (step === 'register') {
            if (!validate()) return;

            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                        role: formData.role
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                setStep('otp');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            // Verify OTP
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        otp
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed');
                }

                // Check if user requires admin approval
                if (data.requiresApproval) {
                    alert(data.message || 'Your admin request is pending approval. Please wait for an existing admin to approve your request.');
                    navigate('/login');
                    return;
                }

                // User is verified and approved, log them in
                login(data.user, data.token);
                navigate('/');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

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
                        <h2 className="text-2xl font-bold text-white">
                            {step === 'register' ? 'Create Account' : 'Verify Email'}
                        </h2>
                        <p className="text-gray-200">
                            {step === 'register' ? 'Join our community of changemakers' : `Enter the code sent to ${formData.phone || formData.email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 'register' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            onBlur={() => handleBlur('name')}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.name && touched.name ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && touched.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">I want to join as a...</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'volunteer' })}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.role === 'volunteer'
                                                ? 'bg-pink-500/20 border-pink-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <Heart className={`w-6 h-6 ${formData.role === 'volunteer' ? 'text-pink-400' : 'text-gray-400'}`} />
                                            <span className="font-medium">Volunteer</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.role === 'admin'
                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <ShieldCheck className={`w-6 h-6 ${formData.role === 'admin' ? 'text-purple-400' : 'text-gray-400'}`} />
                                            <span className="font-medium">Admin</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.email && touched.email ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && touched.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            onBlur={() => handleBlur('phone')}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.phone && touched.phone ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    {errors.phone && touched.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleFieldChange('password', e.target.value)}
                                            onBlur={() => handleBlur('password')}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.password && touched.password ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {formData.password && passwordStrength.strength !== 'none' && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${passwordStrength.strength === 'weak' ? 'bg-red-500 w-1/3' :
                                                            passwordStrength.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                                                                'bg-green-500 w-full'
                                                            }`}
                                                    />
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.strength === 'weak' ? 'text-red-400' :
                                                    passwordStrength.strength === 'medium' ? 'text-yellow-400' :
                                                        'text-green-400'
                                                    }`}>
                                                    {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {errors.password && touched.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                                            onBlur={() => handleBlur('confirmPassword')}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">Verification Code</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all tracking-widest text-center text-xl font-bold"
                                        placeholder="123456"
                                        maxLength="6"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Check your server console for the simulation code.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : step === 'register' ? (
                                <>Sign Up <ArrowRight className="w-5 h-5" /></>
                            ) : (
                                <>Verify & Login <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    {step === 'register' && (
                        <div className="mt-6 text-center text-sm text-gray-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-pink-300 font-bold hover:text-white hover:underline">
                                Sign in
                            </Link>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="mt-6 text-center text-sm text-gray-300">
                            <button
                                onClick={() => setStep('register')}
                                className="text-pink-300 font-bold hover:text-white hover:underline"
                            >
                                Back to Registration
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
