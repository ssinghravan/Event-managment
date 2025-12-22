import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const upcomingEvents = [
    {
        title: "Blood Donation Camp",
        description: "Join us for a blood donation initiative to save lives in our community. We'll have professional medical staff, free health screening, and refreshments. Every donation can save up to three lives!",
        date: new Date('2025-01-15'),
        location: "7A Mahendra Roy Lane, Topsia, Kolkata",
        category: "Health",
        image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=658,fit=crop/Yan17GBgrzT9bojZ/whatsapp-image-2025-03-31-at-19.42.07_56714574-YKb3PgKBVjIyQZ95.jpg",
        status: "upcoming",
        budget: 15000
    },
    {
        title: "Annual Health and Eye Exam Camp",
        description: "Free health checkups and eye examinations for all community members. Professional doctors and optometrists will provide comprehensive screenings and consultations.",
        date: new Date('2025-01-20'),
        location: "Community Center, Topsia",
        category: "Health",
        image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=618,fit=crop/Yan17GBgrzT9bojZ/health-mxB4zKqO8jC8aMp4.jpeg",
        status: "upcoming",
        budget: 25000
    },
    {
        title: "Education Awareness Program",
        description: "Supporting underprivileged children with educational resources, books, and learning materials. Volunteers needed to help with tutoring and mentoring sessions.",
        date: new Date('2025-02-05'),
        location: "Government School, Gobinda Khatick Rd",
        category: "Education",
        image: "https://amazing-starlight-f938f9.netlify.app/child.webp",
        status: "upcoming",
        budget: 40000
    },
    {
        title: "Women Empowerment Workshop",
        description: "Skill development workshops for women in our community. Learn stitching, mehendi, beautician skills, and more. Certificates provided upon completion.",
        date: new Date('2025-02-10'),
        location: "Helping Hands Training Center",
        category: "Community",
        image: "https://amazing-starlight-f938f9.netlify.app/women.avif",
        status: "upcoming",
        budget: 20000
    }
];

const seedEvents = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Clear existing events (optional - comment out if you want to keep existing events)
        await Event.deleteMany({});
        console.log('Existing events cleared...');

        // Insert new events
        const events = await Event.insertMany(upcomingEvents);
        console.log(`${events.length} events successfully added to the database!`);

        // Display the events
        console.log('\n--- Upcoming Events Added ---');
        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   Date: ${event.date.toDateString()}`);
            console.log(`   Location: ${event.location}`);
            console.log(`   Category: ${event.category}`);
            console.log(`   Status: ${event.status}\n`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding events:', error.message);
        process.exit(1);
    }
};

seedEvents();
