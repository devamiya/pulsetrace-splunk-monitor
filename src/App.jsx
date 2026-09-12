import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_APPLICATIONS, MICROSERVICE_STAGES } from './data/mockApplications';
import { getFlowStagesForApplication } from './config/homeLending/homeLendingRegistry';
import { SplunkEngine } from './services/splunkSimulator';
import { PlaywrightRunner, TARGET_APPLICATION_URL } from './services/playwrightRunner';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import ApplicationFlowGraph from './components/ApplicationFlowGraph';
import ApplicationTable from './components/ApplicationTable';
import MessageTelemetryView from './components/MessageTelemetryView';
import SplunkTerminal from './components/SplunkTerminal';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import InitiationDrawer from './components/InitiationDrawer';
import PlaywrightOverlayModal from './components/PlaywrightOverlayModal';

export const TIME_PRESETS = [
  { id: 'ALL', label: 'All Time', durationMs: null },
  { id: '15m', label: 'Last 15m', durationMs: 15 * 60 * 1000 },
  { id: '1h', label: 'Last 1h', durationMs: 60 * 60 * 1000 },
  { id: '24h', label: 'Last 24h', durationMs: 24 * 60 * 60 * 1000 },
  { id: '7d', label: 'Last 7d', durationMs: 7 * 24 * 60 * 60 * 1000 },
];

const splunkEngine = new SplunkEngine();

export default function App() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isLive, setIsLive] = useState(true);
  const [selectedStage, setSelectedStage] = useState(null);
  const [tableFilter, setTableFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('ALL');
  const [inspectApp, setInspectApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Playwright Overlay State
  const [playwrightActiveInfo, setPlaywrightActiveInfo] = useState(null);
  const [isPlaywrightPaused, setIsPlaywrightPaused] = useState(false);
  const [isPlaywrightMinimized, setIsPlaywrightMinimized] = useState(false);
  const runnerRef = useRef(null);

  // Live simulation loop for pipeline processing & microservice hops
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setApplications(prevApps => {
        let hasChanges = false;
        
        const updated = prevApps.map(app => {
          if (app.e2eStatus !== 'IN_PROGRESS') return app;

          hasChanges = true;
          const flowStages = getFlowStagesForApplication(app.appType) || MICROSERVICE_STAGES;
          const currentStageIdx = flowStages.findIndex(s => s.id === app.currentStage);
          const validStageIdx = currentStageIdx >= 0 ? currentStageIdx : 0;
          const currentStageObj = flowStages[validStageIdx] || flowStages[0];
          const now = new Date().toISOString();

          // Check if we should fail or advance
          const isRandomFailure = Math.random() < 0.08;

          if (isRandomFailure) {
            const failStage = flowStages[validStageIdx] || flowStages[0];
            const isAoaStage = failStage.id === 'PORTAL';

            const failedHop = {
              stage: failStage.id,
              service: isAoaStage ? 'aoa-ui-layer' : `${failStage.id.toLowerCase()}-service`,
              msgStatus: 'FAILED',
              topic: isAoaStage ? 'aoa.pre_submit_api_failed' : `app.${failStage.id.toLowerCase()}`,
              timestamp: now,
              latencyMs: Math.floor(Math.random() * 2000) + 1500,
              error: isAoaStage 
                ? 'AOA Pre-Submission API Failed: POST /api/v1/aoa/pii/verify-ssn returned 504 Gateway Timeout (SSN Verification Microservice Unreachable)' 
                : `Downstream Timeout on ${failStage.name} endpoint. Retries exceeded.`,
              dlqTopic: isAoaStage ? 'dlq.aoa.api_failed' : `dlq.${failStage.id.toLowerCase()}`,
              payload: isAoaStage ? {
                app_id: app.id,
                step: 'STEP_3_PII_FILL',
                failed_endpoint: '/api/v1/aoa/pii/verify-ssn',
                http_status: 504,
                exception: 'GatewayTimeoutException: ssn-validation-service.internal timed out after 5000ms'
              } : { app_id: app.id, exception: 'ServiceUnavailableException: 503' }
            };

            return {
              ...app,
              e2eStatus: 'E2E_FAILED',
              totalDurationMs: app.totalDurationMs + failedHop.latencyMs,
              hops: [...app.hops, failedHop]
            };
          }

          // Advance to next stage if available
          if (validStageIdx < flowStages.length - 1) {
            const nextStage = flowStages[validStageIdx + 1];
            const recvLatency = Math.floor(Math.random() * 100) + 20;
            const pubLatency = Math.floor(Math.random() * 250) + 80;

            const recvHop = {
              stage: nextStage.id,
              service: `${nextStage.id.toLowerCase()}-service`,
              msgStatus: 'RECEIVED',
              topic: `app.${currentStageObj.id.toLowerCase()}_passed`,
              timestamp: now,
              latencyMs: recvLatency,
              payload: { app_id: app.id, stage: nextStage.id, event: 'RECEIVED_FROM_BROKER' }
            };

            const pubHop = {
              stage: nextStage.id,
              service: `${nextStage.id.toLowerCase()}-service`,
              msgStatus: 'PUBLISHED',
              topic: `app.${nextStage.id.toLowerCase()}_passed`,
              timestamp: new Date(Date.now() + recvLatency).toISOString(),
              latencyMs: pubLatency,
              payload: { app_id: app.id, stage: nextStage.id, event: 'STAGE_PROCESSED_SUCCESS' }
            };

            const isFinalStage = validStageIdx + 1 === flowStages.length - 1;
            const newProgress = Math.round(((validStageIdx + 2) / flowStages.length) * 100);

            if (isFinalStage) {
              // E2E Completion reached cleanly
            }

            return {
              ...app,
              currentStage: nextStage.id,
              e2eStatus: isFinalStage ? 'PROCESSED_SUCCESS' : 'IN_PROGRESS',
              progressPercent: newProgress,
              totalDurationMs: app.totalDurationMs + recvLatency + pubLatency,
              hops: [...app.hops, recvHop, pubHop]
            };
          }

          return app;
        });

        // 10% chance of auto generating synthetic applications
        if (Math.random() < 0.10 && prevApps.length < 25) {
          const newApp = splunkEngine.createNewApplication();
          return [newApp, ...updated];
        }

        return hasChanges ? updated : prevApps;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Handle Home Lending application initiation (Single or Batch Multi-Type with Custom JSON Payload)
  const handleCreateNewApp = ({ appType, cfgCode, isBatch, batchTypes, customPayload, usePlaywright = true, openDesktopBrowser = true }) => {
    if (isBatch && batchTypes && batchTypes.length > 0) {
      // Generate applications for ALL Home Lending application types simultaneously into telemetry system
      const newApps = batchTypes.map(tObj => splunkEngine.createNewApplication(null, tObj.id, customPayload));
      setApplications(prev => [...newApps, ...prev]);
      setActiveTab('OVERVIEW');

      // Only open real desktop Chromium window if openDesktopBrowser is true
      if (openDesktopBrowser) {
        const primaryTarget = batchTypes[0];
        fetch('http://localhost:3001/api/run-playwright', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appType: primaryTarget.id, cfgCode: primaryTarget.cfgCode, customPayload })
        }).catch(e => {});
      }

      // Always open overlay modal and step runner behind the scenes
      setIsPlaywrightMinimized(false);
      setIsPlaywrightPaused(false);
      setPlaywrightActiveInfo(null);

      const runner = new PlaywrightRunner(
        (info) => { setPlaywrightActiveInfo(info); },
        () => { 
          setActiveTab('OVERVIEW');
          setTimeout(() => {
            setPlaywrightActiveInfo(null);
          }, 800);
        }
      );
      runnerRef.current = runner;
      runner.runTest({ appType: batchTypes[0].id });
    } else {
      const newApp = splunkEngine.createNewApplication(null, appType, customPayload);
      setApplications(prev => [newApp, ...prev]);
      setActiveTab('OVERVIEW');

      // Only open real desktop Chromium window if openDesktopBrowser is true
      if (openDesktopBrowser) {
        fetch('http://localhost:3001/api/run-playwright', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appType, cfgCode, customPayload })
        }).catch(e => {});
      }

      // Always open overlay modal and step runner behind the scenes
      setIsPlaywrightMinimized(false);
      setIsPlaywrightPaused(false);
      setPlaywrightActiveInfo(null);

      const runner = new PlaywrightRunner(
        (info) => { setPlaywrightActiveInfo(info); },
        () => {
          setActiveTab('OVERVIEW');
          setTimeout(() => {
            setPlaywrightActiveInfo(null);
          }, 800);
        }
      );
      runnerRef.current = runner;
      runner.runTest({ appType });
    }
  };

  const handleTogglePlaywrightPause = () => {
    if (runnerRef.current) {
      runnerRef.current.togglePause();
      setIsPlaywrightPaused(!isPlaywrightPaused);
    }
  };

  // Handle message re-publish trigger
  const handleRepublishMessage = (failedHop) => {
    setApplications(prev => {
      return prev.map(app => {
        if (app.id === failedHop.appId) {
          const now = new Date().toISOString();
          const retryHop = {
            stage: failedHop.stage,
            service: failedHop.service,
            msgStatus: 'PUBLISHED',
            topic: failedHop.topic,
            timestamp: now,
            latencyMs: 140,
            payload: { app_id: app.id, action: 'MANUAL_RETRY_PUBLISH_SUCCESS' }
          };

          return {
            ...app,
            e2eStatus: 'IN_PROGRESS',
            hops: [...app.hops, retryHop]
          };
        }
        return app;
      });
    });
  };

  // Handle editing application values
  const handleSaveEditedApp = (updatedApp) => {
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
  };

  // Filter applications dynamically based on active global timeRange
  const activeTimePreset = TIME_PRESETS.find(p => p.id === timeRange);
  const timeCutoffMs = activeTimePreset && activeTimePreset.durationMs ? Date.now() - activeTimePreset.durationMs : null;

  const displayedApplications = applications.filter(app => {
    if (!timeCutoffMs) return true;
    const t = new Date(app.submissionTime).getTime();
    return t >= timeCutoffMs;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        setIsLive={setIsLive}
        onNewAppClick={() => setShowNewModal(true)}
        splunkMode={splunkEngine.mode}
        appCount={displayedApplications.length}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top KPI Metric Cards */}
        <KPICards
          applications={displayedApplications}
          activeFilter={activeTab === 'MESSAGES' ? 'MESSAGES' : tableFilter}
          onFilterSelect={(filterKey) => {
            if (filterKey === 'MESSAGES') {
              setActiveTab('MESSAGES');
            } else {
              setTableFilter(filterKey);
              setActiveTab('APPLICATIONS');
            }
          }}
        />

        {/* View Switcher Content */}
        {activeTab === 'OVERVIEW' && (
          <>
            <ApplicationFlowGraph
              applications={displayedApplications}
              selectedStage={selectedStage}
              setSelectedStage={setSelectedStage}
            />

            <ApplicationTable
              applications={selectedStage ? displayedApplications.filter(a => a.currentStage === selectedStage) : displayedApplications}
              onSelectApp={(app) => setInspectApp(app)}
              onEditApp={(app) => setEditingApp(app)}
              selectedFilter={tableFilter}
              setSelectedFilter={setTableFilter}
            />
          </>
        )}

        {activeTab === 'APPLICATIONS' && (
          <ApplicationTable
            applications={displayedApplications}
            onSelectApp={(app) => setInspectApp(app)}
            onEditApp={(app) => setEditingApp(app)}
            selectedFilter={tableFilter}
            setSelectedFilter={setTableFilter}
          />
        )}

        {activeTab === 'MESSAGES' && (
          <MessageTelemetryView
            applications={displayedApplications}
            onRepublishMessage={handleRepublishMessage}
          />
        )}

        {activeTab === 'SPLUNK_TERMINAL' && (
          <SplunkTerminal
            splunkEngine={splunkEngine}
            applications={displayedApplications}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-slate-950 py-4 px-6 text-center text-xs text-gray-500">
        PulseTrace Splunk Telemetry Monitor • Distributed Application Lifecycle & Message Queue Flow System
      </footer>

      {/* Modals */}
      {inspectApp && (
        <ApplicationDetailModal
          application={inspectApp}
          onClose={() => setInspectApp(null)}
          onRepublish={handleRepublishMessage}
        />
      )}

      {showNewModal && (
        <InitiationDrawer
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreateNewApp}
        />
      )}

      {/* Playwright Test Execution Overlay Modal */}
      {playwrightActiveInfo && (
        <PlaywrightOverlayModal
          activeStepInfo={playwrightActiveInfo}
          onClose={() => setPlaywrightActiveInfo(null)}
          onTogglePause={handleTogglePlaywrightPause}
          isPaused={isPlaywrightPaused}
          isMinimized={isPlaywrightMinimized}
          setIsMinimized={setIsPlaywrightMinimized}
        />
      )}

    </div>
  );
}
