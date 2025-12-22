import dotenv from 'dotenv';
dotenv.config();
import { sendOTP } from './utils/emailService.js';

async function testEmail() {
    console.log('Testing email dispatch...');
    console.log('User:', process.env.EMAIL_USER);
    console.log('Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
    // Don't log the password

    const success = await sendOTP('ssinghr100@gmail.com', '123456');
    if (success) {
        console.log('✅ Email sent successfully!');
    } else {
        console.log('❌ Email failed to send.');
    }
}

testEmail();
