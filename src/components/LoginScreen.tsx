import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, ArrowRight, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; email: string; avatarUrl?: string }) => void;
  userEmail?: string;
}

export default function LoginScreen({ onLoginSuccess, userEmail = 'monisha.r0810@gmail.com' }: LoginScreenProps) {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleStartGoogleFlow = () => {
    setIsGoogleModalOpen(true);
  };

  const handleSelectAccount = (email: string, name: string) => {
    setIsGoogleModalOpen(false);
    setLoginStep('loading');
    
    // Simulate high-fidelity security handshake steps
    setLoadingMessage('Connecting to Google Identity Services...');
    
    setTimeout(() => {
      setLoadingMessage('Verifying secure TLS credentials...');
    }, 600);

    setTimeout(() => {
      setLoadingMessage('Initializing Quiet Protocol key exchange...');
    }, 1200);

    setTimeout(() => {
      setLoadingMessage('Synchronizing grievance portal credentials...');
    }, 1800);

    setTimeout(() => {
      setLoginStep('success');
    }, 2400);

    setTimeout(() => {
      // Return user info
      onLoginSuccess({
        name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      });
    }, 3200);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-950 flex flex-col justify-between p-6 overflow-y-auto select-none font-sans" id="login-screen-root">
      
      {/* Background glowing gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100%_16px] opacity-20 pointer-events-none" />

      {/* 1. Official branding emblem block at the top */}
      <div className="flex flex-col items-center text-center pt-4 z-10" id="official-emblem-container">
        <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-xl border border-amber-400/80 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105" id="emblem-shield">
          {!logoError ? (
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/81/Emblem_of_Tamil_Nadu.svg" 
              alt="Government of Tamil Nadu Emblem" 
              className="w-16 h-16 object-contain"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-16 h-16 text-amber-500 flex items-center justify-center">
              {/* Fallback temple tower logo */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M50 15 L32 75 L38 75 L39 65 L61 65 L62 75 L68 75 Z" opacity="0.85" />
                <path d="M50 25 L41 55 L59 55 Z" fill="#15803d" />
                <rect x="47" y="55" width="6" height="20" />
                <line x1="25" y1="80" x2="75" y2="80" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="15" r="3" />
              </svg>
            </div>
          )}
        </div>
        
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 mt-3">
          Government of Tamil Nadu
        </span>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide font-mono mt-0.5">
          Unified Citizen Services Portal
        </h2>
      </div>

      {/* 2. Quiet branding & Sign In Actions */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm w-full mx-auto py-8 z-10" id="brand-main-block">
        <AnimatePresence mode="wait">
          {loginStep === 'idle' && (
            <motion.div 
              key="login-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-8"
              id="idle-container"
            >
              {/* Quiet App Visual Identity Logo */}
              <div className="space-y-2">
                <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl mx-auto flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/5">
                  <Lock size={26} className="animate-pulse" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white font-sans mt-3">
                  Quiet <span className="text-indigo-400 font-medium font-mono text-lg">Protocol</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                  A high-security, silent communication space combined with an end-to-end encrypted official Grievance Portal.
                </p>
              </div>

              {/* Continue with Google button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleStartGoogleFlow}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl border border-slate-200 transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer group"
                  id="google-signin-btn"
                >
                  {/* Google SVG Logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.133C18.29 1.844 15.56 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.56-4.453 10.56-10.715 0-.722-.075-1.275-.165-1.7H12.24z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight size={15} className="text-slate-400 group-hover:translate-x-1 transition-transform ml-auto" />
                </button>

                <div className="flex items-center gap-2 justify-center text-[10px] font-mono text-slate-500 bg-slate-900/50 border border-white/5 py-1.5 px-3 rounded-lg max-w-xs mx-auto">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  <span>Authorized by TN Electronics Division</span>
                </div>
              </div>
            </motion.div>
          )}

          {loginStep === 'loading' && (
            <motion.div 
              key="loading-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-6 bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
              id="loading-container"
            >
              {/* Telemetry Loader */}
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                <span className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 animate-spin" />
                <Lock size={20} className="text-indigo-400 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase">Securing Connection</h3>
                <p className="text-[11px] text-indigo-300 font-mono h-4">{loadingMessage}</p>
              </div>

              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="bg-indigo-500 h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.2, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {loginStep === 'success' && (
            <motion.div 
              key="success-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-4"
              id="success-container"
            >
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-600/5">
                <CheckCircle2 size={26} className="animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-white">ACCESS GRANTED</h3>
                <p className="text-xs text-slate-400">Quiet Protocol environment synchronized successfully.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Secure encrypted privacy footer */}
      <div className="text-center py-4 border-t border-white/5 z-10" id="login-footer">
        <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
          🛡️ Secure, Encrypted & Private by Quiet Protocol
        </p>
        <p className="text-[9px] font-mono text-slate-600 mt-1">
          AES-GCM 256 Handshake • Zero Knowledge Claims • Govt Sandbox v2026.7
        </p>
      </div>

      {/* 4. Google account selection simulated popup modal */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="google-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white text-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
              id="google-modal"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex flex-col items-center text-center">
                {/* Official Google G Logo */}
                <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Choose an account</h3>
                <p className="text-xs text-slate-500 mt-1">to continue to <span className="font-semibold text-indigo-600">Quiet Protocol</span></p>
              </div>

              {/* Account list */}
              <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                
                {/* 1. Real User Email from Metadata */}
                <button
                  type="button"
                  onClick={() => handleSelectAccount(userEmail, 'Monisha R')}
                  className="w-full p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                  id="account-option-meta"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200 uppercase">
                    MR
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Monisha R</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">{userEmail}</p>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase">
                    Detected
                  </span>
                </button>

                {/* 2. Optional Mock Test Account */}
                <button
                  type="button"
                  onClick={() => handleSelectAccount('test.sandbox@quiet.gov.in', 'Zonal Sec Officer')}
                  className="w-full p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                  id="account-option-officer"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200 uppercase">
                    ZS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Zonal Security Officer</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">test.sandbox@quiet.gov.in</p>
                  </div>
                </button>

                {/* 3. Add other account option */}
                <button
                  type="button"
                  onClick={() => handleSelectAccount('guest.user@gmail.com', 'Guest Citizen')}
                  className="w-full p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                  id="account-option-guest"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                    G
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">Continue as Guest</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">guest.user@gmail.com</p>
                  </div>
                </button>
              </div>

              {/* Close Button / Notice */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[9px] text-slate-400 font-mono max-w-[200px] leading-snug">
                  Before continuing, Google will share your name and email address with Quiet Protocol.
                </span>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  id="google-modal-close"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
