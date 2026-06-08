const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:5173';

// React-compatible input helper using native DOM setter
async function typeInInput(page, selector, text) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.evaluate((sel, val) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`Selector not found: ${sel}`);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, selector, text);
}

async function loginAndNavigate(page, email, password, roleLabel, pages, screenshotsDir) {
    console.log(`\n🔑 Logging in as ${roleLabel} (${email})...`);
    
    // Clear storage to start clean
    await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem('i18nextLng', 'en'); // Use English locale for screenshots
    });
    await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500)); // React hydration wait

    await typeInInput(page, 'input[type="email"]', email);
    await typeInInput(page, 'input[type="password"]', password);
    
    // Click submit
    await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
    });
    
    console.log(`Waiting for ${roleLabel} dashboard redirect...`);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture each page in the list
    for (const p of pages) {
        const fullUrl = `${URL}${p.path}`;
        console.log(`📸 Navigating to: ${fullUrl} (${p.name})`);
        
        try {
            await page.goto(fullUrl, { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 2500)); // wait for full page animations and stats to load
            
            // Clean up any common loading indicators or wait for them to disappear
            await page.waitForFunction(
                () => !document.body.innerText.toLowerCase().includes('loading...'),
                { timeout: 5000 }
            ).catch(() => {});

            const fileName = `${roleLabel.toLowerCase()}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
            const screenshotPath = path.join(screenshotsDir, fileName);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`   Saved screenshot: ${fileName}`);
        } catch (err) {
            console.error(`❌ Failed to capture ${p.name} at ${p.path}:`, err.message);
        }
    }
}

async function run() {
    console.log('🚀 Starting Automated Screenshot Capture of All Pages...');
    
    // Auto reset and seed the database to make sure screens are populated with realistic data
    const { execSync } = require('child_process');
    try {
        const backendDir = path.resolve(__dirname, '../BACKEND');
        console.log('Re-seeding database for clean dashboard states...');
        execSync('node cleanup.js', { stdio: 'inherit', cwd: backendDir });
        execSync('node preflight.js', { stdio: 'inherit', cwd: backendDir });
    } catch (err) {
        console.warn('⚠️ Warning: Failed to run DB seed:', err.message);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-US']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Ensure output directories exist
    const screenshotsDir = path.join(__dirname, 'screenshots', 'all');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    try {
        // ==========================================
        // 1. PUBLIC PAGES
        // ==========================================
        console.log('\n🌐 Capturing Public Pages...');
        
        const publicPages = [
            { name: 'Landing', path: '/' },
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' }
        ];

        for (const p of publicPages) {
            const fullUrl = `${URL}${p.path}`;
            console.log(`📸 Navigating to: ${fullUrl}`);
            await page.goto(fullUrl, { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 2000));
            
            const fileName = `public_${p.name.toLowerCase()}.png`;
            await page.screenshot({ path: path.join(screenshotsDir, fileName), fullPage: true });
            console.log(`   Saved screenshot: ${fileName}`);
        }

        // ==========================================
        // 2. RECRUITER PAGES
        // ==========================================
        const recruiterPages = [
            { name: 'Dashboard', path: '/recruiter/dashboard' },
            { name: 'Jobs', path: '/recruiter/jobs' },
            { name: 'Scoring', path: '/recruiter/scoring' },
            { name: 'Candidates', path: '/recruiter/candidates' },
            { name: 'Interviews', path: '/recruiter/interviews' },
            { name: 'Messages', path: '/recruiter/messages' },
            { name: 'Subscription', path: '/recruiter/subscription' },
            { name: 'Settings', path: '/recruiter/settings' },
            { name: 'Reports', path: '/recruiter/reports' }
        ];

        await loginAndNavigate(
            page, 
            'recruiter@test.com', 
            'password123', 
            'Recruiter', 
            recruiterPages, 
            screenshotsDir
        );

        // ==========================================
        // 3. CANDIDATE PAGES
        // ==========================================
        const candidatePages = [
            { name: 'Portal', path: '/candidate/portal' },
            { name: 'Explorer', path: '/candidate/explorer' },
            { name: 'Applications', path: '/candidate/applications' },
            { name: 'Chat', path: '/candidate/messages' },
            { name: 'Profile', path: '/candidate/profile' },
            { name: 'Upload', path: '/candidate/upload' }
        ];

        await loginAndNavigate(
            page, 
            'candidate@test.com', 
            'password123', 
            'Candidate', 
            candidatePages, 
            screenshotsDir
        );

        // ==========================================
        // 4. ADMIN PAGES
        // ==========================================
        const adminPages = [
            { name: 'Stats', path: '/admin/stats' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Security', path: '/admin/security' },
            { name: 'Logs', path: '/admin/logs' },
            { name: 'Subscriptions', path: '/admin/subscriptions' },
            { name: 'Settings', path: '/admin/settings' }
        ];

        await loginAndNavigate(
            page, 
            'admin@test.com', 
            'password123', 
            'Admin', 
            adminPages, 
            screenshotsDir
        );

        console.log('\n=======================================');
        console.log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
        console.log(`Saved in: ${screenshotsDir}`);
        console.log('=======================================');

    } catch (e) {
        console.error('❌ Error during capture process:', e);
    } finally {
        await browser.close();
    }
}

run();
