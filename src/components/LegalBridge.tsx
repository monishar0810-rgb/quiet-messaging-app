import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  Sparkles,
  UserCheck,
  FileText,
  Edit2,
  Trash2,
  User,
  Fingerprint,
  Globe,
  Key,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Advocate, CaseContext, CitizenProfile } from '../types';
import { MOCK_ADVOCATES } from '../utils/mockData';
import LegalRegistration from './LegalRegistration';
import CitizenRegistration from './CitizenRegistration';

interface LegalBridgeProps {
  onRequestLegalAid: (advocate: Advocate, caseContext?: CaseContext) => void;
  triggerToast: (msg: string) => void;
}

/**
 * LegalBridge Component
 * 
 * Provides an Industry 5.0 Human-Centric Legal Assistance portal. Citizens can search,
 * filter, and initiate identity-masked end-to-end encrypted chats with high-caliber,
 * verified advocates in Tamil Nadu without exposing personal phone numbers or identifiers.
 */
export default function LegalBridge({ onRequestLegalAid, triggerToast }: LegalBridgeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<'All' | 'Criminal' | 'Civil' | 'Property'>('All');
  const [caseContext, setCaseContext] = useState<CaseContext | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [targetAdvocate, setTargetAdvocate] = useState<Advocate | null>(null);

  // Secure persistent Citizen Profile state
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile | null>(() => {
    const saved = localStorage.getItem('quiet_citizen_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [showCitizenRegModal, setShowCitizenRegModal] = useState(false);

  // Filter logic: match either name, court location or specialization
  const filteredAdvocates = MOCK_ADVOCATES.filter(adv => {
    const matchesSearch = 
      adv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      adv.court_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization = 
      selectedSpecialization === 'All' || 
      adv.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 text-slate-100 flex flex-col gap-6" id="legal-bridge-root">
      
      {/* Top Banner / Header section matching the TN Portal style */}
      <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" id="legal-bridge-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          {/* Emblem of Tamil Nadu & Scale Icon */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-amber-500/30 flex items-center justify-center p-2 shadow-lg">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/81/Emblem_of_Tamil_Nadu.svg" 
                alt="Government of Tamil Nadu Seal" 
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border border-slate-950">
              <Scale size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Secured Governance Applet
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 bg-indigo-400/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Industry 5.0
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2">
              TN LEGAL BRIDGE <span className="text-xs text-slate-400 font-normal font-mono">• சட்ட உதவிப் பாலம்</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              End-to-end masked professional consultation with state-verified lawyers. Your citizen profile is mathematically cloaked to prevent identity leaking or social profiling.
            </p>
          </div>
        </div>

        {/* Status Stat */}
        <div className="flex flex-col items-center md:items-end gap-1.5 bg-slate-950/60 border border-white/5 px-4 py-3 rounded-xl min-w-[160px]">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Node Telemetry</span>
          <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>25 Advocates Active</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono text-center md:text-right">Zero-Trust Cloaking Engaged</span>
        </div>
      </div>

      {/* Security notice banner */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex gap-3 items-start" id="legal-bridge-security-notice">
        <Lock className="text-indigo-400 shrink-0 mt-0.5" size={16} />
        <div className="text-xs text-slate-300 leading-relaxed">
          <p className="font-bold text-indigo-300">🛡️ Zero-Knowledge Tunnel Integration Enabled</p>
          <p className="text-slate-400 mt-0.5">
            When you request aid, the system creates a specialized secure proxy tunnel. The advocate can only communicate with your anonymized state handle. Your phone number is strictly encrypted and replaced with a cryptographic hash.
          </p>
        </div>
      </div>

      {/* 🔐 CITIZEN PROFILE & 📋 CASE BRIEF INTEGRATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="citizen-case-dual-grid">
        
        {/* LEFT COLUMN: 🔐 CITIZEN SECURE PROFILE CARD */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden" id="citizen-profile-status-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">Citizen Secure Profile</span>
              {citizenProfile ? (
                <div className="mt-1.5 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm animate-pulse flex items-center gap-1">
                      🛡️ {citizenProfile.anonymizedName}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                      SECURED & TRUSTED
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-slate-300 font-mono text-[11px] pt-1">
                    <div className="flex items-center gap-1.5">
                      <Fingerprint size={12} className="text-slate-500 shrink-0" />
                      <span className="text-slate-400">ID Hash:</span>
                      <span className="text-slate-200 truncate select-all" title={citizenProfile.aadhaarHash}>
                        {citizenProfile.aadhaarHash.slice(0, 16)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Smartphone size={12} className="text-slate-500 shrink-0" />
                      <span className="text-slate-400">Mobile:</span>
                      <span className="text-slate-200">
                        +91 ••••• ••{citizenProfile.mobileNumber.slice(-3)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe size={12} className="text-slate-500 shrink-0" />
                      <span className="text-slate-400">Language:</span>
                      <span className="text-amber-400 font-bold">
                        {citizenProfile.preferredLanguage === 'Tamil' ? 'தமிழ் (Tamil)' : 'English'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <AlertCircle size={12} className="text-amber-500" />
                    Identity Mask Not Registered.
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1">
                    You must register a zero-knowledge citizen profile to hide your physical Aadhaar & mobile identifiers from advocates.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0 w-full justify-end mt-2">
            <button
              onClick={() => {
                setShowCitizenRegModal(true);
              }}
              className={`w-full md:w-auto px-4 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ${
                citizenProfile 
                  ? 'bg-slate-950 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900 text-emerald-400'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 border border-emerald-400/30 shadow-md shadow-emerald-500/5'
              }`}
              id="citizen-profile-action-btn"
            >
              {citizenProfile ? <Edit2 size={12} /> : <ShieldCheck size={12} />}
              <span>{citizenProfile ? 'Edit Secure Profile' : 'Register Secure Profile'}</span>
            </button>
            {citizenProfile && (
              <button
                onClick={() => {
                  localStorage.removeItem('quiet_citizen_profile');
                  setCitizenProfile(null);
                  triggerToast('Secure Citizen Profile cleared. Identity tunnel deactivated.');
                }}
                className="p-2 bg-red-950/20 hover:bg-red-950/60 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Clear Secure Profile"
                id="clear-citizen-profile-btn"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 📋 CONSULTATION BRIEF CARD */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden" id="case-context-status-board">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <FileText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">Active Consultation Brief (Case Context)</span>
              {caseContext ? (
                <div className="mt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-950 bg-amber-500 px-2 py-0.5 rounded-md font-mono">
                      {caseContext.category}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      {caseContext.section}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 font-medium line-clamp-1 truncate">
                    {caseContext.sectionDescription}
                  </p>
                  <p className="text-[11px] text-slate-400 italic mt-1 leading-relaxed line-clamp-2 bg-slate-950/30 px-3 py-1.5 rounded-lg border border-white/5">
                    &ldquo;{caseContext.summary}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="mt-1">
                  <span className="text-xs font-semibold text-slate-400">
                    No active case brief attached.
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1">
                    Define your legal categories, relevant laws, and case description to provide immediate context to advocates.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0 w-full justify-end mt-2">
            <button
              onClick={() => {
                setTargetAdvocate(null);
                setShowRegModal(true);
              }}
              className="w-full md:w-auto px-4 py-2 bg-slate-950 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900 text-xs font-bold rounded-xl text-amber-400 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              id="draft-context-btn"
            >
              {caseContext ? <Edit2 size={12} /> : <FileText size={12} />}
              <span>{caseContext ? 'Edit Case Brief' : 'Draft Case Brief'}</span>
            </button>
            {caseContext && (
              <button
                onClick={() => {
                  setCaseContext(null);
                  triggerToast('Case context cleared successfully.');
                }}
                className="p-2 bg-red-950/20 hover:bg-red-950/60 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Clear Brief"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 border border-white/5 rounded-xl" id="legal-bridge-filters">
        
        {/* Specialization Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto" id="specialization-tabs">
          {(['All', 'Criminal', 'Civil', 'Property'] as const).map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedSpecialization === spec
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
              id={`filter-${spec.toLowerCase()}`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Text Search input */}
        <div className="relative w-full md:w-80" id="search-input-container">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Advocate Name or Court..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500/60 transition-colors"
            id="advocate-search-bar"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Directory of Advocates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="advocate-grid-container">
        <AnimatePresence mode="popLayout">
          {filteredAdvocates.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-12 bg-slate-900/20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3"
              id="no-advocates-found"
            >
              <AlertCircle size={32} className="text-slate-500 animate-pulse" />
              <p className="text-slate-400 text-xs">No certified advocates match your selection filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedSpecialization('All'); }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </motion.div>
          ) : (
            filteredAdvocates.map((adv, index) => {
              // Custom specialization styles
              const specColors = {
                Criminal: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                Civil: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                Property: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              };

              return (
                <motion.div
                  key={adv.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="bg-slate-900/40 border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/[0.02] transition-all duration-300 relative group overflow-hidden"
                  id={`advocate-card-${adv.id}`}
                >
                  {/* Visual Background Accent */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/[0.01] group-hover:bg-amber-500/[0.01] rounded-full blur-xl pointer-events-none transition-colors" />

                  <div className="space-y-4">
                    {/* Header: Name and Availability */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-[15px] font-bold text-white group-hover:text-amber-400 transition-colors">
                          {adv.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Government Bar-Registered</p>
                      </div>

                      {/* Live availability badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border shrink-0 ${
                        adv.current_availability === 'Available'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${adv.current_availability === 'Available' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                        {adv.current_availability}
                      </span>
                    </div>

                    {/* Details section */}
                    <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
                      
                      {/* Specialization */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Specialization</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border ${specColors[adv.specialization]}`}>
                          {adv.specialization} Law
                        </span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Briefcase size={12} className="text-slate-400" />
                          Experience
                        </span>
                        <span className="font-mono font-bold text-white">{adv.experience} Years Active</span>
                      </div>

                      {/* Court Location */}
                      <div className="flex items-start justify-between gap-4 pt-1">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0 mt-0.5">
                          <MapPin size={12} className="text-slate-400" />
                          Jurisdiction
                        </span>
                        <span className="text-right text-[11px] text-slate-200 font-medium line-clamp-1 truncate" title={adv.court_location}>
                          {adv.court_location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!citizenProfile) {
                          triggerToast('🔐 Secure Citizen Profile required before initiating advocate communication.');
                          setShowCitizenRegModal(true);
                          return;
                        }
                        if (caseContext && caseContext.category === adv.specialization) {
                          triggerToast(`Establishing Secure Masked Bridge with ${adv.name}...`);
                          onRequestLegalAid(adv, caseContext);
                        } else {
                          triggerToast(`Configuring secure case context for ${adv.specialization} Law...`);
                          setTargetAdvocate(adv);
                          setShowRegModal(true);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 border border-white/10 hover:border-amber-400 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer text-amber-400"
                      id={`request-aid-btn-${adv.id}`}
                    >
                      <Lock size={12} />
                      <span>Request Secure Aid</span>
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Interactive FAQ / Quality Disclaimers */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6" id="legal-bridge-features-grid">
        <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
            <UserCheck size={16} />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bar Association Checked</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every legal advocate hosted on the Legal Bridge holds an active license verified by the Bar Council of Tamil Nadu.
          </p>
        </div>

        <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
            <ShieldCheck size={16} />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy Law Shield</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All chats are protected by legal privilege. Disclosures made inside this communication tunnel cannot be sub-poenaed.
          </p>
        </div>

        <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-2">
            <Sparkles size={16} />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Masked Intercom API</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Incoming answers utilize high-velocity secure servers. No real identifiers are recorded in logs or server traces.
          </p>
        </div>
      </div>

      {/* 🧾 CASE REGISTRATION OVERLAY / MODAL */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-lg overflow-hidden"
              id="legal-registration-modal-dialog"
            >
              <LegalRegistration 
                initialCategory={targetAdvocate ? targetAdvocate.specialization : (caseContext ? caseContext.category : 'Criminal')}
                onSaveContext={(context) => {
                  setCaseContext(context);
                  triggerToast(`Case brief registered under ${context.section}.`);
                  setShowRegModal(false);
                  
                  if (targetAdvocate) {
                    const tempAdv = targetAdvocate;
                    setTargetAdvocate(null);
                    // Open the chat after a short visual delay to feel realistic and smooth
                    setTimeout(() => {
                      onRequestLegalAid(tempAdv, context);
                    }, 1200);
                  }
                }}
                onClose={() => {
                  setShowRegModal(false);
                  setTargetAdvocate(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔐 CITIZEN REGISTRATION OVERLAY / MODAL */}
      <AnimatePresence>
        {showCitizenRegModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
              id="citizen-registration-modal-dialog"
            >
              <CitizenRegistration 
                initialProfile={citizenProfile}
                onSaveProfile={(profile) => {
                  setCitizenProfile(profile);
                  localStorage.setItem('quiet_citizen_profile', JSON.stringify(profile));
                  triggerToast(`🛡️ Secure profile active as ${profile.anonymizedName}`);
                  setShowCitizenRegModal(false);
                }}
                onClose={() => {
                  setShowCitizenRegModal(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
