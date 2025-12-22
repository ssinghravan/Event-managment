// Test contact form API endpoint
import fetch from 'node-fetch';

const testContactForm = async () => {
    try {
        console.log('🧪 Testing contact form submission...\n');

        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message from the contact form. If you receive this email, the contact form is working correctly!'
        };

        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log('✅ SUCCESS: Contact form submitted successfully!');
            console.log('📧 Email notification should be sent to: bob1977singh@gmail.com');
            console.log('💾 Data saved to MongoDB');
            console.log('\nResponse:', data);
        } else {
            console.log('❌ FAILED:', data.message);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.log('\n💡 Make sure the server is running on port 5000');
    }
};

testContactForm();
