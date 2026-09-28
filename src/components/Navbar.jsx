import React, { useState } from 'react';
import { Activity, Database, Plus, Layers, Radio, Terminal, Server, ChevronDown, Clock, Users, Sparkles, UserPlus } from 'lucide-react';
import { TIME_PRESETS } from '../App';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isLive, 
  setIsLive, 
  onNewAppClick,
  onOpenOnboard,
  splunkMode,
  appCount,
  timeRange = 'ALL',
  setTimeRange = () => {}
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('Home Lending Eng');
  const activePreset = TIME_PRESETS.find(p => p.id === timeRange) || TIME_PRESETS[0];

  const TEAMS = [
    { id: 'Home Lending Eng', label: 'Home Lending Eng (cfgCode=502002)' },
    { id: 'Digital Origination QA', label: 'Digital Origination QA' },
    { id: 'Risk & Fraud Engineering', label: 'Risk & Fraud Engineering' },
    { id: 'All 100+ Members', label: 'All 100+ Team Members' }
  ];

  const tabs = [
    { id: 'SHOWCASE', label: 'Product Tour', icon: Sparkles, highlight: true },
    { id: 'OVERVIEW', label: 'Overview', icon: Layers },
    { id: 'APPLICATIONS', label: 'Applications', icon: Server },
    { id: 'MESSAGES', label: 'Telemetry', icon: Radio },
    { id: 'SPLUNK_TERMINAL', label: 'Splunk Console', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-gray-800/60 px-4 sm:px-6 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Sleek Brand Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setActiveTab('SHOWCASE')}
          title="Click to view PulseTrace Product Showcase"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
              PulseTrace
            </span>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
            </span>
          </div>
        </div>

        {/* Clean Segmented Navigation */}
        <nav className="hidden md:flex items-center bg-slate-900/90 border border-gray-800/80 p-1 rounded-xl shadow-inner space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? tab.highlight 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30' 
                      : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : tab.highlight
                    ? 'text-blue-300 hover:text-white hover:bg-blue-900/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.highlight && !isActive ? 'text-blue-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Streamlined Right Controls */}
        <div className="flex items-center space-x-2.5">
          
          {/* 100+ Team Member Context Selector Pill */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 border border-purple-500/30 hover:border-purple-500/60 text-xs font-medium text-purple-300 transition-all cursor-pointer"
              title="Filter context for 100+ team members"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">{selectedTeam}</span>
              <ChevronDown className="w-3 h-3 text-purple-400" />
            </button>

            {showTeamDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-gray-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  100+ Team Member Workspaces
                </div>
                {TEAMS.map(team => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team.id);
                      setShowTeamDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedTeam === team.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{team.label}</span>
                    {selectedTeam === team.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
                
                {/* Onboard New Team CTA */}
                <div className="pt-1 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setShowTeamDropdown(false);
                      if (onOpenOnboard) onOpenOnboard();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-400 hover:text-white hover:bg-blue-600/20 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                    <span>+ Onboard New Team Pod</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Time Range Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-gray-800/80 hover:border-gray-700 text-xs font-medium text-gray-300 transition-all"
              title="Select telemetry time filter"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">{activePreset.label}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showTimeDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-gray-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                {TIME_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setTimeRange(preset.id);
                      setShowTimeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      timeRange === preset.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {timeRange === preset.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status & Live Toggle Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLive(!isLive)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-gray-800/80 hover:border-gray-700 text-xs font-medium text-gray-300 transition-all"
              title="Click to toggle live ingestion"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-gray-400">Splunk:</span>
              <span className="font-semibold text-emerald-400">{isLive ? 'Live' : 'Paused'}</span>
            </button>
          </div>

          {/* Primary Initiate App Button */}
          <button
            onClick={onNewAppClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Initiate App</span>
          </button>

        </div>

      </div>
    </header>
  );
}
