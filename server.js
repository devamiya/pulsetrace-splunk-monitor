import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const CHASE_TARGET_URL = "https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate";

// API: Run Full Playwright Automation against Chase Origination Form
app.post('/api/run-playwright', async (req, res) => {
  const { applicantName, amount, appType, cfgCode } = req.body;
  const targetCfg = cfgCode || '502002';
  const targetUrl = `https://secure.chase.com/web/oao/application/retail?cfgCode=${targetCfg}#/origination/gettingStarted/gettingStarted/initiate`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendLog = (stepIdx, title, log, action, targetSelector) => {
    res.write(`data: ${JSON.stringify({ stepIdx, title, log, action, targetSelector, timestamp: new Date().toISOString() })}\n\n`);
  };

  try {
    sendLog(0, "1. Land Into the Page", `Navigating directly to Chase ${appType || 'Origination'} (${targetUrl})`, "LAND_PAGE", null);

    const browser = await chromium.launch({
      headless: false, // OPEN REAL CHROMIUM BROWSER WINDOW ON MAC DESKTOP!
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized'
      ]
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    // STEP 1: Land into the page
    await page.goto(targetUrl, { waitUntil: 'commit', timeout: 35000 }).catch(e => {
      console.log('Navigation event:', e.message);
    });

    await page.waitForTimeout(4000);

    // STEP 2: Choose "I'm new to Chase"
    sendLog(1, "2. Choose \"I'm new to Chase\"", "Selecting \"I'm new to Chase\" card option", "CHOOSE_NEW_CUSTOMER", "#new-to-chase-card");
    
    try {
      const newToChaseCard = page.getByText("I'm new to Chase").first();
      if (await newToChaseCard.isVisible({ timeout: 4000 })) {
        await newToChaseCard.click();
      }

      await page.waitForTimeout(1000);

      const nextButton = page.locator('button:has-text("Next")').first();
      if (await nextButton.isVisible({ timeout: 3000 })) {
        await nextButton.click();
      }
    } catch (e) {
      console.log('Step 2 note:', e.message);
    }

    await page.waitForTimeout(4000);

    // STEP 3: Fill PII Data on "Your Information" page
    sendLog(2, "3. Fill PII Data then Click Next", `Injecting Standard PII Data (First Name, Last Name, DOB & SSN) for Home Lending Origination`, "FILL_PII_AND_NEXT", "#firstName-input");

    try {
      const firstName = 'Sarah';
      const lastName = 'Jenkins';

      const fnInput = page.locator('#firstName-input, input[id*="firstName"]').first();
      if (await fnInput.isVisible({ timeout: 3000 })) {
        await fnInput.click();
        await fnInput.fill(firstName);
      }

      const lnInput = page.locator('#lastName-input, input[id*="lastName"]').first();
      if (await lnInput.isVisible({ timeout: 3000 })) {
        await lnInput.click();
        await lnInput.fill(lastName);
      }

      const dobInput = page.locator('#dateOfBirth-input, input[id*="dateOfBirth"]').first();
      if (await dobInput.isVisible({ timeout: 3000 })) {
        await dobInput.click();
        await dobInput.pressSequentially('01151990', { delay: 120 });
      }

      const ssnInput = page.locator('#socialSecurityNumber-input, input[id*="socialSecurityNumber"]').first();
      if (await ssnInput.isVisible({ timeout: 3000 })) {
        await ssnInput.click();
        await ssnInput.pressSequentially('999001234', { delay: 120 });
      }

      await page.waitForTimeout(2000);

      const piiNextBtn = page.locator('button:has-text("Next"), button[id*="next"]').first();
      if (await piiNextBtn.isVisible({ timeout: 3000 })) {
        await piiNextBtn.click();
      }
    } catch (e) {
      console.log('Step 3 PII fill note:', e.message);
    }

    await page.waitForTimeout(5000);

    // Keep browser window open on Mac desktop so user can view
    await page.waitForTimeout(10000);
    await browser.close();

    res.write(`data: ${JSON.stringify({ finished: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Playwright Error:', err);
    sendLog(2, "3. Fill PII Data then Click Next", `Completed: ${err.message}`, "FILL_PII_AND_NEXT", null);
    res.write(`data: ${JSON.stringify({ finished: true, error: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`PulseTrace Playwright Backend Server running on http://localhost:${PORT}`);
});
