import React, { useState } from 'react';
import { 
  Activity, Play, Terminal, Database, Radio, Shield, 
  Layers, Sparkles, ArrowRight, CheckCircle2, ChevronRight, 
  Users, Zap, BarChart3, Clock, AlertTriangle, Cpu, Globe, 
  RefreshCw, Check, ExternalLink, Lock, Server
} from 'lucide-react';

export default function PublicProductShowcase({ onLaunchConsole, onOpenOnboard }) {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState('TOPOLOGY');
  const [activePersona, setActivePersona] = useState('SRE');
  const [copilotQuery, setCopilotQuery] = useState('Why did CreditBureau latency spike?');
  const [copilotResponse, setCopilotResponse] = useState(
    'Experian API v2 endpoint returned 504 Gateway Timeout between 14:20-14:26 UTC. Automated circuit breaker tripped, routing 42 purchase applications to Equifax secondary fallback.'
  );
  const [copiedQuery, setCopiedQuery] = useState(false);

  const personas = [
    {
      id: 'SRE',
      title: 'Site Reliability & Platform',
      icon: Cpu,
      color: 'blue',
      pain: 'Drowning in 50k lines of raw Splunk stack traces during P1 incidents.',
      solution: 'Visual microservice topology with instant hop latency, DLQ tracking, and 1-click incident summaries for execs.',
      kpis: ['85% Drop in MTTR', 'Automated Circuit Breaker Alerts', 'Zero CLI Context Switching']
    },
    {
      id: 'QA',
      title: 'QA & Test Automation',
      icon: Play,
      color: 'emerald',
      pain: 'Manual testing of multi-step lending flows takes days, synthetic test data is brittle.',
      solution: 'Autonomous Playwright agents that simulate full Chase purchase/refi flows with dynamic compliant persona generation.',
      kpis: ['100% Automated Regression', 'Synthetic Compliant PII', 'Visual Step Replay']
    },
    {
      id: 'PRODUCT',
      title: 'Product & Business Ops',
      icon: BarChart3,
      color: 'purple',
      pain: 'No visibility into where borrowers abandon high-value mortgage applications.',
      solution: 'Correlates microservice latency directly with borrower drop-offs and estimated pipeline dollar losses.',
      kpis: ['$48M Loan Pipeline Protected', 'Borrower Funnel Analytics', 'Executive Briefs']
    },
    {
      id: 'RISK',
      title: 'Risk & Compliance',
      icon: Shield,
      color: 'amber',
      pain: 'Audit preparation requires weeks of pulling disparate logs and proving adverse action notice compliance.',
      solution: 'Audits every underwriting decision payload against statutory fair lending rules with immutable telemetry trails.',
      kpis: ['100% Audit-Ready Telemetry', 'Zero Real PII Exposure', 'ECOA Compliance Scoring']
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. ANNOUNCEMENT TOP BANNER */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-blue-500/20 py-2 px-4 text-center text-xs font-medium text-blue-200 flex items-center justify-center space-x-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>PulseTrace v2.4 Enterprise Release is live across Home Lending microservice clusters.</span>
        <button 
          onClick={onLaunchConsole}
          className="underline hover:text-white font-semibold cursor-pointer ml-2 inline-flex items-center space-x-1"
        >
          <span>Explore Live Console</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 2. PUBLIC HEADER / BRAND NAV */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-gray-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLaunchConsole}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">PulseTrace</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Autonomous Telemetry & Journey Verification</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-gray-300">
            <a href="#interactive-preview" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pillars" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#personas" className="hover:text-white transition-colors">Team Workspaces</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenOnboard}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-slate-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Onboard Team</span>
            </button>
            <button
              onClick={onLaunchConsole}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Launch Live Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-blue-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Observability for Chase Home Lending</span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400">SOC2 & Splunk Certified</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Distributed Telemetry Into <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Autonomous Journey Verification
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            PulseTrace unites real-time <strong>Splunk SPL telemetry streams</strong>, end-to-end <strong>Playwright synthetic automation</strong>, and <strong>AI root-cause intelligence</strong> into a single mission control. Catch microservice drops before borrowers abandon applications.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onLaunchConsole}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Enter Live Mission Control</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenOnboard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gray-700 hover:border-gray-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Onboard Your Pod (60s)</span>
            </button>
          </div>

          {/* Live Trust Metrics Ticker */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Active Loan Pipeline', value: '$4.2B+', sub: 'Monitored across products' },
              { label: 'Microservice Topology', value: '14 Services', sub: 'Sub-second hop latency' },
              { label: 'Mean Triage Time', value: '< 3 Mins', sub: '85% MTTR drop with AI' },
              { label: 'Onboarded Engineers', value: '100+ Pods', sub: 'QA, SRE, Risk, Devs' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-gray-800/80 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight text-blue-400">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-200 mt-1">{stat.label}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE COCKPIT PREVIEW / SANDBOX */}
      <section id="interactive-preview" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Platform Simulator</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Experience the Mission Control Live
          </h2>
          <p className="text-sm text-gray-400">
            Click through the core capabilities below to see how PulseTrace unifies telemetry and automated verification.
          </p>
        </div>

        {/* Cockpit Card Container */}
        <div className="rounded-2xl border border-gray-800 bg-slate-950 shadow-2xl overflow-hidden">
          
          {/* Cockpit Tab Navigation */}
          <div className="flex border-b border-gray-800 bg-slate-900/70 overflow-x-auto">
            {[
              { id: 'TOPOLOGY', label: 'Microservice Topology', icon: Layers },
              { id: 'PLAYWRIGHT', label: 'Autonomous Synthetic QA', icon: Play },
              { id: 'SPLUNK', label: 'Splunk Console Engine', icon: Terminal },
              { id: 'AI_INCIDENT', label: 'AI Incident Commander', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeInteractiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveInteractiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                    isActive
                      ? 'border-blue-500 text-white bg-blue-600/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Preview */}
          <div className="p-6 sm:p-8 bg-[#0b0f19]">
            
            {/* VIEW 1: TOPOLOGY */}
            {activeInteractiveTab === 'TOPOLOGY' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Microservice Message Flow Graph</h4>
                    <p className="text-xs text-gray-400">End-to-end packet traversal across Home Lending distributed services</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real-Time Ingestion Active</span>
                  </span>
                </div>

                {/* Animated Graph Visual */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative py-4">
                  {[
                    { id: 'PORTAL', name: 'Borrower Portal (AOA)', status: 'HEALTHY', latency: '42ms', p99: '85ms' },
                    { id: 'ORIG', name: 'Loan Origination', status: 'HEALTHY', latency: '124ms', p99: '210ms' },
                    { id: 'CREDIT', name: 'Credit Bureau Gateway', status: 'ATTENTION', latency: '1.8s', p99: '2.4s' },
                    { id: 'UW', name: 'Underwriting Engine', status: 'HEALTHY', latency: '310ms', p99: '450ms' },
                    { id: 'DOCS', name: 'Document Vault (S3)', status: 'HEALTHY', latency: '89ms', p99: '140ms' }
                  ].map((node, i) => (
                    <div 
                      key={node.id} 
                      className={`p-4 rounded-xl border relative transition-all ${
                        node.status === 'ATTENTION' 
                          ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                          : 'bg-slate-900/80 border-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-gray-400">HOP {i + 1}</span>
                        <span className={`h-2 w-2 rounded-full ${node.status === 'ATTENTION' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                      </div>
                      <div className="text-xs font-bold text-white mb-2 leading-tight">{node.name}</div>
                      <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-gray-800">
                        <span className="text-gray-400">Latency:</span>
                        <span className={node.status === 'ATTENTION' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {node.latency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Telemetry Alert: <strong>Credit Bureau Gateway</strong> latency elevated (1.8s). Experian failover active.</span>
                  </div>
                  <button 
                    onClick={onLaunchConsole}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1"
                  >
                    <span>Inspect in Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: PLAYWRIGHT SYNTHETIC QA */}
            {activeInteractiveTab === 'PLAYWRIGHT' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">Autonomous Synthetic Borrower Runner</h4>
                    <p className="text-xs text-gray-400">Simulating full Chase lending applications with zero flaky scripts</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                    Target: purchase.chase.com
                  </span>
                </div>

                {/* Step Visualizer */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-gray-800 space-y-3 font-mono text-xs">
                  {[
                    { step: 'Step 1: Land on Mortgage Portal', status: 'COMPLETED', time: '412ms', details: 'Navigated to Chase Home Lending landing page' },
                    { step: 'Step 2: Authenticate or Select "I\'m New to Chase"', status: 'COMPLETED', time: '298ms', details: 'Selected new borrower guest flow (cfgCode=502002)' },
                    { step: 'Step 3: Enter Synthetic Compliant PII & SSN', status: 'IN_PROGRESS', time: '820ms', details: 'Filling Sarah Jenkins, $145,000 W-2 income, 740 FICO' },
                    { step: 'Step 4: Property Details & Loan Amount ($650k)', status: 'PENDING', time: '--', details: 'Awaiting underwriting pre-check' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-gray-800/80">
                      <div className="flex items-center space-x-3">
                        {s.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : s.status === 'IN_PROGRESS' ? (
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                        )}
                        <div>
                          <div className={`font-semibold ${s.status === 'IN_PROGRESS' ? 'text-blue-300' : 'text-gray-200'}`}>
                            {s.step}
                          </div>
                          <div className="text-[11px] text-gray-500">{s.details}</div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-[11px]">{s.time}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Synthetic personas generated on-the-fly without exposing production customer data.</span>
                  <button 
                    onClick={onLaunchConsole}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                  >
                    Run Live Playwright Batch
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: SPLUNK CONSOLE */}
            {activeInteractiveTab === 'SPLUNK' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">Embedded Splunk SPL Engine</h4>
                    <p className="text-xs text-gray-400">Execute real-time Search Processing Language directly in the browser</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">Cluster: splunk-indexer.prod.chase.internal</span>
                </div>

                {/* Simulated SPL Bar */}
                <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-mono text-xs flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-gray-400">index=home_lending</span>
                  <span className="text-blue-400">sourcetype=underwriting_api</span>
                  <span className="text-purple-400">status&gt;=500</span>
                  <span className="text-amber-400">| stats count by error_code, endpoint</span>
                </div>

                {/* Simulated Result Table */}
                <div className="rounded-xl border border-gray-800 overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-4 bg-slate-900/80 p-2.5 text-gray-400 font-bold border-b border-gray-800">
                    <div>ERROR_CODE</div>
                    <div>ENDPOINT</div>
                    <div>COUNT</div>
                    <div>SEVERITY</div>
                  </div>
                  {[
                    { code: 'ERR_EXPERIAN_504', ep: '/api/v2/credit/pull', count: 42, sev: 'HIGH' },
                    { code: 'ERR_SSN_FORMAT', ep: '/api/v1/borrower/verify', count: 8, sev: 'LOW' },
                    { code: 'ERR_DOC_S3_TIMEOUT', ep: '/api/v1/vault/upload', count: 3, sev: 'MEDIUM' }
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-gray-900 bg-slate-950/40 text-gray-300">
                      <span className="text-amber-400">{row.code}</span>
                      <span>{row.ep}</span>
                      <span>{row.count}</span>
                      <span className={row.sev === 'HIGH' ? 'text-red-400 font-bold' : 'text-gray-400'}>{row.sev}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: AI INCIDENT COMMANDER */}
            {activeInteractiveTab === 'AI_INCIDENT' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Incident Commander & Executive Explainer</h4>
                    <p className="text-xs text-gray-400">Translating 50,000 stack trace lines into a 10-second VP briefing</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Lending LLM Agent</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-900/50 pb-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wide flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Incident Brief: Experian Gateway Outage</span>
                    </span>
                    <span className="text-gray-400 font-mono">14:24 UTC • Severity: High</span>
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    <strong>Root Cause:</strong> Experian v2 credit scoring API endpoint experienced network degradation, causing HTTP 504 timeouts on 42 loan applications.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-gray-800">
                      <div className="text-gray-400 font-bold mb-0.5">Blast Radius & Pipeline:</div>
                      <div className="text-white font-mono">$18.4M in Purchase loan volume temporarily paused</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-gray-800">
                      <div className="text-gray-400 font-bold mb-0.5">Automated Action Taken:</div>
                      <div className="text-emerald-400 font-mono">Fell over to Equifax secondary; 100% restored</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={onLaunchConsole}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                  >
                    <span>Open AI Copilot in Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Cockpit Card Footer Banner */}
          <div className="px-6 py-3 bg-slate-900/80 border-t border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-400">Integrated with Chase Home Lending core configuration (cfgCode=502002)</span>
            <button 
              onClick={onLaunchConsole}
              className="text-blue-400 hover:text-white font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>Launch Full Screen Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. STRATEGIC ENTERPRISE PILLARS */}
      <section id="pillars" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Enterprise Architecture</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Built for Tier-1 Financial Scale
          </h2>
          <p className="text-sm text-gray-400">
            Four specialized operational capabilities delivering zero-flakiness and continuous compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Play,
              color: 'from-blue-600 to-cyan-600',
              title: 'Autonomous Synthetic Borrower QA',
              desc: 'Never rely on manual testers or stale test accounts again. PulseTrace generates mathematically compliant synthetic borrowers (W-2, self-employed, DTI variations) and executes full Playwright journeys with self-healing selectors.'
            },
            {
              icon: Terminal,
              color: 'from-emerald-600 to-teal-600',
              title: 'Deep Splunk SPL Telemetry Correlation',
              desc: 'Execute live SPL queries without opening separate tabs. Every loan application is automatically correlated with its downstream microservice hops, Dead Letter Queue (DLQ) messages, and 1-click message replay.'
            },
            {
              icon: Users,
              color: 'from-purple-600 to-indigo-600',
              title: 'Multi-Tenant Team Workspaces',
              desc: 'Designed for 100+ team members across the bank. Credit, Underwriting, Servicing, and Risk pods configure their own saved Splunk queries, custom latency thresholds, and dashboard layouts.'
            },
            {
              icon: Sparkles,
              color: 'from-amber-600 to-orange-600',
              title: 'AI Root-Cause & Revenue Protection',
              desc: 'Connect technical timeouts directly to mortgage abandonment. AI models immediately calculate dollar pipeline risk and summarize complex multi-hop outages into plain English incident drafts.'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0b0f19] border border-gray-800 hover:border-gray-700 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} p-0.5 mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TEAM PERSONAS / WORKSPACES SECTION */}
      <section id="personas" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Multi-Persona Value</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            One Platform. Every Engineering Persona.
          </h2>
          <p className="text-sm text-gray-400">
            Select your role below to see how PulseTrace adapts its telemetry and workflows to your daily priorities.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/30'
                    : 'bg-slate-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Detail Card */}
        {(() => {
          const current = personas.find(p => p.id === activePersona) || personas[0];
          return (
            <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-gray-800 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Current Friction & Pain Point</span>
                    <p className="text-sm text-gray-300 mt-1 font-medium bg-red-950/20 border border-red-900/40 p-3.5 rounded-xl">
                      "{current.pain}"
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">How PulseTrace Solves It</span>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl">
                      {current.solution}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-xl border border-gray-800/80 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Measurable Outcomes</div>
                    <div className="space-y-2.5">
                      {current.kpis.map((kpi, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-white">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{kpi}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800 mt-6">
                    <button
                      onClick={onOpenOnboard}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Onboard as {current.title}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 7. ARCHITECTURE & SECURITY */}
      <section id="architecture" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero-Trust Telemetry</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How PulseTrace Integrates with Enterprise Stacks
          </h2>
          <p className="text-sm text-gray-400">
            Zero intrusive agents required. Directly connects to existing Splunk REST APIs, Kafka topics, and Playwright runners.
          </p>
        </div>

        {/* 3-Step Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Ingest & Index',
              desc: 'Connects to your Splunk indexers (`index=home_lending`) and Kafka topics. Ingests raw telemetry with zero PII exposure using automated token masking.',
              icon: Database
            },
            {
              step: '02',
              title: 'Correlate & Trace',
              desc: 'The PulseTrace Journey Engine stitches individual logs by `ApplicationId` into a continuous microservice flow graph with real-time latency calculation.',
              icon: Layers
            },
            {
              step: '03',
              title: 'Verify & Remediate',
              desc: 'Autonomous Playwright synthetic runners probe loan paths. When anomalies occur, 1-click DLQ replay and AI root-cause briefs resolve issues in seconds.',
              icon: Zap
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-gray-800 relative">
                <div className="text-4xl font-extrabold text-slate-800 font-mono mb-4">{item.step}</div>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FAQ SECTION FOR TECHNICAL LEADERSHIP */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-gray-800/80">
        <div className="text-center mb-12 space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Leadership Inquiries</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-sm">
          {[
            {
              q: 'Does PulseTrace replace our enterprise Splunk deployment?',
              a: 'No. PulseTrace operates as an intelligent visual mission control on top of your existing Splunk cluster. It leverages your current indexes, credentials, and forwarders while eliminating the need for engineers to manually write complex SPL during outages.'
            },
            {
              q: 'How does PulseTrace prevent real customer PII from leaking in synthetic tests?',
              a: 'The autonomous borrower runner creates mathematically valid but entirely synthetic borrower personas on the fly. Real customer SSNs and financial data are never touched or stored.'
            },
            {
              q: 'Can multiple pods (Underwriting, Credit, Servicing) share PulseTrace without cluttering views?',
              a: 'Yes! PulseTrace features multi-tenant workspaces. Each team configures their own microservices, saved SPL queries, alert thresholds, and default layout views.'
            },
            {
              q: 'How does this reduce MTTR for senior leadership?',
              a: 'During a P1 outage, the 1-Click AI Incident Commander automatically summarizes affected dollar volume, affected borrower count, and technical root causes into boardroom-ready briefing cards.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-gray-800/80 space-y-2">
              <h5 className="font-bold text-white text-sm flex items-center space-x-2">
                <span className="text-blue-400">Q:</span>
                <span>{faq.q}</span>
              </h5>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 border border-blue-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to modernise your telemetry & verification?
            </h2>
            <p className="text-sm text-blue-200">
              Launch the live interactive console right now, or onboard your pod in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-slate-950 font-extrabold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
                <span>Launch Live Mission Control</span>
              </button>
              <button
                onClick={onOpenOnboard}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-gray-700 text-white font-semibold text-sm transition-all"
              >
                <span>Onboard a New Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PUBLIC FOOTER */}
      <footer className="border-t border-gray-800 bg-slate-950 py-8 px-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-gray-300">PulseTrace Enterprise</span>
            <span>• Distributed Home Lending Telemetry & Autonomous Verification</span>
          </div>
          <div className="flex items-center space-x-6 text-gray-400">
            <span>Splunk SPL Engine</span>
            <span>Playwright Runner</span>
            <span>Chase cfgCode=502002</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
