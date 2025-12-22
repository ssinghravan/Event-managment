import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = 'your_jwt_secret_key';
const USER_ID = '1764584630839'; // sahil singh from db.json

const token = jwt.sign({ id: USER_ID, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

const run = async () => {
    try {
        // Create a dummy file
        const filePath = path.join(__dirname, 'test_image.jpg');
        fs.writeFileSync(filePath, 'fake image content');

        const form = new FormData();
        form.append('name', 'Sahil Updated');
        form.append('phone', '1234567890');
        form.append('image', fs.createReadStream(filePath));

        console.log('Sending request...');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'x-auth-token': token,
                ...form.getHeaders()
            },
            body: form
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        // Cleanup
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('Error:', error);
    }
};

run();
