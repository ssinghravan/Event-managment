import React from 'react';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import EventCarousel from '../components/EventCarousel';
import CallToAction from '../components/CallToAction';

const Home = () => {
    return (
        <main className="min-h-screen">
            <Hero />
            <StatsSection />
            <EventCarousel />
            <CallToAction />
        </main>
    );
};

export default Home;
