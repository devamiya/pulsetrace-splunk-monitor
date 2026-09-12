import React, { useState } from 'react';
import { E2E_STATUSES, MICROSERVICE_STAGES } from '../data/mockApplications';
import { Search, Eye, Filter, CheckCircle2, Clock, AlertTriangle, ChevronRight, User } from 'lucide-react';

export default function ApplicationTable({ applications, onSelectApp, selectedFilter, setSelectedFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredApps = applications.filter(app => {
    // Status Filter
    if (selectedFilter && selectedFilter !== 'ALL') {
      if (app.e2eStatus !== selectedFilter) return false;
    }
    // Application Type Filter
    if (typeFilter && typeFilter !== 'ALL') {
      if (!app.appType.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    }
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = app.id.toLowerCase().includes(q);
      const matchType = app.appType.toLowerCase().includes(q);
      return matchId || matchType;
    }
    return true;
  });

  const getAppTypeBadgeStyle = (appType = '') => {
    const t = appType.toLowerCase();
    if (t.includes('purchase')) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (t.includes('refinance')) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (t.includes('heloc')) return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    return 'bg-slate-800 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 mb-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>End-to-End Applications Monitor</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-normal">
              {filteredApps.length} applications
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Audit processing completion status across all microservice hops and messaging infrastructure.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by App ID or Application Type..."
            className="w-full glass-input pl-9 pr-4 py-2 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Filter Tabs: Status & Application Type */}
      <div className="space-y-2 mb-4 pb-3 border-b border-gray-800 text-xs">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider min-w-[70px]">Status:</span>
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-gray-400 hover:bg-slate-800'
            }`}
          >
            All ({applications.length})
          </button>

          <button
            onClick={() => setSelectedFilter('PROCESSED_SUCCESS')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'PROCESSED_SUCCESS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Fully Processed ({applications.filter(a => a.e2eStatus === 'PROCESSED_SUCCESS').length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('IN_PROGRESS')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'IN_PROGRESS'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>In Progress ({applications.filter(a => a.e2eStatus === 'IN_PROGRESS').length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('E2E_FAILED')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'E2E_FAILED'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-rose-400 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>E2E Failed ({applications.filter(a => a.e2eStatus === 'E2E_FAILED').length})</span>
          </button>
        </div>

        {/* Application Type Quick Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider min-w-[70px]">Type:</span>
          {[
            { id: 'ALL', label: 'All Types' },
            { id: 'purchase', label: 'Purchase' },
            { id: 'refinance', label: 'Refinance' },
            { id: 'heloc', label: 'Heloc' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                typeFilter === t.id
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-900/80 text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">Application Type</th>
              <th className="py-3 px-4">E2E Status</th>
              <th className="py-3 px-4">Stage Progress</th>
              <th className="py-3 px-4">Total Latency</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300 font-medium">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No matching applications found for this filter.
                </td>
              </tr>
            ) : (
              filteredApps.map(app => {
                const statusMeta = E2E_STATUSES[app.e2eStatus] || E2E_STATUSES.IN_PROGRESS;
                const stageMeta = MICROSERVICE_STAGES.find(s => s.id === app.currentStage);
                const typeBadgeClass = getAppTypeBadgeStyle(app.appType);

                return (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors group">
                    
                    {/* App ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {app.id}
                    </td>

                    {/* Application Type */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${typeBadgeClass}`}>
                        {app.appType}
                      </span>
                    </td>

                    {/* E2E Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusMeta.badge}`}>
                        {app.e2eStatus === 'PROCESSED_SUCCESS' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {app.e2eStatus === 'IN_PROGRESS' && <Clock className="w-3 h-3 text-amber-400" />}
                        {app.e2eStatus === 'E2E_FAILED' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        <span>{statusMeta.label}</span>
                      </span>
                    </td>

                    {/* Stage Progress Bar */}
                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                        <span>{stageMeta ? stageMeta.name : app.currentStage}</span>
                        <span className="font-mono">{app.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            app.e2eStatus === 'PROCESSED_SUCCESS' ? 'bg-emerald-400' :
                            app.e2eStatus === 'E2E_FAILED' ? 'bg-rose-500' : 'bg-amber-400'
                          }`}
                          style={{ width: `${app.progressPercent}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Latency */}
                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      {app.totalDurationMs}ms
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all group-hover:border-blue-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Trace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
