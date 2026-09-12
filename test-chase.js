import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('--- TESTING CHASE NAVIGATION BOT DETECTION BEHAVIOR ---');
  const CHASE_TARGET_URL = "https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate";
  
  const browser = await chromium.launch({
    headless: false,
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

  console.log('STEP 1: Navigating to Chase landing page...');
  await page.goto(CHASE_TARGET_URL, { waitUntil: 'commit', timeout: 35000 }).catch(e => {
    console.log('Nav warning:', e.message);
  });

  await page.waitForTimeout(3000);

  const newToChaseCard = page.getByText("I'm new to Chase").first();
  await newToChaseCard.waitFor({ state: 'visible', timeout: 15000 });

  console.log('STEP 2: Clicking "I\'m new to Chase" card...');
  await newToChaseCard.click();
  
  console.log('Waiting 2 seconds to check if auto-navigation happens...');
  await page.waitForTimeout(2000);
  console.log('URL after clicking card:', page.url());

  const nextBtn = page.locator('button:has-text("Next")').first();
  if (await nextBtn.isVisible({ timeout: 2000 })) {
    console.log('Next button is visible. Clicking Next with human delay...');
    await page.waitForTimeout(1000);
    await nextBtn.click();
  }

  await page.waitForTimeout(4000);
  console.log('URL after Next button click:', page.url());

  const artifactsDir = '/Users/devamiya/.gemini/antigravity-ide/brain/0233d9fb-650a-4785-82a7-723ac056400d';
  await page.screenshot({ path: path.join(artifactsDir, 'test_chase_step2_result.png') });

  if (page.url().includes('personalInformation') || page.url().includes('customerInfo')) {
    console.log('Successfully reached PII Personal Information page!');

    await page.waitForTimeout(2000);

    // Fill PII Fields using exact IDs (#firstName-input, #lastName-input, #dateOfBirth-input, #socialSecurityNumber-input)
    const fn = page.locator('#firstName-input').first();
    if (await fn.isVisible()) {
      await fn.click();
      await fn.fill('Sarah');
      console.log('Filled First Name: Sarah');
    }

    const ln = page.locator('#lastName-input').first();
    if (await ln.isVisible()) {
      await ln.click();
      await ln.fill('Jenkins');
      console.log('Filled Last Name: Jenkins');
    }

    const dob = page.locator('#dateOfBirth-input').first();
    if (await dob.isVisible()) {
      await dob.click();
      // Type DOB numbers one by one
      await dob.pressSequentially('01151990', { delay: 150 });
      console.log('Filled DOB: 01/15/1990');
    }

    const ssn = page.locator('#socialSecurityNumber-input').first();
    if (await ssn.isVisible()) {
      await ssn.click();
      // Type SSN numbers one by one
      await ssn.pressSequentially('999001234', { delay: 150 });
      console.log('Filled SSN: 999-00-1234');
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactsDir, 'test_chase_step3_filled.png') });

    // Click Next on PII page
    const piiNext = page.locator('button:has-text("Next")').first();
    if (await piiNext.isVisible()) {
      console.log('Clicking Next button on PII page...');
      await piiNext.click();
    }

    await page.waitForTimeout(5000);
    console.log('Final URL after PII submit:', page.url());
    await page.screenshot({ path: path.join(artifactsDir, 'test_chase_step3_final.png') });
  }

  console.log('--- TEST COMPLETED ---');
  await browser.close();
})();
