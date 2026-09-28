import React, { useState } from 'react';
import { 
  X, CheckCircle2, ChevronRight, ChevronLeft, Shield, 
  Terminal, Layers, Sparkles, Building2, Server, ArrowRight,
  Database, Users, Zap
} from 'lucide-react';

export default function TeamOnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    department: 'Home Lending',
    leadEmail: '',
    microservices: ['loan-origination-api', 'credit-bureau-gateway'],
    newServiceInput: '',
    splunkIndex: 'index=home_lending_core',
    splunkSourcetype: 'sourcetype=log4j_json',
    alertThresholdMs: 2500,
    selectedLayout: 'sre-standard',
    enableAiCopilot: true
  });

  if (!isOpen) return null;

  const handleAddService = () => {
    if (formData.newServiceInput.trim() && !formData.microservices.includes(formData.newServiceInput.trim())) {
      setFormData({
        ...formData,
        microservices: [...formData.microservices, formData.newServiceInput.trim()],
        newServiceInput: ''
      });
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setFormData({
      ...formData,
      microservices: formData.microservices.filter(s => s !== serviceToRemove)
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete(formData);
        }
        setIsSuccess(false);
        setStep(1);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Onboard New Team to PulseTrace</h3>
              <p className="text-xs text-gray-400">Self-service telemetry & synthetic verification setup</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Team Profile' },
              { num: 2, label: 'Splunk & Services' },
              { num: 3, label: 'Workspace View' }
            ].map((s) => (
              <div key={s.num} className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' 
                    : step > s.num 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 text-gray-400'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step === s.num ? 'text-white' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Workspace Initialized!</h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Team <span className="text-blue-400 font-semibold">{formData.teamName || 'New Team'}</span> has been successfully registered with custom Splunk indexes and telemetry monitors.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1: Team Profile */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Team / Pod Name *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g., Credit Bureau Integrations, Fraud & KYC, Document Vault"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Department / Division
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Home Lending">Home Lending (Origination)</option>
                        <option value="Consumer Banking">Consumer & Community Banking</option>
                        <option value="Risk & Fraud">Risk, Fraud & Identity</option>
                        <option value="Servicing">Mortgage Servicing & Escrow</option>
                        <option value="Core Banking">Core Banking & Ledger</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Engineering Lead / Contact Email
                      </label>
                      <input 
                        type="email"
                        placeholder="lead@chase.com"
                        value={formData.leadEmail}
                        onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 flex items-start space-x-2.5">
                    <Shield className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>
                      Onboarding automatically provisions a team namespace, RBAC permissions, and pre-indexes your microservice routes for zero-configuration Splunk telemetry ingestion.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: Splunk & Microservices */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Primary Splunk Index
                      </label>
                      <input 
                        type="text"
                        placeholder="index=home_lending_core"
                        value={formData.splunkIndex}
                        onChange={(e) => setFormData({ ...formData, splunkIndex: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Default Sourcetype
                      </label>
                      <input 
                        type="text"
                        placeholder="sourcetype=log4j_json"
                        value={formData.splunkSourcetype}
                        onChange={(e) => setFormData({ ...formData, splunkSourcetype: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Microservices Tagging */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Microservices Owned & Monitored
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input 
                        type="text"
                        placeholder="e.g. credit-bureau-v2"
                        value={formData.newServiceInput}
                        onChange={(e) => setFormData({ ...formData, newServiceInput: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        type="button"
                        onClick={handleAddService}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-gray-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-950/60 rounded-xl border border-gray-800">
                      {formData.microservices.map(svc => (
                        <span 
                          key={svc}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-mono"
                        >
                          <span>{svc}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveService(svc)}
                            className="hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Latency Threshold */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        SLA P99 Latency Warning Threshold
                      </label>
                      <span className="text-xs font-mono text-amber-400 font-bold">{formData.alertThresholdMs} ms</span>
                    </div>
                    <input 
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={formData.alertThresholdMs}
                      onChange={(e) => setFormData({ ...formData, alertThresholdMs: Number(e.target.value) })}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Workspace View */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Choose Default Dashboard Layout
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'sre-standard', 
                          title: 'SRE & Platform', 
                          desc: 'Focus on P99 latency, error rates, microservice topology, and Splunk terminal' 
                        },
                        { 
                          id: 'qa-automation', 
                          title: 'QA & Verification', 
                          desc: 'Focus on Playwright synthetic tests, application table, and step logs' 
                        },
                        { 
                          id: 'exec-kpi', 
                          title: 'Executive Mission', 
                          desc: 'Focus on conversion funnels, dollar volume, and AI incident summaries' 
                        }
                      ].map(layout => (
                        <div
                          key={layout.id}
                          onClick={() => setFormData({ ...formData, selectedLayout: layout.id })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            formData.selectedLayout === layout.id
                              ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-900/50 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <h5 className="text-xs font-bold text-white mb-1">{layout.title}</h5>
                          <p className="text-[11px] text-gray-400 leading-tight">{layout.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Enable Domain AI SRE Copilot</div>
                        <div className="text-[11px] text-gray-400">Allows team to chat with their Splunk telemetry in plain English</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.enableAiCopilot}
                        onChange={(e) => setFormData({ ...formData, enableAiCopilot: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isSuccess && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-slate-900/40">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !formData.teamName.trim()) {
                    setFormData({ ...formData, teamName: 'Lending Engineering Pod A' });
                  }
                  setStep(step + 1);
                }}
                className="flex items-center space-x-1 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Provisioning Workspace...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Complete Onboarding</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
