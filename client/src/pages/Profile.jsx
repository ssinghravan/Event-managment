import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Phone, Camera, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setPreview(user.image || '');
        }
    }, [user]);

    if (!user) {
        return (
            <div className="pt-24 text-center text-white">
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    const validate = () => {
        const newErrors = {};
        if (!name.trim() || name.length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (!phone.trim() || !/^\+?[\d\s-]{10,15}$/.test(phone)) newErrors.phone = 'Invalid phone number format';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large (max 5MB)');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                login(data.user, token);
                setIsEditing(false);
                setImage(null);
                setErrors({});
            } else {
                console.error('Server error:', data);
                alert(`Error: ${data.message || 'Failed to update profile'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen pb-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-4 ring-4 ring-white/20 overflow-hidden">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="w-full max-w-md space-y-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-300 mb-2">Click the avatar to upload a new photo</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none`}
                                            />
                                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none`}
                                                placeholder="+1 234 567 890"
                                            />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-center pt-4">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setName(user.name);
                                                setPhone(user.phone);
                                                setPreview(user.image);
                                                setImage(null);
                                                setErrors({});
                                            }}
                                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={loading}
                                            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                    <span className="px-3 py-1 mt-2 bg-white/20 rounded-full text-sm font-medium text-pink-200 capitalize border border-white/10">
                                        {user.role || 'Volunteer'}
                                    </span>
                                </>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-300">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Email Address</p>
                                            <p className="text-lg font-medium text-white">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-300">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Role</p>
                                            <p className="text-lg font-medium text-white capitalize">{user.role || 'Volunteer'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-500/20 rounded-lg text-green-300">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Phone Number</p>
                                            <p className="text-lg font-medium text-white">{user.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-pink-500/20 rounded-lg text-pink-300">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Member Since</p>
                                            <p className="text-lg font-medium text-white">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-medium transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
