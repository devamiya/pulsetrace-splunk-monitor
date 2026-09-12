import { getFlowDefaultPayload } from '../config/homeLending/homeLendingRegistry';

export const MICROSERVICE_STAGES = [
  { id: 'PORTAL', name: '1. UI Origination', desc: 'UI Origination Layer & Application Initiated', icon: 'FileText', color: '#3b82f6', splunkIndex: 'index=ui_origination_logs' },
  { id: 'ADAPTER', name: '2. Flow Adapter', desc: 'Flow Adapter & Protocol Transformation Layer', icon: 'ShieldCheck', color: '#8b5cf6', splunkIndex: 'index=adapter_service_logs' },
  { id: 'RISK_FRAUD', name: '3. Risk & Fraud', desc: 'Sanction Check & AML Fraud Scoring', icon: 'AlertTriangle', color: '#ec4899', splunkIndex: 'index=risk_fraud_logs' },
  { id: 'UNDERWRITING', name: '4. Underwriting', desc: 'Automated Loan Underwriting & Policy Decision', icon: 'Cpu', color: '#eab308', splunkIndex: 'index=decision_engine_logs' },
  { id: 'DISBURSEMENT', name: '5. Disbursement', desc: 'Account Settlement & Audit Provisioning', icon: 'CheckCircle2', color: '#10b981', splunkIndex: 'index=disbursement_audit_logs' }
];

export const E2E_STATUSES = {
  PROCESSED_SUCCESS: { label: 'Fully Processed (E2E)', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', hex: '#10b981' },
  IN_PROGRESS: { label: 'In Progress', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', hex: '#f59e0b' },
  E2E_FAILED: { label: 'E2E Failed', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30', hex: '#f43f5e' },
  SLA_TIMED_OUT: { label: 'SLA Exceeded', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', hex: '#a855f7' }
};

export const MSG_STATUSES = {
  PUBLISHED: { label: 'PUBLISHED', color: '#3b82f6', bg: 'bg-blue-500/20 text-blue-300' },
  RECEIVED: { label: 'RECEIVED', color: '#10b981', bg: 'bg-emerald-500/20 text-emerald-300' },
  FAILED: { label: 'FAILED', color: '#f43f5e', bg: 'bg-rose-500/20 text-rose-300' }
};

export const INITIAL_APPLICATIONS = [
  {
    id: 'APP-9021',
    appType: 'Purchase Mortgage',
    submissionTime: new Date(Date.now() - 1200000).toISOString(),
    e2eStatus: 'PROCESSED_SUCCESS',
    currentStage: 'LOAN_DISBURSEMENT',
    progressPercent: 100,
    totalDurationMs: 1420,
    hops: [
      { stage: 'PORTAL', service: 'portal-ui-v2', msgStatus: 'PUBLISHED', topic: 'app.submitted', timestamp: new Date(Date.now() - 1200000).toISOString(), latencyMs: 120, payload: { app_id: 'APP-9021', status: 'SUBMITTED', ...getFlowDefaultPayload('Purchase Mortgage') } },
      { stage: 'PURCHASE_ADAPTER', service: 'purchase-adapter-service', msgStatus: 'RECEIVED', topic: 'app.submitted', timestamp: new Date(Date.now() - 1199880).toISOString(), latencyMs: 45, payload: { app_id: 'APP-9021', validated: true } },
      { stage: 'PURCHASE_ADAPTER', service: 'purchase-adapter-service', msgStatus: 'PUBLISHED', topic: 'app.purchase_normalized', timestamp: new Date(Date.now() - 1199800).toISOString(), latencyMs: 80, payload: { app_id: 'APP-9021', event: 'PURCHASE_NORMALIZED' } },
      { stage: 'CREDIT_RISK_FRAUD', service: 'fraud-shield-service', msgStatus: 'RECEIVED', topic: 'app.purchase_normalized', timestamp: new Date(Date.now() - 1199720).toISOString(), latencyMs: 310, payload: { app_id: 'APP-9021', fraud_score: 12, risk_level: 'LOW' } },
      { stage: 'CREDIT_RISK_FRAUD', service: 'fraud-shield-service', msgStatus: 'PUBLISHED', topic: 'app.risk_passed', timestamp: new Date(Date.now() - 1199410).toISOString(), latencyMs: 90, payload: { app_id: 'APP-9021', decision: 'PASS' } },
      { stage: 'PURCHASE_UNDERWRITING', service: 'purchase-underwrite-core', msgStatus: 'RECEIVED', topic: 'app.risk_passed', timestamp: new Date(Date.now() - 1199320).toISOString(), latencyMs: 450, payload: { app_id: 'APP-9021', maxLtvRatioPercent: 80.0, ltv_approved: true } },
      { stage: 'PURCHASE_UNDERWRITING', service: 'purchase-underwrite-core', msgStatus: 'PUBLISHED', topic: 'app.purchase_approved', timestamp: new Date(Date.now() - 1198870).toISOString(), latencyMs: 85, payload: { app_id: 'APP-9021', approved: true } },
      { stage: 'LOAN_DISBURSEMENT', service: 'closing-escrow-service', msgStatus: 'RECEIVED', topic: 'app.purchase_approved', timestamp: new Date(Date.now() - 1198785).toISOString(), latencyMs: 240, payload: { app_id: 'APP-9021', escrow_account_created: true, settlement_ref: 'TXN-PURCHASE-8849' } }
    ]
  },
  {
    id: 'APP-9022',
    appType: 'Refinance Mortgage',
    submissionTime: new Date(Date.now() - 850000).toISOString(),
    e2eStatus: 'E2E_FAILED',
    currentStage: 'TITLE_PAYOFF_SERVICE',
    progressPercent: 60,
    totalDurationMs: 4200,
    hops: [
      { stage: 'PORTAL', service: 'portal-ui-v2', msgStatus: 'PUBLISHED', topic: 'app.submitted', timestamp: new Date(Date.now() - 850000).toISOString(), latencyMs: 140, payload: { app_id: 'APP-9022', status: 'SUBMITTED', ...getFlowDefaultPayload('Refinance Mortgage') } },
      { stage: 'REFI_ADAPTER', service: 'refi-adapter-service', msgStatus: 'RECEIVED', topic: 'app.submitted', timestamp: new Date(Date.now() - 849860).toISOString(), latencyMs: 50, payload: { app_id: 'APP-9022', validated: true } },
      { stage: 'REFI_ADAPTER', service: 'refi-adapter-service', msgStatus: 'PUBLISHED', topic: 'app.refi_normalized', timestamp: new Date(Date.now() - 849810).toISOString(), latencyMs: 95, payload: { app_id: 'APP-9022', event: 'REFI_NORMALIZED' } },
      { stage: 'TITLE_PAYOFF_SERVICE', service: 'title-search-service', msgStatus: 'FAILED', topic: 'app.refi_normalized', timestamp: new Date(Date.now() - 849715).toISOString(), latencyMs: 3915, error: 'Title Payoff Gateway Connection Timeout after 3 retries. Routed to DLQ.', dlqTopic: 'dlq.refi.title_payoff_failed', payload: { app_id: 'APP-9022', exception: 'SocketTimeoutException: title-search-gateway.internal' } }
    ]
  },
  {
    id: 'APP-9023',
    appType: 'Heloc Line of Credit',
    submissionTime: new Date(Date.now() - 300000).toISOString(),
    e2eStatus: 'IN_PROGRESS',
    currentStage: 'EQUITY_LTV_UNDERWRITING',
    progressPercent: 75,
    totalDurationMs: 980,
    hops: [
      { stage: 'PORTAL', service: 'portal-ui-v2', msgStatus: 'PUBLISHED', topic: 'app.submitted', timestamp: new Date(Date.now() - 300000).toISOString(), latencyMs: 110, payload: { app_id: 'APP-9023', status: 'SUBMITTED', ...getFlowDefaultPayload('Heloc Line of Credit') } },
      { stage: 'HELOC_ADAPTER', service: 'heloc-adapter-service', msgStatus: 'RECEIVED', topic: 'app.submitted', timestamp: new Date(Date.now() - 299890).toISOString(), latencyMs: 40, payload: { app_id: 'APP-9023', validated: true } },
      { stage: 'HELOC_ADAPTER', service: 'heloc-adapter-service', msgStatus: 'PUBLISHED', topic: 'app.heloc_normalized', timestamp: new Date(Date.now() - 299850).toISOString(), latencyMs: 75, payload: { app_id: 'APP-9023', event: 'HELOC_NORMALIZED' } },
      { stage: 'APPRAISAL_VALUATION_SERVICE', service: 'avm-valuation-engine', msgStatus: 'RECEIVED', topic: 'app.heloc_normalized', timestamp: new Date(Date.now() - 299775).toISOString(), latencyMs: 280, payload: { app_id: 'APP-9023', avm_value_usd: 650000, valuation_confidence: 0.96 } },
      { stage: 'APPRAISAL_VALUATION_SERVICE', service: 'avm-valuation-engine', msgStatus: 'PUBLISHED', topic: 'app.heloc_valuation_passed', timestamp: new Date(Date.now() - 299495).toISOString(), latencyMs: 85, payload: { app_id: 'APP-9023', decision: 'PASS' } },
      { stage: 'EQUITY_LTV_UNDERWRITING', service: 'equity-underwrite-core', msgStatus: 'RECEIVED', topic: 'app.heloc_valuation_passed', timestamp: new Date(Date.now() - 299410).toISOString(), latencyMs: 390, payload: { app_id: 'APP-9023', cltv_percent: 62.5, status: 'EVALUATING_MARGIN_RATES' } }
    ]
  }
];
