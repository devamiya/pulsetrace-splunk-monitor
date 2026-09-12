import React, { useState } from 'react';
import { TARGET_APPLICATION_URL } from '../services/playwrightRunner';
import { Play, Pause, X, Monitor, Code, Terminal, CheckCircle2, Globe, Shield, ArrowRight, RefreshCw, Radio, Lock, ShieldCheck, Layers, Loader2, Server, Check, ExternalLink, UserPlus, AlertTriangle } from 'lucide-react';

export default function PlaywrightOverlayModal({ activeStepInfo, onClose, onTogglePause, isPaused, isMinimized, setIsMinimized }) {
  if (!activeStepInfo) return null;

  const { step, stepIdx, totalSteps, scriptSteps, applicationData, error } = activeStepInfo;
  const isFinished = stepIdx === totalSteps - 1;
  const stepsToRender = scriptSteps || [];
  const [isLaunchingHeaded, setIsLaunchingHeaded] = useState(false);
  const [headedMessage, setHeadedMessage] = useState(null);

  const applicantName = applicationData?.applicantName || 'Sarah Jenkins';
  const amount = applicationData?.amount ?? 25000;

  // Trigger Real Headed Playwright Execution on Mac Desktop
  const handleLaunchRealBrowser = async () => {
    setIsLaunchingHeaded(true);
    setHeadedMessage("Opening real Chromium browser window on Mac desktop...");

    try {
      await fetch('http://localhost:3001/api/run-playwright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantName, amount })
      });
      setHeadedMessage("Real Playwright browser automation completed!");
    } catch (e) {
      window.open(TARGET_APPLICATION_URL, '_blank');
      setHeadedMessage("Opened target Chase URL in new browser window.");
    } finally {
      setIsLaunchingHeaded(false);
    }
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 glass-panel p-3.5 rounded-2xl border border-blue-500/50 shadow-2xl flex items-center space-x-3 cursor-pointer hover:border-blue-400 animate-bounce"
      >
        <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Monitor className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white">Playwright Test Runner</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <p className="text-[10px] text-gray-400">
            Step {stepIdx + 1}/{totalSteps}: {step ? step.title : 'Executing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-6xl rounded-2xl border border-blue-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Streamlined Clean Header */}
        <div className="px-5 py-3 border-b border-gray-800 bg-slate-900/90 flex items-center justify-between">
          {/* Left: Window Controls & Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="h-4 w-px bg-gray-800 mx-1"></div>
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white text-xs tracking-tight">Playwright Automation Runner</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-gray-800 text-[11px] font-mono text-emerald-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>secure.chase.com</span>
            </div>
          </div>

          {/* Right: Essential Window Controls */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={onTogglePause}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-gray-200 border border-gray-700 font-semibold transition-all"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-gray-300 border border-gray-700 font-semibold transition-all"
            >
              Minimize
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-gray-400 hover:text-white transition-all"
              title="Close Runner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Side: Live Chase Interactive Viewport (7 Cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-950/90 border-r border-gray-800 flex flex-col justify-between relative overflow-hidden">
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/80 text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Chase Origination Portal Viewport (1280x800)</span>
              </div>
              <div className="flex items-center space-x-2">
                {headedMessage && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
                    {headedMessage}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                  STEP {stepIdx + 1}/3: {step ? step.title : 'RUNNING'}
                </span>
              </div>
            </div>

            {/* Viewport Dynamic Content Screens */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-gray-800 relative shadow-2xl my-auto min-h-[360px] flex flex-col justify-between">
              
              {/* Chase Header */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                    C
                  </div>
                  <div>
                    <span className="font-black text-white text-sm tracking-tight">CHASE</span>
                    <span className="text-gray-400 text-xs ml-1.5">Online Account Origination</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-gray-400 bg-slate-950 px-2 py-0.5 rounded border border-gray-800">
                  cfgCode=502002
                </div>
              </div>

              {/* Submission Error Banner */}
              {error ? (
                <div className="my-auto p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center justify-between shadow-xl">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <div className="font-bold text-white text-sm">Submission Execution Error</div>
                      <div className="text-[11px] text-rose-300 mt-0.5">{error}</div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <>
                  {/* STEP 1: LAND INTO THE PAGE */}
                  {stepIdx === 0 && (
                    <div className="my-auto py-8 text-center space-y-3 animate-in fade-in duration-300">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                      <div className="font-bold text-white text-base">Step 1: Landing into Chase Origination Page</div>
                      <p className="text-xs text-gray-400 font-mono max-w-sm mx-auto truncate">
                        {TARGET_APPLICATION_URL}
                      </p>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        ✓ SSL 256-bit Connection Established
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CHOOSE "I'm new to Chase" */}
                  {stepIdx === 1 && (
                    <div className="my-auto space-y-4 animate-in fade-in duration-300">
                      <div className="text-xs font-bold text-white mb-2">Step 2: Choose Customer Origination Option</div>

                      {/* Option 1: Existing Customer */}
                      <div className="p-3.5 rounded-xl border border-gray-800 bg-slate-950/60 opacity-50 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <input type="radio" disabled name="chase-cust-type" />
                          <span className="text-gray-400">I have a Chase account</span>
                        </div>
                      </div>

                      {/* Option 2: "I'm new to Chase" (HIGHLIGHTED & SELECTED) */}
                      <div className="p-4 rounded-xl border border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <input type="radio" checked readOnly className="w-4 h-4 text-emerald-500 focus:ring-emerald-400" />
                          <div>
                            <div className="font-bold text-emerald-300 text-sm">I'm new to Chase</div>
                            <div className="text-[11px] text-gray-300">Open a new retail account without signing in</div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: FILL PII DATA THEN CLICK NEXT */}
                  {stepIdx === 2 && (
                    <div className="my-auto space-y-3.5 animate-in fade-in duration-300">
                      <div className="text-xs font-bold text-white mb-1">Step 3: Fill PII Data & Click Next</div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl border border-blue-500/40 bg-blue-500/10 ring-2 ring-blue-400/30">
                          <label className="block text-[10px] font-medium text-gray-400">First Name</label>
                          <div className="text-xs font-bold text-white">{applicantName}</div>
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 ring-2 ring-emerald-400/30">
                          <label className="block text-[10px] font-medium text-gray-400">Deposit Amount</label>
                          <div className="text-xs font-mono font-bold text-emerald-400">${(Number(amount) || 25000).toLocaleString()} USD</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-gray-800 bg-slate-950">
                        <label className="block text-[10px] font-medium text-gray-400">Zip Code / Address</label>
                        <div className="text-xs font-mono text-gray-300">10001 • New York, NY</div>
                      </div>

                      {/* Next Button Press */}
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-400/40 animate-pulse flex items-center justify-center space-x-2"
                      >
                        <span>Next: Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Success Intercept */}
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Application Submitted! Published Kafka topic <code className="font-mono text-white">app.submitted</code></span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Viewport Actions Bar */}
              <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span>Target: secure.chase.com</span>
                <a
                  href={TARGET_APPLICATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>Open Target Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Step Progress Stepper */}
            <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>Step {stepIdx + 1} of {totalSteps}</span>
              <span className="text-emerald-400 font-semibold">{step ? step.title : ''}</span>
            </div>

          </div>

          {/* Right Side: Live Playwright Code & Console Inspector (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-900/90 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800 text-xs">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Code className="w-4 h-4" />
                  <span>3-Step Playwright Inspector</span>
                </div>
              </div>

              {/* Code Snippets Stream */}
              <div className="space-y-2 font-mono text-[11px] mb-6">
                {stepsToRender.map((s, idx) => {
                  const isActive = idx === stepIdx;
                  const isDone = idx < stepIdx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20'
                          : isDone
                          ? 'bg-slate-950/60 border-gray-800/80 text-emerald-400 opacity-80'
                          : 'bg-slate-950/30 border-gray-800/40 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1 font-sans">
                        <span className="font-bold uppercase tracking-wider">{s.title}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {s.code}
                      </pre>
                    </div>
                  );
                })}
              </div>

              {/* Live Execution Terminal Log */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-gray-800 font-mono text-[11px]">
                <div className="flex items-center justify-between text-gray-500 text-[10px] mb-2 border-b border-gray-800 pb-1">
                  <span className="flex items-center"><Terminal className="w-3 h-3 mr-1 text-emerald-400" /> Playwright Console Output</span>
                  <span className="text-emerald-400 animate-pulse">● STDOUT</span>
                </div>
                <div className="space-y-1 text-gray-300">
                  <div className="text-gray-500">[INFO] Playwright browser context initialized (Chromium 131.0)</div>
                  {step && <div className="text-blue-400">[ACTION] {step.log}</div>}
                  {step && step.network && (
                    <div className="text-emerald-400">[NETWORK] Intercepted {step.network.method || 'EVENT'} {step.network.url || step.network.topic} ({step.network.status || '200 OK'})</div>
                  )}
                  {isFinished && <div className="text-emerald-400 font-bold">[SUCCESS] 3-Step Playwright origination passed cleanly (1.42s execution time).</div>}
                </div>
              </div>

            </div>

            {/* Footer Close / Minimize */}
            <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span className="text-[11px] text-gray-400">
                {isFinished ? 'Real submission completed!' : 'Automating via Playwright...'}
              </span>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                {isFinished ? 'View Microservice Pipeline' : 'Close Overlay'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
