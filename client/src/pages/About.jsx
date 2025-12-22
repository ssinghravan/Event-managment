import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Heart, Users, Award, BookOpen, Palette, Scissors, Sparkles, Monitor, Globe } from 'lucide-react';

const About = () => {
    const courses = [
        {
            name: 'Stitching',
            icon: Scissors,
            description: 'Learn professional tailoring and garment making skills',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=550,fit=crop/Yan17GBgrzT9bojZ/img-20240322-wa0057-A1aPeqZqPvslpz5v.jpg'
        },
        {
            name: 'Mehendi',
            icon: Sparkles,
            description: 'Master the art of traditional henna designs',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=550,fit=crop/Yan17GBgrzT9bojZ/img-20240913-wa0056-mjE7zg6kX0i3VPyy.jpg'
        },
        {
            name: 'Beautician',
            icon: Sparkles,
            description: 'Professional beauty and grooming techniques',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=550,fit=crop/Yan17GBgrzT9bojZ/59ec20f4-8a62-4cd0-990c-7ed2edc6e749-Aq2WZEGbJGIDwjQa.jpeg'
        },
        {
            name: 'Drawing',
            icon: Palette,
            description: 'Develop artistic skills and creative expression',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=550,fit=crop/Yan17GBgrzT9bojZ/img-20240310-wa0025-AzGXOPQ33GFXpNDW.jpg'
        },
        {
            name: 'Basic Computer',
            icon: Monitor,
            description: 'Essential computer skills for the modern world',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=550,fit=crop/Yan17GBgrzT9bojZ/20240715_52201pmbygpsmapcamera-m6LZ8OGrPjcDlMG1.jpg'
        },
        {
            name: 'Spoken English',
            icon: Globe,
            description: 'Improve communication and career opportunities',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=607,fit=crop/Yan17GBgrzT9bojZ/img-20240916-wa0030-mp8WM5KpXouqEVQ0.jpg'
        }
    ];

    const stats = [
        { value: '150+', label: 'Students Trained' },
        { value: '15+', label: 'Courses Offered' },
        { value: '7', label: 'Years of Service' }
    ];

    return (
        <div className="pt-20 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section with Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto mb-16"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-6 text-white">Helping Hands NGO</h1>
                        <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-semibold mb-4">
                            Making a Difference
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                        <img
                            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=656,fit=crop/Yan17GBgrzT9bojZ/img-20240916-wa0030-mp8WM5KpXouqEVQ0.jpg"
                            alt="Children with Indian flags representing community impact"
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <p className="text-xl text-gray-200 leading-relaxed text-center">
                        Our non-charitable NGO offers various courses for the underprivileged so they can make a better future.
                        After the completion of the course, we provide students with certificates and job opportunities.
                    </p>
                </motion.div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center"
                        >
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-300 text-lg">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl mb-12"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Heart className="w-12 h-12 text-pink-500" />
                        <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                    </div>
                    <p className="text-gray-200 text-lg leading-relaxed mb-4">
                        Through this initiative, our only intention is to reach maximum underprivileged and help them to get a better lifestyle and be a support to their family.
                    </p>
                    <p className="text-gray-200 text-lg leading-relaxed">
                        We believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-semibold">humanity is the biggest religion</span>,
                        and our motto is to change lives without expectation, promoting compassion and service.
                    </p>
                </motion.div>

                {/* Courses Section with Images */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Free Courses Offered</h2>
                        <p className="text-gray-300 text-lg">
                            We provide comprehensive training programs to empower individuals with practical skills
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl hover:bg-white/15 transition-all group overflow-hidden"
                            >
                                {/* Course Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>

                                {/* Course Info */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <course.icon className="w-8 h-8 text-pink-500" />
                                        <h3 className="text-xl font-bold text-white">{course.name}</h3>
                                    </div>
                                    <p className="text-gray-300">{course.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Award className="w-12 h-12 text-purple-500" />
                        <h2 className="text-3xl font-bold text-white">Our Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-2">Empowerment</div>
                            <p className="text-gray-300">Building skills and confidence</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-2">Compassion</div>
                            <p className="text-gray-300">Serving with love and care</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-2">Service</div>
                            <p className="text-gray-300">Dedicated community support</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
