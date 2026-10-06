import React, { useState } from 'react';
import { Contact, SystemNotification } from '../types';
import { SIMULATED_RESPONSES } from '../utils/mockData';
import { 
  Play, 
  Pause, 
  Terminal, 
  VolumeX, 
  Volume2, 
  Sparkles, 
  Send,
  HelpCircle,
  EyeOff,
  BellRing,
  Trash2,
  Clock,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimulatorControlProps {
  contacts: Contact[];
  notifications: SystemNotification[];
  isAutoSimulating: boolean;
  setIsAutoSimulating: (active: boolean) => void;
  simulationInterval: number; // in seconds
  setSimulationInterval: (interval: number) => void;
  onSimulateIncoming: (contactId: string, customText?: string, mediaType?: 'image' | 'video', mediaUrl?: string) => void;
  onSimulateCall: (contactId: string) => void;
  onClearLogs: () => void;
  onTriggerSpamAttack: () => void;
  onTriggerSpamCall: () => void;
}

export default function SimulatorControl({
  contacts,
  notifications,
  isAutoSimulating,
  setIsAutoSimulating,
  simulationInterval,
  setSimulationInterval,
  onSimulateIncoming,
  onSimulateCall,
  onClearLogs,
  onTriggerSpamAttack,
  onTriggerSpamCall,
}: SimulatorControlProps) {
  const [selectedSimContactId, setSelectedSimContactId] = useState(contacts[0]?.id || '');
  const [customSimText, setCustomSimText] = useState('');
  const [simMediaType, setSimMediaType] = useState<'text' | 'image' | 'video'>('text');

  // Get selected contact details for simulator panel
  const activeSimContact = contacts.find(c => c.id === selectedSimContactId);

  const handleManualSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSimContactId) return;
    
    let mediaUrl: string | undefined = undefined;
    if (simMediaType === 'image') {
      mediaUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80';
    } else if (simMediaType === 'video') {
      mediaUrl = 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4';
    }

    onSimulateIncoming(
      selectedSimContactId, 
      customSimText.trim() || undefined,
      simMediaType === 'text' ? undefined : simMediaType,
      mediaUrl
    );
    setCustomSimText('');
  };

  const triggerQuickPhrase = (phrase: string) => {
    if (!selectedSimContactId) return;
    onSimulateIncoming(selectedSimContactId, phrase, simMediaType === 'text' ? undefined : simMediaType);
  };

  const getQuickPhrases = () => {
    if (!selectedSimContactId) return [];
    return SIMULATED_RESPONSES[selectedSimContactId] || ["Hello there!", "Are you free to talk?"];
  };

  return (
    <div className="w-full bg-transparent flex flex-col h-full overflow-hidden text-slate-100" id="simulator-container">
      {/* Title */}
      <div className="p-4 border-b border-white/10 bg-slate-900/40 flex items-center justify-between shrink-0" id="simulator-header">
        <div className="flex items-center gap-2 text-indigo-400">
          <Terminal size={18} />
          <h2 className="font-bold text-white text-sm tracking-tight uppercase">Interactive Sandbox Simulator</h2>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Diagnostic System
        </span>
      </div>

      {/* Control Engine Tabs / Forms */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar" id="simulator-body">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: All Controls (Trigger Forms, Attacks, Calls, Auto Generator) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. Automated Simulation Panel */}
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-sm space-y-3" id="auto-sim-panel">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} className="text-indigo-400" />
                  <span>Auto Chat Generator</span>
                </h3>
                <span className={`w-2.5 h-2.5 rounded-full ${isAutoSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Enabling this simulates realistic periodic text updates from both primary and quieted contacts to test E2E message processing.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isAutoSimulating
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border border-indigo-500/30'
                  }`}
                  id="toggle-auto-sim"
                >
                  {isAutoSimulating ? (
                    <>
                      <Pause size={14} />
                      <span>Pause Generator</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      <span>Start Generator</span>
                    </>
                  )}
                </button>
              </div>

              {isAutoSimulating && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Speed: Message every {simulationInterval}s</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="25"
                    value={simulationInterval}
                    onChange={(e) => setSimulationInterval(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 2. Manual Trigger Panel */}
            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl shadow-sm space-y-4" id="manual-sim-panel">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Send size={13} className="text-indigo-400" />
                <span>Simulate Incoming Text</span>
              </h3>

              <form onSubmit={handleManualSimulate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Select Sender</label>
                    <select
                      value={selectedSimContactId}
                      onChange={(e) => setSelectedSimContactId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white"
                      id="sim-sender-select"
                    >
                      {contacts.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.name} {c.isQuiet ? '(🤫 Quiet)' : '(🔊 Loud)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Message Content Type</label>
                    <div className="flex bg-slate-950 p-0.5 rounded-xl border border-white/10 gap-0.5">
                      {(['text', 'image', 'video'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSimMediaType(type)}
                          className={`flex-1 text-center py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase cursor-pointer ${
                            simMediaType === type
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
                    {simMediaType === 'text' ? 'Message Body' : simMediaType === 'image' ? 'Image Caption (Optional)' : 'Video Caption (Optional)'}
                  </label>
                  <textarea
                    placeholder={
                      simMediaType === 'text'
                        ? "Type dynamic message or tap a quick phrase below..."
                        : simMediaType === 'image'
                          ? "Check out this photo! (Default placeholder image will be attached)"
                          : "Sent you a video clip (Default placeholder video will be attached)"
                    }
                    value={customSimText}
                    onChange={(e) => setCustomSimText(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-indigo-500 resize-none text-white placeholder:text-slate-600"
                    id="sim-text-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-md border border-indigo-500/30 flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  id="sim-trigger-btn"
                >
                  <Sparkles size={13} className="text-amber-300 animate-pulse" />
                  <span>Trigger Simulated {simMediaType === 'text' ? 'Message' : simMediaType === 'image' ? 'Image' : 'Video'}</span>
                </button>
              </form>

              {/* Quick Phrases */}
              {activeSimContact && (
                <div className="space-y-1.5 pt-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tap Quick Phrase</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {getQuickPhrases().map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerQuickPhrase(phrase)}
                        className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg max-w-full truncate text-left transition-colors cursor-pointer border border-white/5"
                        title={phrase}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Call & Security Simulators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call Simulation */}
              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-sm space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voice/Video Call</span>
                <p className="text-[10px] text-slate-500 leading-normal mb-1">Simulate voice stream ringing overlay triggers.</p>
                <button
                  type="button"
                  onClick={() => onSimulateCall(selectedSimContactId)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer border border-emerald-500/35 flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
                  id="sim-call-btn"
                >
                  <Phone size={13} />
                  <span>Incoming Call</span>
                </button>
              </div>

              {/* Spam bot attacks */}
              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-sm space-y-2">
                <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider">Security Testing</span>
                <p className="text-[10px] text-slate-500 leading-normal mb-1">Simulate robotic high-frequency flood vectors.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onTriggerSpamAttack}
                    className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/20 text-rose-300 hover:text-white text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm uppercase"
                    id="sim-spam-attack-btn"
                  >
                    <Terminal size={11} className="text-rose-400" />
                    <span>Spam Bot</span>
                  </button>
                  <button
                    type="button"
                    onClick={onTriggerSpamCall}
                    className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/20 text-rose-300 hover:text-white text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm uppercase"
                    id="sim-spam-call-btn"
                  >
                    <Phone size={11} className="text-rose-400" />
                    <span>Spam Call</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Explainer + Real-time Logs */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Explainer */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl shadow-xs" id="legend-box">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} className="text-indigo-400" />
                <span>Sandbox Test Instructions</span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Toggle <strong>Quiet Mode</strong> or Move any contact to the <strong>Quiet Folder</strong> in Messenger. 
                Then come back here to trigger simulated incoming texts, calls, or spam waves!
              </p>
              <div className="mt-2.5 pt-2 border-t border-indigo-500/15 flex flex-col gap-1 text-[10px] text-indigo-300 font-mono">
                <div className="flex gap-2">
                  <span className="text-indigo-400">● Normal Contacts:</span>
                  <span>Sound chime + popup notification alerts are allowed.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-pink-400">● Quieted Contacts:</span>
                  <span>Muted silently. No audio, no visual interruption. Archived to logs.</span>
                </div>
              </div>
            </div>

            {/* System Notification Logs */}
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-sm flex flex-col h-[340px] lg:h-[400px]" id="logs-panel">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BellRing size={13} className="text-indigo-400" />
                  <span>Live Filter Telemetry Logs</span>
                </h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearLogs}
                    className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-bold uppercase transition-colors"
                    title="Clear Logs"
                  >
                    <Trash2 size={11} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-950/85 rounded-xl p-3 font-mono text-[10px] leading-relaxed text-slate-300 space-y-2 border border-white/10 custom-scrollbar select-none" id="notification-logs">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-4">
                    <Terminal size={18} className="mb-1.5 text-slate-600 animate-pulse" />
                    <p className="font-bold text-slate-400">Waiting for live feed events...</p>
                    <p className="text-[9px] text-slate-600 mt-1">Trigger an incoming message or call from the controls to view sandbox security action.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        notif.type === 'suppressed' 
                          ? 'bg-rose-950/20 border-rose-500/20 text-slate-300 shadow-sm' 
                          : 'bg-indigo-950/30 border-indigo-500/20 text-indigo-100 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-[9px] mb-1">
                        <span className={notif.type === 'suppressed' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                          {notif.type === 'suppressed' ? '🤫 [SUPPRESSED_MUTED]' : '🔊 [NOTIFY_ALLOWED]'}
                        </span>
                        <span className="text-slate-500 font-mono">{notif.timestamp}</span>
                      </div>
                      <div className="break-words font-semibold text-[10px]">
                        <span className="text-white font-bold">{notif.contactName}:</span> "{notif.text}"
                      </div>
                      <div className="text-[8px] text-slate-400 mt-1.5 uppercase tracking-wide font-bold bg-white/5 px-1.5 py-0.5 rounded inline-block">
                        {notif.type === 'suppressed' 
                          ? '➜ Sound Muted • No Banners • Isolated to Logs' 
                          : '➜ Sound Played • Toast Displayed • Allowed Screen'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
