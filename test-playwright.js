import { chromium } from 'playwright';

(async () => {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  const url = "https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate";

  console.log('Navigating to target URL:', url);
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
    console.log('Page navigated successfully. Current title:', await page.title());
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error('Error navigating:', err.message);
  } finally {
    await browser.close();
    console.log('Done.');
  }
})();
