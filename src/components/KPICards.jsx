import React from 'react';
import { CheckCircle2, AlertTriangle, Radio, Clock, ShieldAlert, ArrowUpRight, TrendingUp, FileText, Activity } from 'lucide-react';

export default function KPICards({ applications, onFilterSelect, activeFilter }) {
  const totalApps = applications.length;
  
  const processedSuccessCount = applications.filter(a => a.e2eStatus === 'PROCESSED_SUCCESS').length;
  const inProgressCount = applications.filter(a => a.e2eStatus === 'IN_PROGRESS').length;
  const failedCount = applications.filter(a => a.e2eStatus === 'E2E_FAILED').length;
  const timedOutCount = applications.filter(a => a.e2eStatus === 'SLA_TIMED_OUT').length;

  const e2eSuccessRate = totalApps > 0 ? Math.round((processedSuccessCount / totalApps) * 100) : 0;

  // Calculate product type breakdown
  const purchaseCount = applications.filter(a => a.appType?.toLowerCase().includes('purchase')).length;
  const refiCount = applications.filter(a => a.appType?.toLowerCase().includes('refinance') || a.appType?.toLowerCase().includes('refi')).length;
  const helocCount = applications.filter(a => a.appType?.toLowerCase().includes('heloc') || a.appType?.toLowerCase().includes('equity')).length;

  // Calculate Average E2E Duration for completed apps
  const processedApps = applications.filter(a => a.e2eStatus === 'PROCESSED_SUCCESS');
  const avgE2EDuration = processedApps.length > 0
    ? Math.round(processedApps.reduce((acc, a) => acc + (a.totalDurationMs || 0), 0) / processedApps.length)
    : 0;

  // Calculate total message hops & latency
  let totalHops = 0;
  let publishedHops = 0;
  let receivedHops = 0;
  let failedHops = 0;
  let avgLatency = 0;
  let totalLatencySum = 0;

  applications.forEach(app => {
    (app.hops || []).forEach(hop => {
      totalHops++;
      if (hop.msgStatus === 'PUBLISHED') publishedHops++;
      if (hop.msgStatus === 'RECEIVED') receivedHops++;
      if (hop.msgStatus === 'FAILED') failedHops++;
      totalLatencySum += hop.latencyMs || 0;
    });
  });

  if (totalHops > 0) {
    avgLatency = Math.round(totalLatencySum / totalHops);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      
      {/* KPI 1: Submitted Applications */}
      <div 
        onClick={() => onFilterSelect && onFilterSelect('ALL')}
        className={`glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer relative overflow-hidden group transition-all ${
          activeFilter === 'ALL' ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : ''
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
          <FileText className="w-16 h-16 text-blue-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>1. Submitted Apps</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{totalApps}</span>
          <span className="text-xs text-gray-400">total initiated</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
          <span className="truncate">
            <strong className="text-blue-300">{purchaseCount}</strong> Pur · <strong className="text-purple-300">{refiCount}</strong> Refi · <strong className="text-amber-300">{helocCount}</strong> Heloc
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* KPI 2: End to End Completed */}
      <div 
        onClick={() => onFilterSelect && onFilterSelect('PROCESSED_SUCCESS')}
        className={`glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer relative overflow-hidden group transition-all ${
          activeFilter === 'PROCESSED_SUCCESS' ? 'ring-2 ring-emerald-500/50 bg-emerald-500/10' : ''
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
          <CheckCircle2 className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>2. E2E Completed</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{processedSuccessCount}</span>
          <span className="text-xs font-semibold text-emerald-400">({e2eSuccessRate}% Rate)</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
          <span>Avg Duration: <strong className="text-emerald-300">{avgE2EDuration}ms</strong></span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* KPI 3: Active Pipeline & In-Progress */}
      <div 
        onClick={() => onFilterSelect && onFilterSelect('IN_PROGRESS')}
        className={`glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer relative overflow-hidden group transition-all ${
          activeFilter === 'IN_PROGRESS' ? 'ring-2 ring-amber-500/50 bg-amber-500/10' : ''
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
          <TrendingUp className="w-16 h-16 text-amber-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4" />
          <span>3. Active In Pipeline</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{inProgressCount}</span>
          <span className="text-xs text-gray-400">in-flight</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
          <span className="text-purple-300">{timedOutCount} SLA Exceeded</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* KPI 4: E2E Failures & DLQ Alerts */}
      <div 
        onClick={() => onFilterSelect && onFilterSelect('E2E_FAILED')}
        className={`glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer relative overflow-hidden group border-rose-500/30 transition-all ${
          activeFilter === 'E2E_FAILED' ? 'ring-2 ring-rose-500/50 bg-rose-500/10' : ''
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
          <ShieldAlert className="w-16 h-16 text-rose-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4 animate-pulse text-rose-400" />
          <span>4. E2E Failures & DLQ</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{failedCount}</span>
          <span className="text-xs text-rose-400 font-semibold">({failedHops} DLQ events)</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
          <span className="text-rose-300">DLQ Routing Active</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* KPI 5: Telemetry Performance */}
      <div 
        onClick={() => onFilterSelect && onFilterSelect('MESSAGES')}
        className={`glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer relative overflow-hidden group transition-all ${
          activeFilter === 'MESSAGES' ? 'ring-2 ring-cyan-500/50 bg-cyan-500/10' : ''
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
          <Activity className="w-16 h-16 text-cyan-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>5. Telemetry Flow</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{totalHops}</span>
          <span className="text-xs text-cyan-300">Avg {avgLatency}ms</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
          <div className="flex items-center space-x-1.5 text-2xs">
            <span className="text-emerald-400">Recv: {receivedHops}</span>
            <span>·</span>
            <span className="text-blue-400">Pub: {publishedHops}</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
        </div>
      </div>

    </div>
  );
}

