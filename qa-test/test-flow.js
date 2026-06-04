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

async function typeInInput(page, selector, text) {
    // Wait for the element to not be disabled
    await page.waitForSelector(selector);
    const input = await page.$(selector);
    
    // Focus the input
    await input.focus();
    
    // Clear the input first using React compatible setter
    await page.evaluate(el => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeSetter.call(el, '');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, input);

    // Type using Puppeteer's type with a small delay
    await input.type(text, { delay: 30 });

    // Verify the value
    let value = await page.evaluate(el => el.value, input);
    if (value !== text) {
        console.log(`⚠️ Value mismatch for ${selector}: expected "${text}", got "${value}". Falling back to direct React-compatible DOM value setting...`);
        await page.evaluate((el, val) => {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeSetter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, input, text);
    }
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
        // ÉTAPE 1 : CANDIDATE LOGIN & UPLOAD
        // =====================================================================
        console.log('\n--- Step 1: Candidate Login & CV Upload ---');
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('i18nextLng', 'en');
        });
        await page.goto(`${URL}/login`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500)); // wait for React hydration
        await page.screenshot({ path: path.join(screenshotsDir, '1_login_page.png') });

        console.log('Logging in as candidate...');
        await typeInInput(page, 'input[type="email"]', 'candidate@test.com');
        await typeInInput(page, 'input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        console.log('Waiting for portal redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '2_candidate_portal.png') });

        console.log('Navigating to Upload Page...');
        await page.goto(`${URL}/candidate/upload`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '3_upload_page_empty.png') });

        const fileInput = await page.waitForSelector('input[type="file"]');
        const cvPath = path.resolve(__dirname, '../cv_candidat.pdf');
        console.log(`Uploading file from path: ${cvPath}`);
        await fileInput.uploadFile(cvPath);
        
        await page.screenshot({ path: path.join(screenshotsDir, '4_upload_page_with_file.png') });

        console.log('Clicking "Transmit to Neural Core"...');
        await clickByText(page, 'button', 'Transmit to Neural Core');
        
        console.log('Waiting for NLP worker analysis completion (polling status)...');
        // Wait for completed text to appear: "Node Indexed Successfully."
        // We will wait up to 45 seconds.
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('node indexed successfully.'),
            { timeout: 45000 }
        );
        console.log('✅ CV analyzed and candidate indexed by background Worker Thread.');
        await page.screenshot({ path: path.join(screenshotsDir, '5_upload_page_completed.png') });

        // Navigate to Job Explorer
        console.log('Navigating to Candidate Explorer...');
        await page.goto(`${URL}/candidate/explorer`, { waitUntil: 'networkidle2' });
        
        // Wait for job listings to load from API
        await page.waitForFunction(
            () => document.body.innerText.toLowerCase().includes('apply securely'),
            { timeout: 15000 }
        );
        await page.screenshot({ path: path.join(screenshotsDir, '6_explorer_page.png') });

        console.log('Applying to job...');
        await clickByText(page, 'button', 'Apply Securely');
        // Wait a bit for application submission toast
        await new Promise(r => setTimeout(r, 2000));
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
        await page.click('button[type="submit"]');

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

        console.log('Triggering global AI scoring...');
        try {
            await clickByText(page, 'button', 'Global Processing (AI Scoring)');
        } catch (e) {
            await clickByText(page, 'button', 'Traitement Global (Scoring IA)');
        }
        
        // Wait for scoring processing to complete
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: path.join(screenshotsDir, '10_recruiter_scoring_scored.png') });

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

        console.log('Initiating Interview (setting status to Interviewed)...');
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
            { timeout: 15000 }
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
        await page.click('button[type="submit"]');

        console.log('Waiting for admin dashboard redirect...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotsDir, '16_admin_dashboard.png') });

        const adminPageText = await page.evaluate(() => document.body.innerText.toLowerCase());
        if (adminPageText.includes('openai console') || adminPageText.includes('audit log')) {
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
