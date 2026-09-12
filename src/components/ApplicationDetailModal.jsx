import React, { useState } from 'react';
import { E2E_STATUSES, MICROSERVICE_STAGES, MSG_STATUSES } from '../data/mockApplications';
import { X, CheckCircle2, AlertTriangle, Clock, Radio, Terminal, Copy, Check, ShieldAlert, Cpu } from 'lucide-react';

export default function ApplicationDetailModal({ application, onClose, onRepublish }) {
  if (!application) return null;

  const [activeTab, setActiveTab] = useState('TIMELINE'); // 'TIMELINE' | 'SPLUNK_LOGS'
  const [copiedPayloadId, setCopiedPayloadId] = useState(null);

  const statusMeta = E2E_STATUSES[application.e2eStatus] || E2E_STATUSES.IN_PROGRESS;

  const handleCopy = (data, key) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    setCopiedPayloadId(key);
    setTimeout(() => setCopiedPayloadId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-extrabold text-white font-mono">{application.id}</h2>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusMeta.badge}`}>
                {statusMeta.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Division: <span className="text-purple-400 font-semibold">Home Lending Division</span> • Origination Type: <span className="text-white font-medium">{application.appType}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* E2E Lifecycle Stage Stepper Bar */}
        <div className="p-6 border-b border-gray-800/80 bg-slate-950/50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            End-to-End Microservice Stage Completion
          </div>
          
          <div className="grid grid-cols-5 gap-2 relative">
            {MICROSERVICE_STAGES.map((stg, i) => {
              const isCompleted = application.hops.some(h => h.stage === stg.id && h.msgStatus !== 'FAILED');
              const isFailedStage = application.hops.some(h => h.stage === stg.id && h.msgStatus === 'FAILED');
              const isCurrent = application.currentStage === stg.id;

              return (
                <div key={stg.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border mb-2 transition-all ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/20' :
                      isFailedStage ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' :
                      isCurrent ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-900 text-gray-600 border-gray-800'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                     isFailedStage ? <AlertTriangle className="w-4 h-4" /> : (i + 1)}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-200 line-clamp-1">{stg.name}</span>
                  <span className="text-[9px] text-gray-400">{stg.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 border-b border-gray-800 flex space-x-6 text-xs font-semibold text-gray-400">
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'TIMELINE' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-200'
            }`}
          >
            Inter-Service Message Timeline ({application.hops.length} hops)
          </button>
          <button
            onClick={() => setActiveTab('SPLUNK_LOGS')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'SPLUNK_LOGS' ? 'border-emerald-500 text-white' : 'border-transparent hover:text-gray-200'
            }`}
          >
            Raw Splunk Telemetry Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[420px] overflow-y-auto">
          {activeTab === 'TIMELINE' ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
              {application.hops.map((hop, index) => {
                const statusConfig = MSG_STATUSES[hop.msgStatus] || MSG_STATUSES.PUBLISHED;

                return (
                  <div key={index} className="relative group">
                    {/* Timeline Bullet */}
                    <div className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
                      hop.msgStatus === 'FAILED' ? 'border-rose-500 text-rose-500' :
                      hop.msgStatus === 'RECEIVED' ? 'border-emerald-500 text-emerald-500' : 'border-blue-500 text-blue-500'
                    }`} />

                    {/* Timeline Hop Card */}
                    <div className={`p-4 rounded-xl border ${
                      hop.msgStatus === 'FAILED' ? 'bg-rose-950/20 border-rose-500/30' : 'bg-slate-900/90 border-gray-800'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border mr-2 ${statusConfig.bg}`}>
                            {hop.msgStatus}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">{hop.topic}</span>
                        </div>
                        <div className="text-right text-[11px] text-gray-400 font-mono">
                          {hop.latencyMs}ms • {new Date(hop.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mb-2">
                        Microservice: <span className="text-white font-mono">{hop.service}</span> ({hop.stage})
                      </div>

                      {/* UI Layer Pre-Submission Sub-API Breakdown */}
                      {hop.stage === 'PORTAL' && (
                        <div className="mb-3 p-3 rounded-lg bg-slate-950 border border-blue-500/30 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-blue-300 mb-1.5">
                            <span>UI Layer Pre-Submission API Trace</span>
                            <span className="text-[10px] font-mono text-gray-400">Origination Frontend Calls</span>
                          </div>
                          <div className="space-y-1 font-mono text-[10px]">
                            <div className="flex justify-between items-center text-gray-300">
                              <span>1. POST /api/v1/aoa/session/initiate</span>
                              <span className="text-emerald-400 font-bold">200 OK (45ms)</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                              <span>2. POST /api/v1/aoa/customer/verify-type</span>
                              <span className="text-emerald-400 font-bold">200 OK (80ms)</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                              <span>3. POST /api/v1/aoa/pii/verify-ssn</span>
                              {hop.msgStatus === 'FAILED' ? (
                                <span className="text-rose-400 font-bold">504 Gateway Timeout (5400ms)</span>
                              ) : (
                                <span className="text-emerald-400 font-bold">200 OK (110ms)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {hop.error && (
                        <div className="mb-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                          <span className="font-bold">Failure DLQ:</span> {hop.error}
                        </div>
                      )}

                      {/* Payload JSON */}
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mb-1">
                          <span>Payload</span>
                          <button
                            onClick={() => handleCopy(hop.payload, index)}
                            className="text-gray-400 hover:text-white flex items-center space-x-1"
                          >
                            {copiedPayloadId === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPayloadId === index ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded bg-slate-950 border border-gray-800 text-[10px] font-mono text-emerald-400 overflow-x-auto">
                          {JSON.stringify(hop.payload, null, 2)}
                        </pre>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Splunk Logs */
            <div className="space-y-3 font-mono text-[11px]">
              {application.hops.map((hop, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-gray-800 text-gray-300">
                  <span className="text-emerald-400">{new Date(hop.timestamp).toISOString()}</span>{' '}
                  <span className="text-gray-400">host=</span><span className="text-white font-bold">{hop.service}</span>{' '}
                  <span className="text-gray-400">sourcetype=</span>app_telemetry{' '}
                  <span className="text-gray-400">application_id=</span><span className="text-amber-400 font-bold">{application.id}</span>{' '}
                  <span className="text-gray-400">stage=</span>{hop.stage}{' '}
                  <span className="text-gray-400">msg_status=</span>
                  <span className={hop.msgStatus === 'FAILED' ? 'text-rose-400 font-bold' : 'text-blue-400'}>
                    {hop.msgStatus}
                  </span>{' '}
                  <span className="text-gray-400">e2e_status=</span>{application.e2eStatus}
                  {hop.error && <div className="text-rose-400 mt-1 pl-4 border-l-2 border-rose-500">DLQ_ERROR: {hop.error}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-slate-900/60 flex justify-between items-center text-xs">
          <span className="text-gray-400 font-mono">
            Total Turnaround Duration: <span className="text-white font-bold">{application.totalDurationMs}ms</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
