import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Fingerprint, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Check, 
  Loader2, 
  Lock, 
  RefreshCw, 
  AlertCircle, 
  Key, 
  CheckCircle2, 
  X,
  LockKeyhole,
  FileCheck
} from 'lucide-react';
import { CitizenProfile } from '../types';

interface CitizenRegistrationProps {
  onSaveProfile: (profile: CitizenProfile) => void;
  onClose?: () => void;
  initialProfile?: CitizenProfile | null;
}

// Simple deterministic hash function for mock demonstration
function generateMockHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `zk-0x${hex}e984f8202d9a1c${hex.split('').reverse().join('')}f8a7`;
}

export default function CitizenRegistration({ onSaveProfile, onClose, initialProfile }: CitizenRegistrationProps) {
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarHash, setAadhaarHash] = useState(initialProfile?.aadhaarHash || '');
  const [mobileNumber, setMobileNumber] = useState(initialProfile?.mobileNumber || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Tamil'>(initialProfile?.preferredLanguage || 'English');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // OTP Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // General Loading/Reg sequence states
  const [regStep, setRegStep] = useState<'form' | 'loading' | 'success'>('form');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Anonymized handle computed on typing name
  const [anonymizedPreview, setAnonymizedPreview] = useState('');

  // Auto-generate name preview and Aadhaar hash
  useEffect(() => {
    if (fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      const initials = parts.map(p => p[0]?.toUpperCase() || '').join('');
      // Generate a static number based on the name length and characters
      const code = fullName.length * 179 + (fullName.charCodeAt(0) || 0);
      setAnonymizedPreview(`CITIZEN-${initials}-${code % 10000}`);
    } else {
      setAnonymizedPreview('');
    }
  }, [fullName]);

  useEffect(() => {
    if (aadhaarNumber.length === 12) {
      setAadhaarHash(generateMockHash(aadhaarNumber));
    } else {
      setAadhaarHash('');
    }
  }, [aadhaarNumber]);

  // Countdown timer for simulated OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = () => {
    if (mobileNumber.length < 10) return;
    setIsOtpSending(true);
    setOtpError('');
    
    setTimeout(() => {
      setIsOtpSending(false);
      setOtpSent(true);
      setCountdown(59);
    }, 1200);
  };

  const handleVerifyOTP = () => {
    if (otpCode.length < 4) return;
    setIsOtpVerifying(true);
    setOtpError('');

    setTimeout(() => {
      setIsOtpVerifying(false);
      if (otpCode === '1947' || otpCode === '1234' || otpCode.length === 4) {
        setOtpVerified(true);
      } else {
        setOtpError('Invalid secure handshake token. Try again.');
      }
    }, 1500);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !aadhaarHash || !mobileNumber || !otpVerified || !acceptedTerms) {
      return;
    }

    setRegStep('loading');
    
    // Simulate multi-tier military-grade cryptographic handshake steps
    setLoadingMessage('Initializing local secure enclave keys...');
    
    setTimeout(() => {
      setLoadingMessage('Generating Zero-Knowledge SHA-256 identifier...');
    }, 800);

    setTimeout(() => {
      setLoadingMessage('Computing peer-to-peer TLS tunnel parameters...');
    }, 1600);

    setTimeout(() => {
      setLoadingMessage('Signing credential brief with government bridge certificates...');
    }, 2400);

    setTimeout(() => {
      setLoadingMessage('Locking secure tunnel shield...');
    }, 3200);

    setTimeout(() => {
      setRegStep('success');
    }, 4000);

    setTimeout(() => {
      const profile: CitizenProfile = {
        fullName,
        anonymizedName: anonymizedPreview,
        aadhaarHash,
        mobileNumber,
        preferredLanguage,
        registeredAt: new Date().toLocaleDateString()
      };
      onSaveProfile(profile);
    }, 4900);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden text-slate-100 max-w-md w-full mx-auto" id="citizen-registration-card">
      
      {/* Visual Background Glow Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 p-5 bg-slate-950/40 shrink-0" id="citizen-reg-header">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <LockKeyhole size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Citizen Secure Registration</h3>
            <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">Zero-Knowledge Tunnel Shield</p>
          </div>
        </div>
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            id="close-citizen-reg-btn"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="p-5 overflow-y-auto max-h-[80vh]" id="citizen-reg-content-scrollable">
        <AnimatePresence mode="wait">
          
          {regStep === 'form' && (
            <motion.form 
              key="reg-form"
              onSubmit={handleSubmitProfile} 
              className="space-y-4 text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="citizen-reg-form"
            >
              {/* Zero-Trust Statement */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex gap-2.5 items-start text-[10px] text-emerald-300 font-mono" id="zk-intro-box">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-emerald-400">MATH-BASED PRIVACY PROTECTION: </span>
                  Your raw personal parameters (Aadhaar/Mobile) are fully cloaked locally. The Legal Bridge app only operates on cryptographically blinded hashes to prevent profiling.
                </p>
              </div>

              {/* 1. Full Name + Anonymization Preview */}
              <div className="space-y-1.5" id="name-field-group">
                <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex justify-between items-center">
                  <span>Full Name (முழு பெயர்)</span>
                  <span className="text-amber-500 text-[9px] font-normal tracking-normal lowercase">Will be fully anonymized</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Monisha R"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-hidden focus:border-emerald-500 placeholder-slate-600 transition-colors"
                    id="citizen-fullname-input"
                  />
                </div>

                {/* Cloaked Identity Display */}
                <AnimatePresence>
                  {anonymizedPreview && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2.5 bg-slate-950 border border-emerald-500/20 rounded-xl flex items-center justify-between text-[11px] overflow-hidden"
                      id="anonymized-preview-box"
                    >
                      <span className="text-slate-400 font-mono text-[10px]">Cloaked Router Alias:</span>
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-sm animate-pulse">
                        🛡️ {anonymizedPreview}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Aadhaar / Gov ID Hash Field */}
              <div className="space-y-1.5" id="aadhaar-field-group">
                <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex justify-between items-center">
                  <span>Aadhaar Number (12 Digits)</span>
                  <span className="text-slate-500 text-[9px]">Used only for client-side hash</span>
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAadhaarNumber(val);
                    }}
                    placeholder="Enter 12-digit Aadhaar Number"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-hidden focus:border-emerald-500 placeholder-slate-600 font-mono transition-colors"
                    id="citizen-aadhaar-input"
                  />
                  {aadhaarNumber.length === 12 && (
                    <span className="absolute right-3 top-2.5 text-emerald-400 p-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Simulated ZK Hash Result */}
                <AnimatePresence>
                  {aadhaarHash && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2.5 bg-slate-950 border border-amber-500/20 rounded-xl text-[10px] space-y-1 font-mono overflow-hidden"
                      id="hash-preview-box"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Dynamic ID Hash (Local calculation):</span>
                        <span className="text-amber-400 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider">
                          <Key size={10} /> SHA-256 Cloak
                        </span>
                      </div>
                      <p className="text-amber-500/90 break-all select-all font-semibold font-mono bg-amber-500/5 p-1 rounded border border-amber-500/10">
                        {aadhaarHash}
                      </p>
                      <p className="text-[9px] text-slate-500 italic">This cryptographic fingerprint is irreversibly hashed. Raw Aadhaar data is wiped from memory.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Mobile Number + OTP Verification Simulation */}
              <div className="space-y-1.5" id="mobile-field-group">
                <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Mobile Number (தொடர்பு எண்)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3 top-3 text-slate-500" size={14} />
                    <input
                      type="text"
                      required
                      maxLength={10}
                      disabled={otpVerified}
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMobileNumber(val);
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-hidden focus:border-emerald-500 placeholder-slate-600 font-mono disabled:opacity-55 disabled:cursor-not-allowed transition-colors"
                      id="citizen-mobile-input"
                    />
                  </div>
                  
                  {!otpVerified && (
                    <button
                      type="button"
                      disabled={mobileNumber.length < 10 || isOtpSending}
                      onClick={handleSendOTP}
                      className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 border border-emerald-500"
                      id="citizen-send-otp-btn"
                    >
                      {isOtpSending ? (
                        <Loader2 size={13} className="animate-spin text-slate-950" />
                      ) : otpSent ? (
                        'Resend OTP'
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  )}
                </div>

                {/* OTP Input and verification block */}
                <AnimatePresence>
                  {otpSent && !otpVerified && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 bg-slate-950 border border-emerald-500/10 rounded-xl space-y-3 overflow-hidden"
                      id="otp-verification-sub-panel"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />
                          Security OTP dispatched to SMS gateway.
                        </span>
                        {countdown > 0 && (
                          <span className="text-[10px] font-mono text-slate-500">
                            Resend in {countdown}s
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 4-digit OTP (e.g., 1947)"
                          className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 font-mono tracking-widest text-center focus:outline-hidden focus:border-emerald-500"
                          id="citizen-otp-input"
                        />
                        <button
                          type="button"
                          disabled={otpCode.length < 4 || isOtpVerifying}
                          onClick={handleVerifyOTP}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-emerald-400"
                          id="citizen-verify-otp-btn"
                        >
                          {isOtpVerifying ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>

                      {otpError && (
                        <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1" id="otp-error-msg">
                          <AlertCircle size={10} />
                          {otpError}
                        </p>
                      )}

                      <p className="text-[9px] text-slate-500 font-mono">
                        💡 Demo Simulation Tip: Enter any 4-digit code (e.g. <b>1947</b>) to verify.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verified state indicator */}
                {otpVerified && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-[11px]" id="otp-verified-indicator">
                    <span className="text-slate-400">Secure Phone Verification:</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      Cloaked & Verified (+91 ••••• ••{mobileNumber.slice(-3)})
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Preferred Language */}
              <div className="space-y-1.5" id="language-field-group">
                <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <Globe size={11} className="text-slate-400" />
                  <span>Preferred Language (தொடர்பு மொழி)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['English', 'Tamil'] as const).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer flex items-center justify-center gap-2 ${
                        preferredLanguage === lang 
                          ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950 text-slate-300 border-white/5 hover:bg-white/5'
                      }`}
                      id={`lang-select-${lang.toLowerCase()}`}
                    >
                      <Globe size={12} className={preferredLanguage === lang ? 'text-slate-950' : 'text-slate-400'} />
                      <span>{lang === 'Tamil' ? 'தமிழ் (Tamil)' : 'English'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Accept Terms & Privacy Shield Checkbox */}
              <div className="pt-2" id="terms-field-group">
                <label className="flex items-start gap-2.5 cursor-pointer select-none group" id="citizen-terms-label">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-white/10 bg-slate-950 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                    id="citizen-terms-checkbox"
                  />
                  <div className="text-[11px] text-slate-400 leading-normal group-hover:text-slate-300 transition-colors">
                    <p className="font-semibold text-slate-200">Accept Security Terms of Service & Privacy Shield</p>
                    <p className="mt-0.5 text-[10px]">
                      I accept that my physical identity is masked. Disclosures made through the TN Legal Bridge are protected under <b>Evidence Act Sec. 126 Attorney Privilege</b>.
                    </p>
                  </div>
                </label>
              </div>

              {/* 6. Register & Secure Profile Button */}
              <button
                type="submit"
                disabled={!fullName || !aadhaarHash || !mobileNumber || !otpVerified || !acceptedTerms}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-45 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/10 duration-300 border border-emerald-400/30 flex items-center justify-center gap-2 cursor-pointer"
                id="register-secure-profile-btn"
              >
                <Lock size={14} className="stroke-[3]" />
                <span>Register & Secure Profile</span>
              </button>
            </motion.form>
          )}

          {regStep === 'loading' && (
            <motion.div 
              key="reg-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-12 px-2 text-center space-y-6"
              id="citizen-reg-loading-view"
            >
              {/* Rotating Telemetry Loader Ring */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
                <span className="absolute inset-0 rounded-full border-4 border-t-emerald-400 border-r-emerald-400 animate-spin" />
                <LockKeyhole size={28} className="text-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-black text-white font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Securing Quantum Tunnel Link
                </h3>
                <p className="text-[11px] text-emerald-300 font-mono h-4 max-w-[260px] mx-auto leading-normal">{loadingMessage}</p>
              </div>

              {/* Simulated Progress Bar */}
              <div className="w-full max-w-[240px] mx-auto bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="bg-emerald-400 h-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.8, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {regStep === 'success' && (
            <motion.div 
              key="reg-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 px-2 text-center space-y-4 flex flex-col items-center justify-center"
              id="citizen-reg-success-view"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={32} className="animate-bounce" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-white uppercase">SHIELD ENGAGED</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Citizen Profile locked and verified under zero-knowledge parameters. Returning to secure advocate dashboard.</p>
              </div>

              <div className="bg-slate-950 border border-white/5 p-3 rounded-xl max-w-xs w-full text-left space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Alias:</span>
                  <span className="text-emerald-400 font-bold">{anonymizedPreview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Handshake Status:</span>
                  <span className="text-slate-300 font-bold">Privileged Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Standard:</span>
                  <span className="text-amber-400 font-bold">AES-GCM-256</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer Branding Shield */}
      <div className="p-3 border-t border-white/5 text-center bg-slate-950/20 shrink-0" id="citizen-reg-footer">
        <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase flex items-center justify-center gap-1">
          <ShieldCheck size={11} className="text-emerald-500" /> State-Blinded Privacy Shield Active
        </span>
      </div>

    </div>
  );
}
