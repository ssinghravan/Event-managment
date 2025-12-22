import fetch from 'node-fetch';

async function testRegister() {
    console.log('Testing registration with Admin role...');
    try {
        const timestamp = Date.now();
        const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Admin',
                email: `admin_${timestamp}@test.com`,
                password: 'password123',
                phone: '1234567890',
                role: 'admin'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.status === 201) {
            console.log('✅ Registration with role success!');
        } else {
            console.log('❌ Registration failed');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testRegister();
