
import fetch from 'node-fetch';

async function seedUser() {
    try {
        const email = 'user@example.com';
        const password = 'password123';

        // 1. Register
        console.log('Registering...');
        let response = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Demo User',
                email,
                password,
                phone: '1234567890'
            })
        });
        let data = await response.json();
        console.log('Register:', data);

        // 2. We need to find the OTP. 
        // Since we can't easily read the server log from here *programmatically* in this simple script without access to the server process directly (unless we read db.json),
        // let's just cheat and read the db.json file directly since we are on the server :)

        // Actually, we can just use the register response? No, it doesn't return OTP.
        // We will infer it from the server logs which I (the agent) can read, OR
        // I will write a script that accesses the MockDB/MongoDB directly to update the user to verified.
    } catch (error) {
        console.error('Error:', error);
    }
}
// seedUser();
