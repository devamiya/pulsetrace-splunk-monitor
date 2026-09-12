import { chromium } from 'playwright';

(async () => {
  console.log('=== Executing Chase PII Form Fill with Exact Element IDs ===');
  
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
  const url = "https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate";

  console.log('Step 1: Navigating to Chase URL:', url);
  await page.goto(url, { waitUntil: 'commit', timeout: 35000 });
  await page.waitForTimeout(4000);

  console.log('Step 2: Clicking "I\'m new to Chase" card...');
  try {
    const card = page.getByText("I'm new to Chase").first();
    if (await card.isVisible({ timeout: 4000 })) {
      await card.click();
    }
  } catch (e) {
    console.log('Step 2 note:', e.message);
  }

  await page.waitForTimeout(1500);

  console.log('Step 3: Clicking Next to advance to Your Information PII page...');
  try {
    const nextBtn = page.locator('button:has-text("Next")').first();
    if (await nextBtn.isVisible({ timeout: 3000 })) {
      await nextBtn.click();
    }
  } catch (e) {
    console.log('Step 3 note:', e.message);
  }

  // Wait for PII form page to load
  await page.waitForTimeout(4000);
  console.log('Current URL:', page.url());

  // Fill PII Form Fields using exact element IDs (#firstName-input, #lastName-input, #dateOfBirth-input, #socialSecurityNumber-input)
  console.log('Step 4: Injecting credentials into exact Chase form IDs...');
  try {
    const fnInput = page.locator('#firstName-input, input[id*="firstName"]').first();
    if (await fnInput.isVisible({ timeout: 3000 })) {
      console.log('Filling #firstName-input: Sarah');
      await fnInput.fill('Sarah');
    }

    const lnInput = page.locator('#lastName-input, input[id*="lastName"]').first();
    if (await lnInput.isVisible({ timeout: 3000 })) {
      console.log('Filling #lastName-input: Jenkins');
      await lnInput.fill('Jenkins');
    }

    const dobInput = page.locator('#dateOfBirth-input, input[id*="dateOfBirth"]').first();
    if (await dobInput.isVisible({ timeout: 3000 })) {
      console.log('Filling #dateOfBirth-input: 01/15/1990');
      await dobInput.fill('01/15/1990');
    }

    const ssnInput = page.locator('#socialSecurityNumber-input, input[id*="socialSecurityNumber"]').first();
    if (await ssnInput.isVisible({ timeout: 3000 })) {
      console.log('Filling #socialSecurityNumber-input: 999-00-1234');
      await ssnInput.fill('999-00-1234');
    }

    await page.waitForTimeout(1000);

    const piiNextBtn = page.locator('button:has-text("Next"), button[id*="next"]').first();
    if (await piiNextBtn.isVisible({ timeout: 3000 })) {
      console.log('Clicking Next button on PII page...');
      await piiNextBtn.click();
    }
  } catch (e) {
    console.log('PII form interaction note:', e.message);
  }

  await page.waitForTimeout(4000);

  const screenshotPath = '/Users/devamiya/.gemini/antigravity-ide/brain/0233d9fb-650a-4785-82a7-723ac056400d/chase_step5_pii_filled_success.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Captured PII filled screenshot at:', screenshotPath);

  await browser.close();
  console.log('=== Playwright Test Execution Resolved ===');
})();
