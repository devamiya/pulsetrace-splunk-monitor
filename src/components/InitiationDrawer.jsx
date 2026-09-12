import React, { useState } from 'react';
import { X, Send, DollarSign, FileText, CheckCircle2, ArrowRight, Home, Banknote, Landmark, Code, RotateCcw, AlertTriangle, Sparkles, Copy, Check, ChevronDown, ChevronUp, Monitor } from 'lucide-react';
import { HOME_LENDING_FLOWS, getFlowDefaultPayload } from '../config/homeLending/homeLendingRegistry';

export const APPLICATION_TYPES = HOME_LENDING_FLOWS;

const getDefaultJsonPayload = (typeObj) => {
  return JSON.stringify(getFlowDefaultPayload(typeObj.id), null, 2);
};

export default function InitiationDrawer({ onClose, onSubmit }) {
  const [selectedAppType, setSelectedAppType] = useState(HOME_LENDING_FLOWS[0]);
  const [jsonText, setJsonText] = useState(() => getDefaultJsonPayload(HOME_LENDING_FLOWS[0]));
  const [jsonError, setJsonError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [openDesktopBrowser, setOpenDesktopBrowser] = useState(true);

  // Update JSON template when selected product changes
  const handleSelectType = (typeObj) => {
    setSelectedAppType(typeObj);
    setJsonText(getDefaultJsonPayload(typeObj));
    setJsonError(null);
  };

  // Live syntax validation
  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  // Prettify / Format JSON
  const handlePrettifyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e) {
      setJsonError('Cannot prettify invalid JSON syntax');
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to standard product template
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
      usePlaywright: openDesktopBrowser,
      openDesktopBrowser
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
      usePlaywright: openDesktopBrowser,
      openDesktopBrowser
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 animate-in fade-in duration-200">
      
      {/* Backdrop Click */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Slide-Out Side Drawer Panel */}
      <div className="w-full max-w-2xl bg-[#0d1322] border-l border-gray-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">Initiate Home Lending Origination</h3>
              <p className="text-[11px] text-gray-400">Pre-Submission Payload Studio • Home Lending Division</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 font-mono font-bold">
              3 Products (cfgCode=502002)
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Product Cards Selector (3 Columns) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 font-semibold flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-purple-400" /> Select Mortgage Product
              </label>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {APPLICATION_TYPES.map((typeObj) => {
                const IconComp = typeObj.icon;
                const isSelected = selectedAppType.id === typeObj.id;
                return (
                  <div
                    key={typeObj.id}
                    onClick={() => handleSelectType(typeObj)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-500/50'
                        : 'bg-slate-900/90 border-gray-800 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg bg-slate-950 border border-gray-800 ${typeObj.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                        502002
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{typeObj.label}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{typeObj.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accordion Container for Pre-Submission JSON Editor */}
          <div className="flex-1 flex flex-col rounded-xl border border-gray-800 bg-slate-950 overflow-hidden shadow-inner transition-all">
            
            {/* Accordion Header Bar (Click to Expand / Collapse) */}
            <div 
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="p-3 bg-slate-900/90 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2 cursor-pointer hover:bg-slate-900 transition-colors select-none"
            >
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Pre-Submission JSON Payload Studio</span>
                <span className="text-[10px] text-gray-400 font-mono">
                  ({isAccordionOpen ? 'Click to collapse' : 'Click to edit payload'})
                </span>
              </div>

              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                {jsonError ? (
                  <span className="flex items-center space-x-1 text-[10px] text-rose-400 font-mono bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Syntax Error</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>JSON Valid</span>
                  </span>
                )}

                {isAccordionOpen && (
                  <>
                    {/* Prettify */}
                    <button
                      type="button"
                      onClick={handlePrettifyJson}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-gray-200 text-[10px] font-semibold border border-gray-700 transition-all"
                      title="Format JSON Indentation"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Prettify</span>
                    </button>

                    {/* Copy */}
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-gray-200 text-[10px] font-semibold border border-gray-700 transition-all"
                      title="Copy JSON Payload"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Reset */}
                    <button
                      type="button"
                      onClick={handleResetJson}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-gray-300 text-[10px] border border-gray-700 transition-all"
                      title="Reset to product template"
                    >
                      <RotateCcw className="w-3 h-3 text-gray-400" />
                      <span>Reset</span>
                    </button>
                  </>
                )}

                {/* Accordion Chevron Icon */}
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Accordion Content (Visible when expanded) */}
            {isAccordionOpen && (
              <div className="p-3 relative flex-1 min-h-[320px] animate-in fade-in duration-150">
                <textarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  rows={16}
                  className="w-full h-full min-h-[300px] bg-slate-950 text-emerald-400 font-mono text-[11px] p-3 rounded-lg border border-gray-800/80 focus:border-purple-500 focus:outline-none resize-y leading-relaxed"
                  placeholder="Edit submission JSON payload..."
                />
                {jsonError && (
                  <div className="mt-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                    {jsonError}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Browser Execution Mode Toggle Control */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${openDesktopBrowser ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'}`}>
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-xs">
                  {openDesktopBrowser ? 'Launch Desktop Browser Window' : 'Submit Behind the Scenes (Simulated)'}
                </div>
                <div className="text-[10px] text-gray-400">
                  {openDesktopBrowser 
                    ? 'Opens UI overlay modal AND launches real Chromium browser window on desktop' 
                    : 'Opens UI overlay modal & submits behind the scenes without opening a desktop browser window'}
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={openDesktopBrowser} 
                onChange={(e) => setOpenDesktopBrowser(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Endpoint Badge */}
          <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 flex justify-between items-center text-[11px] font-mono">
            <span className="text-gray-400">Target Mortgage Endpoint:</span>
            <span className="text-purple-400 font-bold">cfgCode={selectedAppType.cfgCode} ({selectedAppType.label})</span>
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t border-gray-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!!jsonError}
            onClick={handleBatchSubmit}
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold rounded-xl transition-all shadow-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="Submit Purchase, Refinance, and Heloc simultaneously into telemetry pipeline"
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>Submit Batch (All 3 Types)</span>
          </button>

          <button
            type="button"
            disabled={!!jsonError}
            onClick={handleSingleSubmit}
            className="flex-1 flex items-center justify-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Execute {selectedAppType.label} Submission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
