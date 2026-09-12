import { getFlowSplunkIndex, getFlowDefaultPayload } from '../config/homeLending/homeLendingRegistry';

export class SplunkEngine {
  constructor(config = {}) {
    this.host = config.host || 'https://splunk-cluster.corp.internal:8089';
    this.token = config.token || 'Bearer splunk-sec-token-9912';
    this.index = config.index || 'index=enterprise_apps';
    this.sourcetype = config.sourcetype || 'sourcetype=app_telemetry';
    this.mode = config.mode || 'SIMULATED'; // 'SIMULATED' | 'LIVE_REST'
  }

  // Convert application objects into raw Splunk log events tagged by microservice index
  exportToSplunkLogs(applications) {
    const stageIndexMap = {
      PORTAL: 'ui_origination_logs',
      PURCHASE_ADAPTER: 'home_lending_purchase_logs',
      REFI_ADAPTER: 'home_lending_refi_logs',
      HELOC_ADAPTER: 'home_lending_heloc_logs',
      CREDIT_RISK_FRAUD: 'risk_fraud_logs',
      PURCHASE_UNDERWRITING: 'decision_engine_logs',
      REFI_UNDERWRITING: 'decision_engine_logs',
      EQUITY_LTV_UNDERWRITING: 'decision_engine_logs',
      LOAN_DISBURSEMENT: 'disbursement_audit_logs',
      CLOSING_DISBURSEMENT: 'disbursement_audit_logs',
      CARD_CHECKBOOK_DISBURSEMENT: 'disbursement_audit_logs'
    };

    const logs = [];
    applications.forEach(app => {
      const flowIndex = getFlowSplunkIndex(app.appType);

      app.hops.forEach(hop => {
        const microserviceIndex = stageIndexMap[hop.stage] || flowIndex || 'enterprise_apps';
        const logObj = {
          _time: hop.timestamp,
          host: hop.service,
          source: `/var/log/${hop.service}.log`,
          sourcetype: 'app_telemetry',
          index: microserviceIndex,
          application_id: app.id,
          applicant: app.applicantName,
          app_type: app.appType,
          amount: app.amount,
          e2e_status: app.e2eStatus,
          stage: hop.stage,
          service: hop.service,
          msg_status: hop.msgStatus,
          topic: hop.topic,
          latency_ms: hop.latencyMs,
          error: hop.error || null,
          dlq_topic: hop.dlqTopic || null,
          raw_json: JSON.stringify({
            app_id: app.id,
            index: microserviceIndex,
            e2e_status: app.e2eStatus,
            stage: hop.stage,
            msg_status: hop.msgStatus,
            payload: hop.payload
          })
        };
        logs.push(logObj);
      });
    });
    // Sort reverse chronological
    return logs.sort((a, b) => new Date(b._time) - new Date(a._time));
  }

  // Simple SPL (Splunk Processing Language) Query Evaluator
  executeSPL(splQuery, applications) {
    const logs = this.exportToSplunkLogs(applications);
    const query = splQuery.trim();

    // Default return all logs formatted
    let filteredLogs = [...logs];

    // Filter by specific Microservice Index (e.g. index=ui_origination_logs or index=adapter_service_logs)
    const indexMatch = query.match(/index=([a-z0-9_*]+)/i);
    if (indexMatch && indexMatch[1] && indexMatch[1] !== '*' && indexMatch[1] !== 'all' && indexMatch[1] !== 'enterprise_apps') {
      const targetIdx = indexMatch[1].toLowerCase();
      filteredLogs = filteredLogs.filter(l => l.index.toLowerCase().includes(targetIdx));
    }

    // Filter by search terms (e.g. search msg_status="FAILED" or search e2e_status="PROCESSED_SUCCESS")
    if (query.includes('msg_status="FAILED"') || query.includes('msg_status=FAILED')) {
      filteredLogs = filteredLogs.filter(l => l.msg_status === 'FAILED');
    } else if (query.includes('msg_status="PUBLISHED"')) {
      filteredLogs = filteredLogs.filter(l => l.msg_status === 'PUBLISHED');
    } else if (query.includes('msg_status="RECEIVED"')) {
      filteredLogs = filteredLogs.filter(l => l.msg_status === 'RECEIVED');
    }

    if (query.includes('e2e_status="PROCESSED_SUCCESS"') || query.includes('PROCESSED_SUCCESS')) {
      filteredLogs = filteredLogs.filter(l => l.e2e_status === 'PROCESSED_SUCCESS');
    } else if (query.includes('e2e_status="E2E_FAILED"') || query.includes('E2E_FAILED')) {
      filteredLogs = filteredLogs.filter(l => l.e2e_status === 'E2E_FAILED');
    } else if (query.includes('e2e_status="IN_PROGRESS"')) {
      filteredLogs = filteredLogs.filter(l => l.e2e_status === 'IN_PROGRESS');
    }

    // Time range modifier support (e.g. earliest=-15m, earliest=-1h, earliest=-24h, earliest=-7d)
    const earliestMatch = query.match(/earliest=-(\d+)([mhd])/);
    if (earliestMatch) {
      const amount = parseInt(earliestMatch[1], 10);
      const unit = earliestMatch[2];
      let ms = amount * 60 * 1000;
      if (unit === 'h') ms = amount * 60 * 60 * 1000;
      if (unit === 'd') ms = amount * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - ms;

      filteredLogs = filteredLogs.filter(l => new Date(l._time).getTime() >= cutoffTime);
    }

    // Check custom search match string
    const matchMatch = query.match(/(?:application_id|app_id)=["']?([A-Z0-9-]+)["']?/i);
    if (matchMatch && matchMatch[1]) {
      const targetId = matchMatch[1].toUpperCase();
      filteredLogs = filteredLogs.filter(l => l.application_id.toUpperCase().includes(targetId));
    }

    // Aggregations: stats count by field
    if (query.includes('| stats count by')) {
      const fieldMatch = query.match(/stats count by (\w+)/);
      const groupByField = fieldMatch ? fieldMatch[1] : 'stage';
      const statsMap = {};

      filteredLogs.forEach(log => {
        const val = log[groupByField] || 'UNKNOWN';
        statsMap[val] = (statsMap[val] || 0) + 1;
      });

      const tableResult = Object.entries(statsMap).map(([key, count]) => ({
        [groupByField]: key,
        count
      }));

      return {
        type: 'STATS',
        columns: [groupByField, 'count'],
        rows: tableResult,
        totalEvents: filteredLogs.length,
        executedInMs: Math.floor(Math.random() * 25) + 12
      };
    }

    // Table view: | table _time, application_id, stage, msg_status, latency_ms
    return {
      type: 'RAW_EVENTS',
      columns: ['_time', 'application_id', 'stage', 'service', 'msg_status', 'e2e_status', 'latency_ms', 'error'],
      rows: filteredLogs,
      totalEvents: filteredLogs.length,
      executedInMs: Math.floor(Math.random() * 35) + 18
    };
  }

  // Create a new synthetic Home Lending application submission with pre-submission JSON payload
  createNewApplication(unusedName, appType, customPayload) {
    const nextIdNum = Math.floor(Math.random() * 9000) + 1000;
    const appId = `APP-${nextIdNum}`;
    const now = new Date().toISOString();

    const homeLendingTypes = [
      'Purchase Mortgage',
      'Refinance Mortgage',
      'Heloc Line of Credit'
    ];

    const chosenType = appType || homeLendingTypes[Math.floor(Math.random() * homeLendingTypes.length)];
    const defaultFlowPayload = getFlowDefaultPayload(chosenType);

    const initialPayload = customPayload ? {
      app_id: appId,
      status: 'INITIATED_AND_SUBMITTED',
      ...customPayload
    } : {
      app_id: appId,
      status: 'INITIATED_AND_SUBMITTED',
      ...defaultFlowPayload
    };

    return {
      id: appId,
      appType: chosenType,
      submissionTime: now,
      e2eStatus: 'IN_PROGRESS',
      currentStage: 'PORTAL',
      progressPercent: 20,
      totalDurationMs: 120,
      hops: [
        {
          stage: 'PORTAL',
          service: 'portal-ui-v2',
          msgStatus: 'PUBLISHED',
          topic: 'app.submitted',
          timestamp: now,
          latencyMs: 120,
          payload: initialPayload
        }
      ]
    };
  }
}
