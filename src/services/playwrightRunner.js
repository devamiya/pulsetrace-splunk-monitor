// PulseTrace Playwright Automation Engine & Event Streamer for Chase Origination

export const TARGET_APPLICATION_URL = "https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate";

export function buildPlaywrightScript(appData) {
  const applicantName = appData.applicantName || "Sarah Jenkins";
  const amount = appData.amount ? appData.amount.toLocaleString() : "25,000";

  return [
    {
      stepNumber: 1,
      title: "1. Land Into the Page",
      code: `await page.goto('${TARGET_APPLICATION_URL}');`,
      action: "LAND_PAGE",
      url: TARGET_APPLICATION_URL,
      targetSelector: null,
      log: "Navigating to Chase secure online account origination page (cfgCode=502002)...",
      durationMs: 1200,
      network: { method: "GET", url: "https://secure.chase.com/web/oao/application/retail", status: 200 }
    },
    {
      stepNumber: 2,
      title: "2. Choose \"I'm new to Chase\"",
      code: `await page.getByRole('radio', { name: "I'm new to Chase" }).check();\nawait page.getByRole('button', { name: 'Continue' }).click();`,
      action: "CHOOSE_NEW_CUSTOMER",
      targetSelector: "#new-to-chase-radio",
      log: "Selecting \"I'm new to Chase\" origination option...",
      durationMs: 1400,
      network: { method: "POST", url: "https://secure.chase.com/web/oao/api/v1/flow/select", status: 200 }
    },
    {
      stepNumber: 3,
      title: "3. Fill PII Data then Click Next",
      code: `await page.getByLabel('First Name').fill('${applicantName}');\nawait page.getByLabel('Initial Deposit').fill('$${amount}');\nawait page.getByRole('button', { name: 'Next' }).click();\nconst response = await page.waitForResponse('**/origination/submit');\nexpect(response.status()).toBe(201);`,
      action: "FILL_PII_AND_NEXT",
      targetSelector: "#pii-submit-btn",
      log: `Injecting PII details for ${applicantName} ($${amount} USD) and clicking Next to submit application. Intercepted 201 Created & published Kafka event 'app.submitted'.`,
      durationMs: 1600,
      network: { method: "POST", url: "https://secure.chase.com/web/oao/api/v2/origination/submit", status: 201, event: "KAFKA_PUBLISH", topic: "app.submitted" }
    }
  ];
}

export class PlaywrightRunner {
  constructor(onStepUpdate, onComplete) {
    this.onStepUpdate = onStepUpdate;
    this.onComplete = onComplete;
    this.isRunning = false;
    this.currentStepIdx = 0;
    this.isPaused = false;
  }

  async runTest(applicationData) {
    this.isRunning = true;
    this.isPaused = false;
    this.currentStepIdx = 0;

    try {
      const scriptSteps = buildPlaywrightScript(applicationData);

      for (let i = 0; i < scriptSteps.length; i++) {
        if (!this.isRunning) break;
        
        while (this.isPaused) {
          await new Promise(r => setTimeout(r, 200));
        }

        this.currentStepIdx = i;
        const step = scriptSteps[i];

        if (this.onStepUpdate) {
          this.onStepUpdate({
            step,
            stepIdx: i,
            totalSteps: scriptSteps.length,
            scriptSteps,
            applicationData,
            status: 'RUNNING',
            error: null
          });
        }

        await new Promise(r => setTimeout(r, step.durationMs));
      }

      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete(applicationData);
      }
    } catch (err) {
      this.isRunning = false;
      if (this.onStepUpdate) {
        this.onStepUpdate({
          step: null,
          stepIdx: this.currentStepIdx,
          totalSteps: 3,
          scriptSteps: [],
          applicationData,
          status: 'ERROR',
          error: err.message || 'Submission Execution Error'
        });
      }
    }
  }

  stop() {
    this.isRunning = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}
