import { purchaseMortgageConfig } from './purchaseMortgageConfig';
import { refinanceMortgageConfig } from './refinanceMortgageConfig';
import { helocLineOfCreditConfig } from './helocLineOfCreditConfig';

export const HOME_LENDING_FLOWS = [
  purchaseMortgageConfig,
  refinanceMortgageConfig,
  helocLineOfCreditConfig
];

export const getHomeLendingFlowById = (flowId) => {
  if (!flowId) return purchaseMortgageConfig;
  const f = HOME_LENDING_FLOWS.find(flow => 
    flow.id.toLowerCase() === flowId.toLowerCase() || 
    flow.label.toLowerCase() === flowId.toLowerCase()
  );
  return f || purchaseMortgageConfig;
};

export const getFlowStagesForApplication = (appType) => {
  const flow = getHomeLendingFlowById(appType);
  return flow.stages;
};

export const getFlowDefaultPayload = (appType) => {
  const flow = getHomeLendingFlowById(appType);
  return flow.defaultPayload;
};

export const getFlowSplunkIndex = (appType) => {
  const flow = getHomeLendingFlowById(appType);
  return flow.splunkIndex;
};
