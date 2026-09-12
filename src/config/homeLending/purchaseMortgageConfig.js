import { Home } from 'lucide-react';

export const purchaseMortgageConfig = {
  id: 'Purchase Mortgage',
  label: 'Purchase',
  desc: 'Residential Property Purchase Mortgage',
  icon: Home,
  color: 'text-blue-400',
  cfgCode: '502002',
  splunkIndex: 'home_lending_purchase_logs',
  targetUrl: 'https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate',

  // Flow-Specific Microservice Pipeline Stages
  stages: [
    { id: 'PORTAL', name: 'UI Origination Portal', desc: 'AOA Retail Web Frontend & Pre-Submission Validation', icon: 'FileText', color: '#3b82f6' },
    { id: 'PURCHASE_ADAPTER', name: 'Purchase Adapter Service', desc: 'Mortgage Loan Origination Ingestion & Payload Normalization', icon: 'ShieldCheck', color: '#6366f1' },
    { id: 'CREDIT_RISK_FRAUD', name: 'Credit & Risk Fraud Engine', desc: 'SSN Credit Bureau Check & Identity Fraud Verification', icon: 'AlertTriangle', color: '#8b5cf6' },
    { id: 'PURCHASE_UNDERWRITING', name: 'Purchase Underwriting Engine', desc: 'Automated Loan To Value (LTV) & Debt-to-Income (DTI) Decisioning', icon: 'Cpu', color: '#ec4899' },
    { id: 'LOAN_DISBURSEMENT', name: 'Closing & Disbursement', desc: 'Escrow Account Creation & Title Escrow Settlement', icon: 'CheckCircle2', color: '#10b981' }
  ],

  // Flow-Specific Default JSON Payload Schema
  defaultPayload: {
    division: "Home Lending Division",
    originationProduct: "Purchase Mortgage",
    cfgCode: "502002",
    originationChannel: "WEB_OAO_PORTAL",
    propertyDetails: {
      propertyType: "SINGLE_FAMILY_RESIDENTIAL",
      occupancyType: "PRIMARY_RESIDENCE",
      purchasePriceUSD: 575000,
      downPaymentUSD: 115000,
      downPaymentPercent: 20,
      state: "NY",
      zipCode: "10001"
    },
    mortgageTerms: {
      loanAmountUSD: 460000,
      amortizationYears: 30,
      interestRateType: "FIXED_RATE",
      estimatedClosingDays: 30
    },
    underwritingRules: {
      maxLtvRatioPercent: 80.0,
      maxDtiRatioPercent: 43.0,
      minCreditScore: 720,
      autoApproveEligible: true
    },
    telemetryTracking: {
      uiSessionId: "SESS-PURCHASE-882109",
      preSubmissionValidated: true
    }
  },

  // Flow-Specific Playwright Automation Configuration
  playwrightConfig: {
    steps: [
      { step: 1, name: 'Landing & Start Application', selector: 'button:has-text("Start"), button:has-text("Apply")', action: 'click' },
      { step: 2, name: 'Select Product Option', selector: 'label:has-text("Purchase"), input[value="purchase"]', action: 'check' },
      { step: 3, name: 'Fill Borrower Information', selector: 'form input', action: 'fill_form' },
      { step: 4, name: 'Submit Purchase Application', selector: 'button[type="submit"]', action: 'submit' }
    ]
  }
};
