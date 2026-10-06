import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Scale, 
  AlertCircle,
  Info,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { CaseContext } from '../types';

// Case categories and legal sections dynamic mapping
export const caseData = {
  Criminal: [
    { section: 'Section 323 IPC', description: 'Voluntarily causing hurt (punishment up to 1 year or fine)' },
    { section: 'Section 378 IPC', description: 'Theft (dishonest moving of property out of possession without consent)' },
    { section: 'Section 406 IPC', description: 'Criminal breach of trust (misappropriation of entrusted property)' },
    { section: 'Section 420 IPC', description: 'Cheating and dishonestly inducing delivery of property' },
    { section: 'Section 506 IPC', description: 'Criminal intimidation (threatening injury to person, reputation, or property)' }
  ],
  Civil: [
    { section: 'Section 9 CPC', description: 'Civil courts to try all civil suits unless barred specifically' },
    { section: 'Section 26 CPC', description: 'Institution of suits through presentation of a plaint' },
    { section: 'Section 38 CPC', description: 'Enforcement and execution of decrees by courts' },
    { section: 'Section 96 CPC', description: 'Appeals from original decrees to designated higher forums' },
    { section: 'Section 115 CPC', description: 'Revision applications in jurisdictional error challenges' }
  ],
  Property: [
    { section: 'Section 54 Transfer of Property Act', description: 'Sale of immovable property and rights of buyers/sellers' },
    { section: 'Section 58 Transfer of Property Act', description: 'Mortgages of immovable property and charge creation' },
    { section: 'Section 105 Transfer of Property Act', description: 'Lease of immovable property, rights, and liabilities' },
    { section: 'Section 17 Registration Act', description: 'Documents of which registration is compulsory for validity' },
    { section: 'Section 31 Specific Relief Act', description: 'Cancellation of instruments containing void/voidable titles' }
  ]
};

interface LegalRegistrationProps {
  onSaveContext: (context: CaseContext) => void;
  initialCategory?: 'Criminal' | 'Civil' | 'Property';
  onClose?: () => void;
}

/**
 * LegalRegistration Component
 * 
 * Implements cascading dropdowns for case category and sections, captures user legal context,
 * and attaches detailed law summaries to aid in secure masked consultations.
 */
export default function LegalRegistration({ onSaveContext, initialCategory = 'Criminal', onClose }: LegalRegistrationProps) {
  const [category, setCategory] = useState<'Criminal' | 'Civil' | 'Property'>(initialCategory);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [summary, setSummary] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // When category changes, reset the selected section index to the first item
  useEffect(() => {
    setSelectedSectionIndex(0);
  }, [category]);

  const currentSections = caseData[category];
  const activeSection = currentSections[selectedSectionIndex] || currentSections[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const context: CaseContext = {
      category,
      section: activeSection.section,
      sectionDescription: activeSection.description,
      summary: summary.trim() || 'No additional summary details provided.'
    };

    onSaveContext(context);
    setIsSaved(true);

    // Dynamic reset animation state after short delay
    setTimeout(() => {
      setIsSaved(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden text-slate-100" id="legal-registration-card">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4" id="registration-header">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Scale size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Case Registration Tunnel</h3>
            <p className="text-[10px] text-slate-400 font-mono">Assign legal context & jurisdiction parameters</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      {isSaved ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 flex flex-col items-center justify-center text-center space-y-3"
          id="registration-saved-state"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">Context Encrypted & Saved</p>
          <p className="text-[10px] text-slate-400 max-w-xs">Connecting to matching secure advocate relay...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" id="legal-registration-form">
          
          {/* Cascading Category Selector */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1">
              <span>1. Case Category (வகை)</span>
              <HelpCircle size={10} className="text-slate-500" />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Criminal', 'Civil', 'Property'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                    category === cat 
                      ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-300 border-white/5 hover:bg-white/5'
                  }`}
                  id={`cat-select-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cascading Relevant Sections Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              2. Relevant Section (சட்டப் பிரிவு)
            </label>
            <div className="relative">
              <select
                value={selectedSectionIndex}
                onChange={(e) => setSelectedSectionIndex(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white outline-hidden focus:border-amber-500 cursor-pointer appearance-none"
                id="section-cascade-dropdown"
              >
                {currentSections.map((item, idx) => (
                  <option key={item.section} value={idx}>
                    {item.section}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* UI Enhancement: Section Meaning & Description Box */}
          <motion.div 
            key={activeSection?.section}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-slate-950/80 border border-white/5 rounded-xl flex gap-2.5 items-start"
            id="section-meaning-info"
          >
            <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-400 font-mono">{activeSection?.section}:</span>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{activeSection?.description}</p>
            </div>
          </motion.div>

          {/* User Case Summary Details */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              3. Summary / Additional Context (வழக்கின் சுருக்கம் - Confidential)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="E.g., I received a legal notice regarding a property partition boundary dispute in Coimbatore..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              id="case-summary-textarea"
            />
          </div>

          {/* Safe Sandbox Warning Card */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex gap-2 items-start text-[10px] text-slate-300 font-mono">
            <ShieldCheck size={14} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold text-indigo-300">Masking Layer Active: </span>
              Your input remains strictly local. The system converts inputs to a temporary legal brief transmitted under attorney-client privilege.
            </p>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            id="confirm-case-context-btn"
          >
            Confirm Legal Context & Proceed
          </button>
        </form>
      )}
    </div>
  );
}
