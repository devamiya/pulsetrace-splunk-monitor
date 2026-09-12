import React, { useState } from 'react';
import { MICROSERVICE_STAGES, MSG_STATUSES } from '../data/mockApplications';
import { getFlowStagesForApplication, HOME_LENDING_FLOWS } from '../config/homeLending/homeLendingRegistry';
import { FileText, ShieldCheck, AlertTriangle, Cpu, CheckCircle2, Radio, Zap, ArrowRight, Home, DollarSign, Banknote } from 'lucide-react';

const ICON_MAP = {
  FileText: FileText,
  ShieldCheck: ShieldCheck,
  AlertTriangle: AlertTriangle,
  Cpu: Cpu,
  CheckCircle2: CheckCircle2
};

export default function ApplicationFlowGraph({ applications, selectedStage, setSelectedStage }) {
  const [activeFlowType, setActiveFlowType] = useState('Purchase Mortgage');

  const displayStages = getFlowStagesForApplication(activeFlowType) || MICROSERVICE_STAGES;

  // Aggregate stats per stage
  const stageStats = displayStages.reduce((acc, stage) => {
    acc[stage.id] = {
      totalHops: 0,
      published: 0,
      received: 0,
      failed: 0,
      activeApps: 0,
      avgLatencyMs: 0,
      latencySum: 0
    };
    return acc;
  }, {});

  applications.forEach(app => {
    if (stageStats[app.currentStage]) {
      stageStats[app.currentStage].activeApps++;
    }
    app.hops.forEach(hop => {
      if (stageStats[hop.stage]) {
        const s = stageStats[hop.stage];
        s.totalHops++;
        if (hop.msgStatus === 'PUBLISHED') s.published++;
        if (hop.msgStatus === 'RECEIVED') s.received++;
        if (hop.msgStatus === 'FAILED') s.failed++;
        s.latencySum += (hop.latencyMs || 0);
      }
    });
  });

  // Calculate averages
  Object.keys(stageStats).forEach(key => {
    const s = stageStats[key];
    if (s.totalHops > 0) {
      s.avgLatencyMs = Math.round(s.latencySum / s.totalHops);
    }
  });

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6 border border-gray-800/80">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Microservice Application Stage & Message Flow Map
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time visual path of applications moving through microservice topologies and broker queues.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"></span>
            <span className="text-gray-300">Received</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block shadow-sm shadow-blue-400/50"></span>
            <span className="text-gray-300">Published</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50 animate-pulse"></span>
            <span className="text-gray-300">Failed (DLQ)</span>
          </div>
        </div>
      </div>

      {/* UI Layer API Failure Alert Banner */}
      {stageStats.PORTAL && stageStats.PORTAL.failed > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 shadow-lg shadow-rose-500/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm flex items-center space-x-2">
                <span>CRITICAL TELEMETRY ALERT: UI Layer API Failures Detected ({stageStats.PORTAL.failed} Failed)</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 text-[10px] font-mono border border-rose-500/40 uppercase">
                  Threshold Exceeded
                </span>
              </div>
              <p className="text-gray-300 text-xs mt-0.5">
                Multiple client-side pre-submission API calls are failing on <code className="font-mono text-rose-300">index=ui_origination_logs</code> before final submission to downstream queues.
              </p>
              <div className="mt-2 text-[11px] font-mono text-gray-400 bg-slate-950/80 p-2 rounded border border-gray-800 flex items-center justify-between">
                <span>SPL Alert: <span className="text-emerald-400">index=ui_origination_logs msg_status="FAILED" earliest=-5m | stats count by topic | where count &gt;= 2</span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flow Selector Pills for Separate Pipeline Topologies */}
      <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-gray-800/80 text-xs">
        <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">Inspect Flow Pipeline:</span>
        {HOME_LENDING_FLOWS.map((flow) => {
          const isActive = activeFlowType === flow.id;
          return (
            <button
              key={flow.id}
              onClick={() => {
                setActiveFlowType(flow.id);
                setSelectedStage(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-slate-900 text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{flow.label} Pipeline</span>
              <span className="text-[9px] font-mono opacity-70">({flow.cfgCode})</span>
            </button>
          );
        })}
      </div>

      {/* Stage Nodes Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {displayStages.map((stage, idx) => {
          const IconComponent = ICON_MAP[stage.icon] || FileText;
          const stats = stageStats[stage.id] || {};
          const isSelected = selectedStage === stage.id;
          const isLast = idx === displayStages.length - 1;

          return (
            <div key={stage.id} className="relative flex flex-col justify-between">
              
              {/* Node Card */}
              <div
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-xl shadow-blue-500/20'
                    : 'bg-slate-900/90 border-gray-800 hover:border-gray-700 hover:bg-slate-800/80'
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-inner"
                    style={{ backgroundColor: `${stage.color}15`, borderColor: `${stage.color}40`, color: stage.color }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  {/* Active App Badge */}
                  {stats.activeApps > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                      {stats.activeApps} Active
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white mb-0.5">{stage.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-1 mb-3">{stage.desc}</p>

                {/* Message Flow Counters */}
                <div className="space-y-1.5 pt-3 border-t border-gray-800/80 text-xs">
                  {stage.id === 'PORTAL' ? (
                    <>
                      <div className="flex justify-between items-center text-gray-300">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <Radio className="w-3 h-3 mr-1 text-emerald-400" /> Initiated
                        </span>
                        <span className="font-semibold text-emerald-400">{applications.length}</span>
                      </div>

                      <div className="flex justify-between items-center text-gray-300">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <Radio className="w-3 h-3 mr-1 text-blue-400" /> Submitted
                        </span>
                        <span className="font-semibold text-blue-400">{stats.published || applications.length}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> Submission Rate
                        </span>
                        <span className="font-bold text-emerald-400">
                          {applications.length > 0 ? Math.round(((stats.published || applications.length) / applications.length) * 100) : 100}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-gray-300">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <Radio className="w-3 h-3 mr-1 text-emerald-400" /> Received
                        </span>
                        <span className="font-semibold text-emerald-400">{stats.received}</span>
                      </div>

                      <div className="flex justify-between items-center text-gray-300">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <Radio className="w-3 h-3 mr-1 text-blue-400" /> Published
                        </span>
                        <span className="font-semibold text-blue-400">{stats.published}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-400 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1 text-rose-400" /> Failed
                        </span>
                        <span className={`font-bold ${stats.failed > 0 ? 'text-rose-400 glow-rose' : 'text-gray-500'}`}>
                          {stats.failed}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Avg Latency Footer */}
                <div className="mt-3 pt-2 border-t border-gray-800/60 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Avg Hop Latency</span>
                  <span className="font-mono text-gray-300">{stats.avgLatencyMs}ms</span>
                </div>
              </div>

              {/* Connecting Flow Arrow for Desktop */}
              {!isLast && (
                <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900 border border-gray-700 items-center justify-center text-gray-400 shadow-md">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
