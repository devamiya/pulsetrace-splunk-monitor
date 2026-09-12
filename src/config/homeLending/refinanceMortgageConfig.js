import { DollarSign } from 'lucide-react';

export const refinanceMortgageConfig = {
  id: 'Refinance Mortgage',
  label: 'Refinance',
  desc: 'Home Equity Conversion & Rate Refi',
  icon: DollarSign,
  color: 'text-emerald-400',
  cfgCode: '502002',
  splunkIndex: 'home_lending_refi_logs',
  targetUrl: 'https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate',

  // Flow-Specific Microservice Pipeline Stages
  stages: [
    { id: 'PORTAL', name: 'UI Refi Portal', desc: 'AOA Refinance Web Frontend & Pre-Submission Validation', icon: 'FileText', color: '#10b981' },
    { id: 'REFI_ADAPTER', name: 'Refinance Ingestion Adapter', desc: 'Existing Loan Verification & Rate Lock Payload Ingestion', icon: 'ShieldCheck', color: '#059669' },
    { id: 'TITLE_PAYOFF_SERVICE', name: 'Title & Payoff Verification', desc: 'Current Mortgage Payoff Statement & Title Search Validation', icon: 'AlertTriangle', color: '#0284c7' },
    { id: 'REFI_UNDERWRITING', name: 'Refinance Automated Underwriting', desc: 'Rate-and-Term vs Cash-Out Underwriting & DTI Re-Calculation', icon: 'Cpu', color: '#8b5cf6' },
    { id: 'CLOSING_DISBURSEMENT', name: 'Refinance Closing & Settlement', desc: 'Existing Lien Payoff Settlement & Cash-Out Funds Disbursement', icon: 'CheckCircle2', color: '#34d399' }
  ],

  // Flow-Specific Default JSON Payload Schema
  defaultPayload: {
    division: "Home Lending Division",
    originationProduct: "Refinance Mortgage",
    cfgCode: "502002",
    originationChannel: "WEB_OAO_PORTAL",
    existingLoanDetails: {
      currentMortgageLender: "Chase Home Lending",
      existingLoanNumber: "LN-9920148-NY",
      currentMortgageBalanceUSD: 320000,
      existingInterestRatePercent: 6.75,
      currentMonthlyPaymentUSD: 2450
    },
    refinanceTerms: {
      requestedRefinanceType: "CASH_OUT", // "RATE_AND_TERM" | "CASH_OUT"
      cashOutAmountRequestedUSD: 50000,
      newLoanAmountUSD: 370000,
      newAmortizationYears: 30,
      newTargetInterestRatePercent: 5.25
    },
    underwritingRules: {
      maxCashOutLtvPercent: 80.0,
      titlePayoffRequired: true,
      autoApproveEligible: true,
      minCreditScore: 700
    },
    telemetryTracking: {
      uiSessionId: "SESS-REFI-441209",
      preSubmissionValidated: true
    }
  },

  // Flow-Specific Playwright Automation Configuration
  playwrightConfig: {
    steps: [
      { step: 1, name: 'Landing & Start Application', selector: 'button:has-text("Start")', action: 'click' },
      { step: 2, name: 'Select Refinance Option', selector: 'label:has-text("Refinance"), input[value="refinance"]', action: 'check' },
      { step: 3, name: 'Fill Existing Loan & Cashout Info', selector: 'form input', action: 'fill_form' },
      { step: 4, name: 'Submit Refinance Application', selector: 'button[type="submit"]', action: 'submit' }
    ]
  }
};
