import React from 'react';
import { Clock, Calendar, BarChart3, Filter, X } from 'lucide-react';

export const TIME_PRESETS = [
  { id: 'ALL', label: 'All Time', durationMs: null },
  { id: '15m', label: 'Last 15m', durationMs: 15 * 60 * 1000 },
  { id: '1h', label: 'Last 1h', durationMs: 60 * 60 * 1000 },
  { id: '24h', label: 'Last 24h', durationMs: 24 * 60 * 60 * 1000 },
  { id: '7d', label: 'Last 7d', durationMs: 7 * 24 * 60 * 60 * 1000 },
];

export default function TimeHistogramFilter({ 
  applications, 
  selectedTimeRange, 
  setSelectedTimeRange,
  customRange,
  setCustomRange
}) {
  const now = Date.now();

  // Generate 8 time buckets for the histogram bar chart
  const bucketCount = 8;
  const timePresetObj = TIME_PRESETS.find(p => p.id === selectedTimeRange);
  const totalSpanMs = timePresetObj && timePresetObj.durationMs ? timePresetObj.durationMs : 24 * 60 * 60 * 1000;
  const bucketWidthMs = totalSpanMs / bucketCount;

  const histogramBuckets = Array.from({ length: bucketCount }, (_, idx) => {
    const bucketEnd = now - (bucketCount - 1 - idx) * bucketWidthMs;
    const bucketStart = bucketEnd - bucketWidthMs;

    // Count hops within bucket
    let count = 0;
    applications.forEach(app => {
      app.hops.forEach(hop => {
        const t = new Date(hop.timestamp).getTime();
        if (t >= bucketStart && t <= bucketEnd) {
          count++;
        }
      });
    });

    const timeLabel = new Date(bucketStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { id: idx, start: bucketStart, end: bucketEnd, label: timeLabel, count };
  });

  const maxCount = Math.max(...histogramBuckets.map(b => b.count), 1);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-gray-800/80 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        
        {/* Title & Preset Controls */}
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Telemetry Time Distribution Histogram</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                {selectedTimeRange === 'ALL' ? 'Realtime Window' : `Active: ${selectedTimeRange}`}
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Filter telemetry & microservice hops by execution timestamp
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-900/90 p-1 rounded-xl border border-gray-800">
          {TIME_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedTimeRange(preset.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeRange === preset.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

      </div>

      {/* Histogram Bar Visualization */}
      <div className="pt-2 border-t border-gray-800/60">
        <div className="h-16 flex items-end justify-between space-x-1.5 px-1 pt-2">
          {histogramBuckets.map(b => {
            const heightPercent = Math.max(Math.round((b.count / maxCount) * 100), 12);
            return (
              <div
                key={b.id}
                className="flex-1 flex flex-col items-center group cursor-pointer"
                title={`${b.count} events around ${b.label}`}
              >
                <div className="text-[9px] font-mono text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.count}
                </div>
                <div className="w-full bg-slate-800/80 rounded-t-sm overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-emerald-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <div className="text-[9px] font-mono text-gray-500 mt-1 truncate w-full text-center">
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
