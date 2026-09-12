import React, { useState } from 'react';
import { Terminal, Play, Database, FileText, Download, Code, CheckCircle2 } from 'lucide-react';

export default function SplunkTerminal({ splunkEngine, applications }) {
  const [splQuery, setSplQuery] = useState('index=enterprise_apps sourcetype=app_telemetry | stats count by stage');
  const [queryResult, setQueryResult] = useState(null);
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' | 'RAW_JSON'

  const handleRunQuery = () => {
    const result = splunkEngine.executeSPL(splQuery, applications);
    setQueryResult(result);
  };

  // Initial execution on mount
  React.useEffect(() => {
    handleRunQuery();
  }, [applications]);

  const presets = [
    { label: 'Purchase Logs', query: 'index=home_lending_purchase_logs' },
    { label: 'Refinance Logs', query: 'index=home_lending_refi_logs' },
    { label: 'HELOC Logs', query: 'index=home_lending_heloc_logs' },
    { label: 'UI Pre-Submit Logs', query: 'index=ui_origination_logs' },
    { label: 'DLQ Failures', query: 'index=* msg_status="FAILED"' },
    { label: 'Stats by Stage', query: 'index=* | stats count by stage' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 mb-6 font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Splunk SPL Console & Log Parser</span>
            </h2>
            <p className="text-xs text-gray-400">
              Query distributed log telemetry using Splunk Processing Language (SPL) syntax.
            </p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'TABLE' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Tabular View
          </button>
          <button
            onClick={() => setViewMode('RAW_JSON')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'RAW_JSON' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Raw Splunk Logs
          </button>
        </div>
      </div>

      {/* Query Presets */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-3 text-xs">
        <span className="text-gray-400 font-medium flex items-center flex-shrink-0">
          <Code className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Presets:
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSplQuery(p.query);
              const res = splunkEngine.executeSPL(p.query, applications);
              setQueryResult(res);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-300 border border-gray-800 flex-shrink-0 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <div className="relative mb-4">
        <div className="flex items-center bg-slate-950 rounded-xl border border-gray-800 p-2 shadow-inner">
          <span className="font-mono text-emerald-400 px-3 text-sm font-bold">splunk&gt;</span>
          <input
            type="text"
            value={splQuery}
            onChange={(e) => setSplQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
            className="w-full bg-transparent text-white font-mono text-xs focus:outline-none px-2 py-1"
            placeholder="Type SPL search query..."
          />
          <button
            onClick={handleRunQuery}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Query</span>
          </button>
        </div>
      </div>

      {/* Query Results & Metrics */}
      {queryResult && (
        <div className="bg-slate-950/90 rounded-xl border border-gray-800/80 p-4">
          
          {/* Metadata Header */}
          <div className="flex justify-between items-center text-xs text-gray-400 pb-3 mb-3 border-b border-gray-800 font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-bold">
                ✓ Query Completed ({queryResult.totalEvents} events returned)
              </span>
              <span>Index: <span className="text-gray-200">enterprise_apps</span></span>
            </div>
            <span>Executed in {queryResult.executedInMs}ms</span>
          </div>

          {/* Tabular Output View */}
          {viewMode === 'TABLE' ? (
            <div className="overflow-x-auto">
              {queryResult.type === 'STATS' ? (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-[11px]">
                      {queryResult.columns.map(col => (
                        <th key={col} className="py-2.5 px-4">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {queryResult.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900">
                        {queryResult.columns.map(col => (
                          <td key={col} className="py-2 px-4">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-[11px]">
                      {queryResult.columns.map(col => (
                        <th key={col} className="py-2.5 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    {queryResult.rows.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-900/60">
                        <td className="py-2 px-3 text-gray-400 text-[11px]">
                          {new Date(log._time).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 font-bold text-white">{log.application_id}</td>
                        <td className="py-2 px-3 text-blue-400">{log.stage}</td>
                        <td className="py-2 px-3 text-gray-300">{log.service}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.msg_status === 'FAILED' ? 'bg-rose-500/20 text-rose-300' :
                            log.msg_status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {log.msg_status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-emerald-400 text-[11px]">{log.e2e_status}</td>
                        <td className="py-2 px-3 text-gray-400">{log.latency_ms}ms</td>
                        <td className="py-2 px-3 text-rose-400 text-[11px] truncate max-w-[180px]">
                          {log.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* Raw Log Stream View */
            <div className="space-y-2 font-mono text-[11px] max-h-[400px] overflow-y-auto pr-2">
              {queryResult.rows.map((log, i) => {
                const isValidDate = log._time && !isNaN(new Date(log._time));
                const timeStr = isValidDate ? new Date(log._time).toISOString() : new Date().toISOString();
                return (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-gray-800 text-gray-300 leading-relaxed">
                    <span className="text-emerald-400">{timeStr}</span>{' '}
                    <span className="text-gray-400">index=</span><span className="text-purple-400 font-bold">{log.index}</span>{' '}
                    <span className="text-gray-400">host=</span><span className="text-white font-bold">{log.service}</span>{' '}
                    <span className="text-gray-400">sourcetype=</span>app_telemetry{' '}
                    <span className="text-gray-400">application_id=</span><span className="text-amber-400 font-bold">{log.application_id}</span>{' '}
                    <span className="text-gray-400">stage=</span>{log.stage}{' '}
                    <span className="text-gray-400">msg_status=</span>
                    <span className={log.msg_status === 'FAILED' ? 'text-rose-400 font-bold' : 'text-blue-400'}>
                      {log.msg_status}
                    </span>{' '}
                    <span className="text-gray-400">e2e_status=</span>{log.e2e_status}
                    {log.error && <div className="text-rose-400 mt-1 pl-4 border-l-2 border-rose-500">ERROR: {log.error}</div>}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
