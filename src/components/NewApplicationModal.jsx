import React, { useState, useEffect } from 'react';
import { X, Send, DollarSign, FileText, CheckCircle2, ArrowRight, Home, Building2, ShieldCheck, Banknote, Landmark, Code, RotateCcw, AlertTriangle } from 'lucide-react';

export const APPLICATION_TYPES = [
  { id: 'Purchase Mortgage', label: 'Purchase', desc: 'Residential Property Purchase Mortgage', icon: Home, color: 'text-blue-400', cfgCode: '502002' },
  { id: 'Refinance Mortgage', label: 'Refinance', desc: 'Home Equity Conversion & Rate Refi', icon: DollarSign, color: 'text-emerald-400', cfgCode: '502002' },
  { id: 'Heloc Line of Credit', label: 'Heloc', desc: 'Revolving Home Equity Line of Credit', icon: Banknote, color: 'text-rose-400', cfgCode: '502002' }
];

const getDefaultJsonPayload = (typeObj) => {
  return JSON.stringify(
    {
      division: "Home Lending Division",
      applicationType: typeObj.id,
      cfgCode: typeObj.cfgCode,
      originationChannel: "WEB_OAO_PORTAL",
      mortgageDetails: {
        loanAmount: 450000,
        propertyType: "SINGLE_FAMILY_RESIDENTIAL",
        occupancyType: "PRIMARY_RESIDENCE",
        downPaymentPercent: 20,
        amortizationYears: 30
      },
      underwritingFlags: {
        autoApproveEligible: true,
        manualReviewRequired: false,
        riskScoreThreshold: 15
      }
    },
    null,
    2
  );
};

export default function NewApplicationModal({ onClose, onSubmit }) {
  const [selectedAppType, setSelectedAppType] = useState(APPLICATION_TYPES[0]);
  const [jsonText, setJsonText] = useState(() => getDefaultJsonPayload(APPLICATION_TYPES[0]));
  const [jsonError, setJsonError] = useState(null);
  const [showJsonEditor, setShowJsonEditor] = useState(true);

  // Update JSON when product card changes
  const handleSelectType = (typeObj) => {
    setSelectedAppType(typeObj);
    setJsonText(getDefaultJsonPayload(typeObj));
    setJsonError(null);
  };

  // Validate JSON on user edit
  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const handleResetJson = () => {
    setJsonText(getDefaultJsonPayload(selectedAppType));
    setJsonError(null);
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (jsonError) return;

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(jsonText);
    } catch (err) {
      setJsonError('Invalid JSON format');
      return;
    }

    onSubmit({
      appType: selectedAppType.id,
      cfgCode: selectedAppType.cfgCode,
      customPayload: parsedPayload,
      isBatch: false,
      usePlaywright: true
    });
    onClose();
  };

  const handleBatchSubmit = () => {
    if (jsonError) return;

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(jsonText);
    } catch (err) {
      parsedPayload = null;
    }

    onSubmit({
      isBatch: true,
      batchTypes: APPLICATION_TYPES,
      customPayload: parsedPayload,
      usePlaywright: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Initiate Home Lending Origination</h3>
              <p className="text-[11px] text-gray-400">Configure Pre-Submission JSON Payload • Home Lending Division</p>
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
        <form onSubmit={handleSingleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Select Home Lending Application Type Cards Grid */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 font-semibold flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-purple-400" /> Select Mortgage Product
              </label>
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-mono">
                {APPLICATION_TYPES.length} Products Supported
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {APPLICATION_TYPES.map((typeObj) => {
                const IconComp = typeObj.icon;
                const isSelected = selectedAppType.id === typeObj.id;
                return (
                  <div
                    key={typeObj.id}
                    onClick={() => handleSelectType(typeObj)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2 ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-500/50'
                        : 'bg-slate-900 border-gray-800 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg bg-slate-950 border border-gray-800 ${typeObj.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-white truncate">{typeObj.label}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1">{typeObj.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Pre-Submission JSON Payload Editor */}
          <div className="rounded-xl border border-gray-800 bg-slate-950 overflow-hidden">
            <div className="p-3 bg-slate-900/90 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Pre-Submission JSON Payload Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                {jsonError ? (
                  <span className="flex items-center space-x-1 text-[10px] text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Syntax Error</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>JSON Valid</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetJson}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 text-[10px]"
                  title="Reset to default payload template"
                >
                  <RotateCcw className="w-3 h-3 text-gray-400" />
                  <span>Reset Template</span>
                </button>
              </div>
            </div>

            <div className="p-3">
              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={9}
                className="w-full bg-slate-950 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg border border-gray-800/80 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                placeholder="Edit submission JSON payload..."
              />
              {jsonError && (
                <div className="mt-1 text-[10px] font-mono text-rose-400">
                  {jsonError}
                </div>
              )}
            </div>
          </div>

          {/* Target Mortgage Endpoint Badge */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-gray-800 flex justify-between items-center text-[11px] font-mono">
            <span className="text-gray-400">Target Mortgage Endpoint:</span>
            <span className="text-purple-400 font-bold">cfgCode={selectedAppType.cfgCode} ({selectedAppType.label})</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-800/80 gap-2">
            <button
              type="button"
              disabled={!!jsonError}
              onClick={handleBatchSubmit}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold rounded-xl transition-all shadow-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Submit all 5 Home Lending application types simultaneously into telemetry pipeline"
            >
              <Send className="w-3.5 h-3.5 text-purple-400" />
              <span>Submit Batch (All 5 Types)</span>
            </button>

            <button
              type="submit"
              disabled={!!jsonError}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Execute Submission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
