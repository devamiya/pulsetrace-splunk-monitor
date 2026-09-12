import React, { useState } from 'react';
import { X, Save, Edit3, Home, CheckCircle2, Clock, AlertTriangle, Cpu, Layers } from 'lucide-react';
import { E2E_STATUSES, MICROSERVICE_STAGES } from '../data/mockApplications';
import { APPLICATION_TYPES } from './NewApplicationModal';

export default function EditApplicationModal({ application, onClose, onSave }) {
  if (!application) return null;

  const [appType, setAppType] = useState(application.appType || APPLICATION_TYPES[0].id);
  const [e2eStatus, setE2eStatus] = useState(application.e2eStatus || 'IN_PROGRESS');
  const [currentStage, setCurrentStage] = useState(application.currentStage || 'PORTAL');
  const [totalDurationMs, setTotalDurationMs] = useState(application.totalDurationMs || 1200);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate progress percent based on selected stage
    const stageIdx = MICROSERVICE_STAGES.findIndex(s => s.id === currentStage);
    const calculatedProgress = e2eStatus === 'PROCESSED_SUCCESS' 
      ? 100 
      : Math.round(((stageIdx + 1) / MICROSERVICE_STAGES.length) * 100);

    const updatedApp = {
      ...application,
      appType,
      e2eStatus,
      currentStage,
      progressPercent: calculatedProgress,
      totalDurationMs: Number(totalDurationMs)
    };

    onSave(updatedApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Application Values</h3>
              <p className="text-[11px] font-mono text-amber-400">{application.id} • Home Lending Division</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Application Type Dropdown */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1.5 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1 text-purple-400" /> Origination Application Type
            </label>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white font-medium bg-slate-900 border-gray-800 focus:border-purple-500"
            >
              {APPLICATION_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.id} ({t.label})
                </option>
              ))}
            </select>
          </div>

          {/* E2E Status Selector */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> End-to-End Processing Status
            </label>
            <select
              value={e2eStatus}
              onChange={(e) => setE2eStatus(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white font-medium bg-slate-900 border-gray-800 focus:border-emerald-500"
            >
              <option value="IN_PROGRESS" className="bg-slate-900 text-amber-400">In Progress</option>
              <option value="PROCESSED_SUCCESS" className="bg-slate-900 text-emerald-400">Fully Processed (E2E)</option>
              <option value="E2E_FAILED" className="bg-slate-900 text-rose-400">E2E Failed</option>
              <option value="SLA_TIMED_OUT" className="bg-slate-900 text-purple-400">SLA Exceeded</option>
            </select>
          </div>

          {/* Current Microservice Stage */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1.5 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-blue-400" /> Current Microservice Stage
            </label>
            <select
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white font-medium bg-slate-900 border-gray-800 focus:border-blue-500"
            >
              {MICROSERVICE_STAGES.map((stg) => (
                <option key={stg.id} value={stg.id} className="bg-slate-900 text-white">
                  {stg.name} ({stg.desc})
                </option>
              ))}
            </select>
          </div>

          {/* Total Latency */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1.5 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" /> Total Duration Latency (ms)
            </label>
            <input
              type="number"
              min="10"
              max="500000"
              required
              value={totalDurationMs}
              onChange={(e) => setTotalDurationMs(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white font-mono font-bold"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end space-x-3 border-t border-gray-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Application Values</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
