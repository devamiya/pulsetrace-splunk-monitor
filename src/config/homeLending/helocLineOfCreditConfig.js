import { Banknote } from 'lucide-react';

export const helocLineOfCreditConfig = {
  id: 'Heloc Line of Credit',
  label: 'Heloc',
  desc: 'Revolving Home Equity Line of Credit',
  icon: Banknote,
  color: 'text-rose-400',
  cfgCode: '502002',
  splunkIndex: 'home_lending_heloc_logs',
  targetUrl: 'https://secure.chase.com/web/oao/application/retail?cfgCode=502002#/origination/gettingStarted/gettingStarted/initiate',

  // Flow-Specific Microservice Pipeline Stages
  stages: [
    { id: 'PORTAL', name: 'UI HELOC Portal', desc: 'AOA Equity Line Web Frontend & Pre-Submission Validation', icon: 'FileText', color: '#f43f5e' },
    { id: 'HELOC_ADAPTER', name: 'HELOC Ingestion Adapter', desc: 'Revolving Credit Line Payload Ingestion & Verification', icon: 'ShieldCheck', color: '#e11d48' },
    { id: 'APPRAISAL_VALUATION_SERVICE', name: 'Property Appraisal & Valuation', desc: 'Automated Valuation Model (AVM) Property Equity Calculation', icon: 'AlertTriangle', color: '#f97316' },
    { id: 'EQUITY_LTV_UNDERWRITING', name: 'HELOC Equity LTV Underwriting', desc: 'Combined LTV (CLTV) & Variable Interest Rate Margin Decisioning', icon: 'Cpu', color: '#be123c' },
    { id: 'CARD_CHECKBOOK_DISBURSEMENT', name: 'Equity Access & Card Issue', desc: 'Revolving Credit Line Activation & Equity Visa Card Dispatch', icon: 'CheckCircle2', color: '#fb7185' }
  ],

  // Flow-Specific Default JSON Payload Schema
  defaultPayload: {
    division: "Home Lending Division",
    originationProduct: "Heloc Line of Credit",
    cfgCode: "502002",
    originationChannel: "WEB_OAO_PORTAL",
    propertyEquityInformation: {
      propertyAddress: "742 Evergreen Terrace, NY 10001",
      estimatedHomeValueUSD: 650000,
      existingFirstMortgageBalanceUSD: 280000,
      calculatedAvailableEquityUSD: 370000
    },
    helocTerms: {
      requestedCreditLineLimitUSD: 125000,
      drawPeriodYears: 10,
      repaymentPeriodYears: 20,
      interestRateStructure: "VARIABLE_PRIME_MARGIN",
      initialDrawAmountUSD: 25000
    },
    underwritingRules: {
      maxCombinedLtvPercent: 85.0,
      avmValuationAccepted: true,
      minCreditScore: 680,
      autoApproveEligible: true
    },
    telemetryTracking: {
      uiSessionId: "SESS-HELOC-119803",
      preSubmissionValidated: true
    }
  },

  // Flow-Specific Playwright Automation Configuration
  playwrightConfig: {
    steps: [
      { step: 1, name: 'Landing & Start Application', selector: 'button:has-text("Start")', action: 'click' },
      { step: 2, name: 'Select HELOC Option', selector: 'label:has-text("Heloc"), input[value="heloc"]', action: 'check' },
      { step: 3, name: 'Fill Home Equity Details', selector: 'form input', action: 'fill_form' },
      { step: 4, name: 'Submit HELOC Application', selector: 'button[type="submit"]', action: 'submit' }
    ]
  }
};
