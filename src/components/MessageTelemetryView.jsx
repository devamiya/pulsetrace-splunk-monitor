import React, { useState } from 'react';
import { MSG_STATUSES } from '../data/mockApplications';
import { Radio, AlertTriangle, CheckCircle2, RotateCcw, ChevronDown, ChevronUp, Copy, Check, ShieldAlert } from 'lucide-react';

export default function MessageTelemetryView({ applications, onRepublishMessage }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedHopId, setExpandedHopId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Flatten all hops across all apps
  const allHops = [];
  applications.forEach(app => {
    app.hops.forEach((hop, idx) => {
      allHops.push({
        ...hop,
        appId: app.id,
        applicantName: app.applicantName,
        e2eStatus: app.e2eStatus,
        uniqueKey: `${app.id}-${hop.stage}-${idx}`
      });
    });
  });

  // Sort latest first
  allHops.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredHops = allHops.filter(h => {
    if (filterStatus === 'ALL') return true;
    return h.msgStatus === filterStatus;
  });

  const handleCopyPayload = (payload, key) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <span>Message Flow Telemetry Stream</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time status of broker events flowed across Kafka & RabbitMQ queues (RECEIVED, PUBLISHED, FAILED).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Messages ({allHops.length})
          </button>
          
          <button
            onClick={() => setFilterStatus('RECEIVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'RECEIVED' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            RECEIVED ({allHops.filter(h => h.msgStatus === 'RECEIVED').length})
          </button>

          <button
            onClick={() => setFilterStatus('PUBLISHED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'PUBLISHED' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            PUBLISHED ({allHops.filter(h => h.msgStatus === 'PUBLISHED').length})
          </button>

          <button
            onClick={() => setFilterStatus('FAILED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'FAILED' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            FAILED (DLQ) ({allHops.filter(h => h.msgStatus === 'FAILED').length})
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {filteredHops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No message events found matching status filter <span className="font-semibold text-gray-400">{filterStatus}</span>.
          </div>
        ) : (
          filteredHops.map(hop => {
            const isExpanded = expandedHopId === hop.uniqueKey;
            const statusConfig = MSG_STATUSES[hop.msgStatus] || MSG_STATUSES.PUBLISHED;

            return (
              <div
                key={hop.uniqueKey}
                className={`rounded-xl border transition-all ${
                  hop.msgStatus === 'FAILED'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-900/80 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Status Badge & Topic */}
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${statusConfig.bg}`}>
                      {hop.msgStatus}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-xs">{hop.appId}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs font-semibold text-blue-400">{hop.topic}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Service: <span className="font-mono text-gray-300">{hop.service}</span> ({hop.stage})
                      </div>
                    </div>
                  </div>

                  {/* Latency & Timestamp */}
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="text-right">
                      <div className="font-mono text-gray-300">{hop.latencyMs}ms latency</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(hop.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      {hop.msgStatus === 'FAILED' && (
                        <button
                          onClick={() => onRepublishMessage && onRepublishMessage(hop)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-publish</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedHopId(isExpanded ? null : hop.uniqueKey)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expanded Payload & Exception Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-800/80 bg-slate-950/60 rounded-b-xl text-xs">
                    
                    {/* Failure Exception Banner */}
                    {hop.msgStatus === 'FAILED' && (
                      <div className="mb-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold">Execution Exception & DLQ Trigger</div>
                          <div className="font-mono text-[11px] mt-0.5">{hop.error}</div>
                          {hop.dlqTopic && (
                            <div className="text-[10px] text-rose-400 mt-1">
                              Dead Letter Topic: <span className="font-mono">{hop.dlqTopic}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1.5 text-gray-400 font-mono text-[11px]">
                      <span>Event Message Payload (JSON)</span>
                      <button
                        onClick={() => handleCopyPayload(hop.payload, hop.uniqueKey)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedId === hop.uniqueKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === hop.uniqueKey ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-slate-900 border border-gray-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      {JSON.stringify(hop.payload, null, 2)}
                    </pre>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
