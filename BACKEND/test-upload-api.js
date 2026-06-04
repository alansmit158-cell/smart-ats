const fs = require('fs');
const path = require('path');

const URL = 'http://localhost:5000/api';

const run = async () => {
    try {
        console.log('🔑 Logging in...');
        const loginResponse = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'candidate@test.com',
                password: 'password123'
            })
        });
        
        if (!loginResponse.ok) {
            throw new Error(`Login failed with status ${loginResponse.status}: ${await loginResponse.text()}`);
        }
        
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('🔑 Login success! Token:', token.substring(0, 20) + '...');

        const authHeaders = { Authorization: `Bearer ${token}` };

        console.log('📄 Preparing CV upload...');
        const cvPath = path.resolve(__dirname, '../cv_candidat.pdf');
        if (!fs.existsSync(cvPath)) {
            throw new Error(`File not found at ${cvPath}`);
        }

        const dataBuffer = fs.readFileSync(cvPath);
        // Create Blob from buffer
        const fileBlob = new Blob([dataBuffer], { type: 'application/pdf' });
        
        const form = new FormData();
        form.append('cv', fileBlob, 'cv_candidat.pdf');

        console.log('🚀 Sending POST /candidates/upload...');
        const uploadResponse = await fetch(`${URL}/candidates/upload`, {
            method: 'POST',
            headers: authHeaders,
            body: form
        });

        console.log('🚀 Upload response status:', uploadResponse.status);
        const uploadData = await uploadResponse.json();
        console.log('Response body:', uploadData);

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed!`);
        }

        const { candidateId } = uploadData;

        console.log(`⏳ Polling status for candidateId: ${candidateId}...`);
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const statusResponse = await fetch(`${URL}/candidates/status/${candidateId}`, {
                headers: authHeaders
            });
            const statusData = await statusResponse.json();
            console.log(`[Poll ${i + 1}] Status:`, statusData.status, 'Message:', statusData.message);
            if (statusData.status === 'completed') {
                console.log('🎉 Successfully completed!');
                break;
            }
            if (statusData.status === 'failed') {
                console.log('❌ Failed!');
                break;
            }
        }
    } catch (err) {
        console.error('❌ Error during API test:', err.message);
    }
};

run();
