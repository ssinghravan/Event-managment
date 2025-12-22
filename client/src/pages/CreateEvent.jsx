import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Image as ImageIcon, Type, AlignLeft, Upload, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidUrl, isRequired, isFutureDate, isDateInRange } from '../utils/validators';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [imageInputMethod, setImageInputMethod] = useState('url'); // 'url' or 'file'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Community',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for touched fields
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, image: 'Please select an image file' });
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Image size must be less than 5MB' });
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear image errors
            const newErrors = { ...errors };
            delete newErrors.image;
            setErrors(newErrors);
        }
    };

    const handleBlur = (name) => {
        setTouched({ ...touched, [name]: true });
        validateField(name, formData[name]);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'title':
                if (!isRequired(value)) {
                    newErrors.title = 'Title is required';
                } else if (value.trim().length < 5) {
                    newErrors.title = 'Title must be at least 5 characters';
                } else if (value.trim().length > 100) {
                    newErrors.title = 'Title must be less than 100 characters';
                } else {
                    delete newErrors.title;
                }
                break;
            case 'description':
                if (!isRequired(value)) {
                    newErrors.description = 'Description is required';
                } else if (value.trim().length < 20) {
                    newErrors.description = 'Description must be at least 20 characters';
                } else if (value.trim().length > 500) {
                    newErrors.description = 'Description must be less than 500 characters';
                } else {
                    delete newErrors.description;
                }
                break;
            case 'date':
                if (!isRequired(value)) {
                    newErrors.date = 'Date is required';
                } else if (!isFutureDate(value)) {
                    newErrors.date = 'Event date must be in the future';
                } else if (!isDateInRange(value)) {
                    newErrors.date = 'Event date must be within the next year';
                } else {
                    delete newErrors.date;
                }
                break;
            case 'location':
                if (!isRequired(value)) {
                    newErrors.location = 'Location is required';
                } else if (value.trim().length < 3) {
                    newErrors.location = 'Location must be at least 3 characters';
                } else {
                    delete newErrors.location;
                }
                break;
            case 'image':
                if (imageInputMethod === 'url' && value && !isValidUrl(value)) {
                    newErrors.image = 'Please enter a valid URL';
                } else {
                    delete newErrors.image;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const fields = ['title', 'description', 'date', 'location'];
        if (imageInputMethod === 'url') {
            fields.push('image');
        }

        fields.forEach(field => validateField(field, formData[field]));

        // Check for image
        if (imageInputMethod === 'file' && !imageFile) {
            setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        }

        setTouched({
            title: true,
            description: true,
            date: true,
            location: true,
            image: true
        });

        // Check if there are any errors
        const hasErrors = Object.keys(errors).length > 0;
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate form before submission
        if (!validateForm()) {
            setLoading(false);
            setError('Please fix all errors before submitting');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            let response;

            if (imageInputMethod === 'file' && imageFile) {
                // Use FormData for file upload
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('date', formData.date);
                formDataToSend.append('location', formData.location);
                formDataToSend.append('category', formData.category);
                formDataToSend.append('image', imageFile);

                response = await fetch('http://127.0.0.1:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formDataToSend
                });
            } else {
                // Use JSON for URL
                response = await fetch('http://127.0.0.1:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(formData)
                });
            }

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            navigate('/events');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p className="text-xl">Please login to create an event.</p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-700 pb-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8"
                >
                    <h1 className="text-3xl font-bold mb-8 text-white">Create New Event</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('title')}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.title && touched.title ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                    placeholder="e.g., Beach Cleanup Drive"
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                {errors.title && touched.title ? (
                                    <p className="text-red-400 text-xs">{errors.title}</p>
                                ) : (
                                    <p className="text-gray-400 text-xs">{formData.title.length}/100 characters</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('description')}
                                    rows="4"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.description && touched.description ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                    placeholder="Describe your event..."
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                {errors.description && touched.description ? (
                                    <p className="text-red-400 text-xs">{errors.description}</p>
                                ) : (
                                    <p className="text-gray-400 text-xs">{formData.description.length}/500 characters</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('date')}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.date && touched.date ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all [color-scheme:dark]`}
                                    />
                                </div>
                                {errors.date && touched.date && (
                                    <p className="text-red-400 text-xs mt-1">{errors.date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('location')}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.location && touched.location ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                        placeholder="e.g., Central Park"
                                    />
                                </div>
                                {errors.location && touched.location && (
                                    <p className="text-red-400 text-xs mt-1">{errors.location}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all [&>option]:text-gray-900"
                                >
                                    <option value="Community">Community</option>
                                    <option value="Environment">Environment</option>
                                    <option value="Education">Education</option>
                                    <option value="Health">Health</option>
                                    <option value="Animals">Animals</option>
                                </select>
                            </div>
                        </div>

                        {/* Image Input Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Event Image</label>

                            {/* Toggle between URL and File Upload */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageInputMethod('url');
                                        setImageFile(null);
                                        setImagePreview('');
                                    }}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${imageInputMethod === 'url'
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4 inline mr-2" />
                                    Image URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageInputMethod('file');
                                        setFormData({ ...formData, image: '' });
                                    }}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${imageInputMethod === 'file'
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    Upload File
                                </button>
                            </div>

                            {/* URL Input */}
                            {imageInputMethod === 'url' && (
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('image')}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.image && touched.image ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all`}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {errors.image && touched.image && (
                                        <p className="text-red-400 text-xs mt-1">{errors.image}</p>
                                    )}
                                </div>
                            )}

                            {/* File Upload Input */}
                            {imageInputMethod === 'file' && (
                                <div>
                                    <div className={`relative border-2 border-dashed ${errors.image && touched.image ? 'border-red-500' : 'border-white/20'} rounded-lg p-6 text-center hover:border-pink-500 transition-colors cursor-pointer`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-gray-300 mb-1">
                                            {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                    {errors.image && touched.image && (
                                        <p className="text-red-400 text-xs mt-1">{errors.image}</p>
                                    )}

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-gray-300 text-sm mb-2">Preview:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-white/20"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateEvent;
