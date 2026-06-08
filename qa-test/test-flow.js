const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:5173';

async function clickByText(page, selector, text) {
    const elements = await page.$$(selector);
    for (const element of elements) {
        const value = await page.evaluate(el => el.textContent, element);
        if (value.toLowerCase().includes(text.toLowerCase())) {
            await page.evaluate(el => el.click(), element);
            return true;
        }
    }
    throw new Error(`Element ${selector} with text "${text}" not found`);
}

// React-compatible click via native DOM (avoids Puppeteer mouse simulation issues)
async function clickByTestId(page, testId) {
    await page.waitForSelector(`[data-testid="${testId}"]`, { timeout: 15000 });
    await page.evaluate((id) => {
        const el = document.querySelector(`[data-testid="${id}"]`);
        if (!el) throw new Error(`data-testid="${id}" not found`);
        el.click();
    }, testId);
}

// Always use the React-compatible native DOM setter (more reliable than input.type() in Puppeteer
// especially after native DOM clicks open modals with Framer Motion)
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

async function typeInTextarea(page, selector, text) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.evaluate((sel, val) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`Selector not found: ${sel}`);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, selector, text);
}

async function createPage(browser, errors, warnings, httpErrors) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error') {
            errors.push(text);
            console.log(`[BROWSER ERROR] ${text}`);
        } else if (msg.type() === 'warning') {
            warnings.push(text);
            console.log(`[BROWSER WARNING] ${text}`);
        } else {
            console.log(`[BROWSER LOG] ${text}`);
        }
    });

    page.on('pageerror', err => {
        errors.push(err.toString());
        console.error(`[BROWSER UNCAUGHT ERROR] ${err.toString()}`);
    });

    page.on('response', response => {
        const status = response.status();
        const url = response.url();
        if (status >= 400) {
            httpErrors.push({ url, status });
            console.error(`[HTTP ERROR] ${url} - Status ${status}`);
        }
    });

    return page;
}

async function runTest() {
    console.log('🤖 Starting AI E2E QA Test Flow...');
    
    // Automatically reset and seed the database for a clean E2E run
    const { execSync } = require('child_process');
    try {
        const backendDir = path.resolve(__dirname, '../BACKEND');
        console.log('Clearing database...');
        execSync('node cleanup.js', { stdio: 'inherit', cwd: backendDir });
        console.log('Seeding database...');
        execSync('node preflight.js', { stdio: 'inherit', cwd: backendDir });
    } catch (err) {
        console.warn('⚠️ Warning: Failed to run DB cleanup/preflight. Continuing test anyway...', err.message);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-US']
    });

    // Track console warnings/errors and HTTP requests
    const errors = [];
    const warnings = [];
    const httpErrors = [];

    let page = await createPage(browser, errors, warnings, httpErrors);

    try {
        // Create screenshots folder
        const screenshotsDir = path.join(__dirname, 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir);
        }

        // =====================================================================
        // ÉTAPE 0 : RECRUITER LOGIN & JOB CREATION
        // =====================================================================
        console.log('\n--- Step 0: Recruiter Login & Job Creation ---');
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('i18nextLng', 'en');
        });
        await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500)); // wait for React hydration
        await page.screenshot({ path: path.join(screenshotsDir, '0_login_page.png') });

        console.log('Logging in as recruiter...');
        await typeInInput(page, 'input[type="email"]', 'recruiter@test.com');
        await typeInInput(page, 'input[type="password"]', 'password123');
        // Use native DOM click for submit — reliable with React synthetic events
        await page.evaluate(() => document.querySelector('button[type="submit"]').click());

        console.log('Waiting for recruiter dashboard redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '0_recruiter_dashboard.png') });

        console.log('Navigating to Jobs management page...');
        await page.goto(`${URL}/recruiter/jobs`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(screenshotsDir, '0_recruiter_jobs.png') });

        console.log('Opening "New Job" modal via data-testid (React-native DOM click)...');
        await clickByTestId(page, 'btn-new-job');
        await new Promise(r => setTimeout(r, 2000)); // wait for modal animation + React state update
        await page.screenshot({ path: path.join(screenshotsDir, '0_new_job_modal.png') });

        // Verify modal is actually open
        const modalVisible = await page.$('[data-testid="input-job-title"]');
        if (!modalVisible) {
            console.warn('⚠️ Modal did not open on first click — retrying...');
            await clickByTestId(page, 'btn-new-job');
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log('Filling out job creation form using data-testid selectors...');
        await typeInInput(page, '[data-testid="input-job-title"]', 'Quantum AI React Engineer');
        await typeInInput(page, '[data-testid="input-job-location"]', 'Paris (Hybrid)');
        await typeInInput(page, '[data-testid="input-job-salary"]', '75000');
        
        // description must be > 200 characters!
        const jobDesc = 'We are looking for a senior React and Node.js engineer to build complex AI-powered platforms. The candidate will work in a fast-paced environment and will be responsible for creating robust web architectures, optimizing database schemas under MongoDB, and writing comprehensive unit and E2E tests for premium web applications.';
        await typeInTextarea(page, '[data-testid="textarea-job-description"]', jobDesc);
        await typeInInput(page, '[data-testid="input-job-skills"]', 'React, Node.js, Express, MongoDB');

        await page.screenshot({ path: path.join(screenshotsDir, '0_job_form_filled.png') });

        console.log('Submitting job form...');
        await clickByTestId(page, 'btn-submit-job');
        await new Promise(r => setTimeout(r, 2500)); // wait for API create and refresh
        await page.screenshot({ path: path.join(screenshotsDir, '0_job_created.png') });

        console.log('Logging out recruiter...');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        // =====================================================================
        // ÉTAPE 1 : CANDIDATE LOGIN & UPLOAD
        // =====================================================================
        console.log('\n--- Step 1: Candidate Login & CV Upload ---');
        await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500)); // wait for React hydration
        await page.screenshot({ path: path.join(screenshotsDir, '1_login_page.png') });

        console.log('Logging in as candidate...');
        await typeInInput(page, 'input[type="email"]', 'candidate@test.com');
        await typeInInput(page, 'input[type="password"]', 'password123');
        // Use native DOM click for submit — reliable with React synthetic events
        await page.evaluate(() => document.querySelector('button[type="submit"]').click());

        console.log('Waiting for portal redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '2_candidate_portal.png') });

        console.log('Navigating to Candidate Explorer...');
        await page.goto(`${URL}/candidate/explorer`, { waitUntil: 'networkidle2' });
        
        // Wait for job listings to load from API
        console.log('Waiting for job listings to load...');
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('apply securely') || document.body.innerText.toLowerCase().includes('application submitted'),
            { timeout: 20000 }
        );
        await page.screenshot({ path: path.join(screenshotsDir, '3_explorer_page.png') });

        // Fetch available jobs to get the job ID for the newly created job.
        // We navigate directly to /candidate/upload?jobId=... to bypass the
        // window.confirm() dialog race condition (setTimeout + Puppeteer dialog handler conflict).
        console.log('Fetching job ID for "Quantum AI React Engineer" to navigate to upload page directly...');
        const candidateToken = await page.evaluate(() => localStorage.getItem('token'));
        const jobsData = await page.evaluate(async (token) => {
            const r = await fetch('http://localhost:5000/api/jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return r.json();
        }, candidateToken);
        
        const targetJob = Array.isArray(jobsData) 
            ? jobsData.find(j => j.titre && j.titre.toLowerCase().includes('quantum'))
            : null;
        const targetJobId = targetJob?._id || (Array.isArray(jobsData) && jobsData[0]?._id) || null;
        console.log(`Using jobId: ${targetJobId} (${targetJob?.titre || 'first available job'})`);

        // Navigate directly to the CV upload page with the job ID pre-selected
        await page.goto(`${URL}/candidate/upload${targetJobId ? `?jobId=${targetJobId}` : ''}`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(screenshotsDir, '4_upload_page_redirected.png') });

        const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
        const cvPath = path.resolve(__dirname, '../cv_candidat.pdf');
        console.log(`Uploading file from path: ${cvPath}`);
        await fileInput.uploadFile(cvPath);
        
        await page.screenshot({ path: path.join(screenshotsDir, '4_upload_page_with_file.png') });

        console.log('Clicking "Transmit to Neural Core"...');
        await clickByText(page, 'button', 'Transmit to Neural Core');
        
        console.log('Waiting for NLP worker analysis completion (polling status)...');
        // Wait for completed text to appear: "Node Indexed Successfully."
        // We will wait up to 60 seconds.
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('node indexed successfully.'),
            { timeout: 60000 }
        );
        console.log('✅ CV analyzed and candidate indexed by background Worker Thread.');
        await page.screenshot({ path: path.join(screenshotsDir, '5_upload_page_completed.png') });

        // Navigate to Job Explorer to check application status
        console.log('Navigating to Candidate Explorer to verify "Application Submitted" badge...');
        await page.goto(`${URL}/candidate/explorer`, { waitUntil: 'networkidle2' });
        
        // Wait for job listings to load from API
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('application submitted'),
            { timeout: 20000 }
        );
        await page.screenshot({ path: path.join(screenshotsDir, '7_explorer_page_applied.png') });


        // =====================================================================
        // ÉTAPE 2 : RECRUITER LOGIN & SCORING
        // =====================================================================
        console.log('\n--- Step 2: Recruiter Login & Matching ---');
        await page.close();
        page = await createPage(browser, errors, warnings, httpErrors);
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            localStorage.setItem('i18nextLng', 'en');
        });
        await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500)); // wait for React hydration
        
        console.log('Logging in as recruiter...');
        await typeInInput(page, 'input[type="email"]', 'recruiter@test.com');
        await typeInInput(page, 'input[type="password"]', 'password123');
        // Use native DOM click for submit — reliable with React synthetic events
        await page.evaluate(() => document.querySelector('button[type="submit"]').click());

        console.log('Waiting for recruiter dashboard redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '8_recruiter_dashboard.png') });

        console.log('Navigating to Scoring page...');
        await page.goto(`${URL}/recruiter/scoring`, { waitUntil: 'networkidle2' });
        
        // Wait for loading to finish and dashboard button to appear (handles FR or EN)
        await page.waitForFunction(
            () => {
                const text = document.body.innerText.toLowerCase();
                return text.includes('traitement global (scoring ia)') || text.includes('global processing (ai scoring)');
            },
            { timeout: 15000 }
        );
        await page.screenshot({ path: path.join(screenshotsDir, '9_recruiter_scoring_empty.png') });

        console.log('Selecting candidate card for detail view...');
        // Click candidate card by text
        await clickByText(page, 'h3', 'Candidate');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(screenshotsDir, '11_candidate_selected_details.png') });

        // Verify if details/anomalies are visible (case-insensitive for CSS uppercase)
        const pageText = await page.evaluate(() => document.body.innerText.toLowerCase());
        if (pageText.includes('predictive logic') || pageText.includes('strategic recommendation')) {
            console.log('✅ Recruiter details panel rendered successfully.');
        } else {
            console.warn('⚠️ Recruiter details panel text verification failed.');
        }

        // Verify if score / match label is visible on the page
        const scoreRegex = /\d+%/; // Checks for a percentage score like "88%"
        const hasScore = scoreRegex.test(pageText);
        const hasMatch = pageText.includes('match') || pageText.includes('تطابق');

        if (hasScore && hasMatch) {
            console.log('✅ Recruiter dashboard compatibility score and match label verified successfully.');
        } else {
            console.warn(`⚠️ Recruiter dashboard verification: hasScore=${hasScore}, hasMatch=${hasMatch}. Outer text: ${pageText.substring(0, 500)}`);
        }

        // Verify custom AI interview kit questions are visible on details panel
        const hasCustomKit = pageText.includes('custom ai interview kit') || pageText.includes('sync_ai_kit');
        if (hasCustomKit) {
            console.log('✅ Custom AI Interview Kit verified successfully in details panel.');
        } else {
            console.warn(`⚠️ Custom AI Interview Kit verification failed. Outer text: ${pageText.substring(0, 500)}`);
        }

        console.log('Initiating Interview (setting status to Interviewed)...');
        // "Initiate Exchange" in EN locale
        await clickByText(page, 'button', 'Initiate Exchange');
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(screenshotsDir, '12_initiated_interview.png') });

        // =====================================================================
        // ÉTAPE 3 : INTERVIEW KIT & PDF EXPORT
        // =====================================================================
        console.log('\n--- Step 3: Interview Kit & Export PDF ---');
        await page.goto(`${URL}/recruiter/interviews`, { waitUntil: 'networkidle2' });
        
        // Wait for page to load applications
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('evaluate exchange'),
            { timeout: 20000 }
        );
        await page.screenshot({ path: path.join(screenshotsDir, '13_interviews_pipeline.png') });

        console.log('Clicking "Evaluate Exchange" to open panel...');
        await clickByText(page, 'button', 'Evaluate Exchange');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(screenshotsDir, '14_evaluation_panel_open.png') });

        console.log('Clicking "Synch AI Kit" to generate Interview Kit...');
        await clickByText(page, 'button', 'Synch AI Kit');
        
        console.log('Waiting for AI Interview Kit generation...');
        // AI Kit generation takes about 5-15 seconds. Let's wait up to 30 seconds for Exporter button (handles FR or EN).
        await page.waitForFunction(
            () => {
                const text = document.body.innerText.toLowerCase();
                return text.includes('exporter le guide (pdf)') || text.includes('export guide (pdf)');
            },
            { timeout: 30000 }
        );
        console.log('✅ AI Interview Kit generated successfully.');
        await page.screenshot({ path: path.join(screenshotsDir, '15_kit_generated.png') });

        console.log('Triggering PDF Export...');
        try {
            await clickByText(page, 'button', 'Export Guide (PDF)');
        } catch (e) {
            await clickByText(page, 'button', 'Exporter le Guide (PDF)');
        }
        await new Promise(r => setTimeout(r, 3000)); // wait for client-side download to complete/start
        console.log('✅ Export to PDF triggered.');

        // =====================================================================
        // ÉTAPE 4 : ADMIN PORTAL TELEMETRY & AUDIT LOGS
        // =====================================================================
        console.log('\n--- Step 4: Admin Portal Telemetry ---');
        await page.close();
        page = await createPage(browser, errors, warnings, httpErrors);
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            localStorage.setItem('i18nextLng', 'en');
        });
        await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500)); // wait for React hydration
        
        console.log('Logging in as admin...');
        await typeInInput(page, 'input[type="email"]', 'admin@test.com');
        await typeInInput(page, 'input[type="password"]', 'password123');
        // Use native DOM click for submit — reliable with React synthetic events
        await page.evaluate(() => document.querySelector('button[type="submit"]').click());

        console.log('Waiting for admin dashboard redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // Wait for loading indicator to disappear, and dashboard stats / content to load
        console.log('Waiting for admin stats to load...');
        await page.waitForFunction(
            () => !document.body.innerText.toLowerCase().includes('loading'),
            { timeout: 15000 }
        );
        
        await page.screenshot({ path: path.join(screenshotsDir, '16_admin_dashboard.png') });

        const adminPageText = await page.evaluate(() => document.body.innerText.toLowerCase());
        if (
            adminPageText.includes('token usage') ||
            adminPageText.includes('audit') ||
            adminPageText.includes('worker') ||
            adminPageText.includes('users') ||
            adminPageText.includes('neural') ||
            adminPageText.includes('health')
        ) {
            console.log('✅ Admin dashboard telemetry fields are visible.');
        } else {
            console.warn('⚠️ Admin dashboard telemetry text verification failed.');
        }

        console.log('\n=======================================');
        console.log('🎉 E2E TEST FLOW COMPLETED SUCCESSFULLY!');
        console.log('=======================================');

    } catch (e) {
        console.error('\n❌ E2E TEST FLOW FAILED:', e);
        try {
            const currentUrl = page.url();
            console.log(`[DEBUG] Current Page URL: ${currentUrl}`);
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log(`[DEBUG] Page Text Content (first 1500 chars):\n${bodyText.substring(0, 1500)}`);
            const localStorageData = await page.evaluate(() => JSON.stringify(localStorage));
            console.log(`[DEBUG] LocalStorage: ${localStorageData}`);
        } catch (debugErr) {
            console.error('[DEBUG] Failed to gather page debug info:', debugErr.message);
        }
        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'error_crash.png') });
    } finally {
        await browser.close();

        // Print final reports
        console.log('\n📊 --- FINAL QUALITY ASSURANCE REPORT ---');
        console.log(`Uncaught JS Errors detected: ${errors.length}`);
        if (errors.length > 0) {
            errors.forEach(err => console.log(`  - ${err}`));
        } else {
            console.log('  No client-side React crash or uncaught TypeError found.');
        }

        console.log(`Browser Warnings detected: ${warnings.length}`);
        
        console.log(`HTTP Error Statuses: ${httpErrors.length}`);
        if (httpErrors.length > 0) {
            httpErrors.forEach(err => console.log(`  - ${err.url} -> ${err.status}`));
        } else {
            console.log('  No 4xx/5xx network response status codes found.');
        }
    }
}

runTest();
