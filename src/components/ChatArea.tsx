import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message, ChatThemeName } from '../types';
import { 
  Send, 
  VolumeX, 
  Volume2, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  Info,
  Smartphone,
  EyeOff,
  FolderOpen,
  Play,
  Image,
  Video,
  X,
  Eye,
  Paperclip,
  FileText,
  Lock,
  Unlock,
  Archive,
  ShieldAlert,
  Mic,
  Square,
  Ban,
  Palette,
  Sparkles,
  MapPin,
  Share2,
  Copy,
  FileDown,
  ExternalLink,
  IndianRupee,
  CreditCard,
  Wallet,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  QrCode,
  Camera,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Live custom encrypted scramble synthesizer
let activeOscillator: OscillatorNode | null = null;
let activeGain: GainNode | null = null;
let activeAudioCtx: AudioContext | null = null;

function startVoiceSynth() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    activeAudioCtx = new AudioContextClass();
    const ctx = activeAudioCtx;
    
    activeOscillator = ctx.createOscillator();
    activeGain = ctx.createGain();
    
    activeOscillator.connect(activeGain);
    activeGain.connect(ctx.destination);
    
    activeOscillator.type = 'triangle'; // pleasant soft hum
    activeOscillator.frequency.setValueAtTime(140, ctx.currentTime);
    
    // Add voice-like vibrato (LFO)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 8; // 8Hz modulation
    lfoGain.gain.value = 15; // modulate frequency by 15Hz
    lfo.connect(lfoGain);
    lfoGain.connect(activeOscillator.frequency);
    lfo.start();
    
    activeGain.gain.setValueAtTime(0.06, ctx.currentTime);
    activeOscillator.start();
  } catch (e) {
    console.warn("Voice synthesizer failed to start:", e);
  }
}

function stopVoiceSynth() {
  try {
    if (activeOscillator) {
      activeOscillator.stop();
      activeOscillator.disconnect();
      activeOscillator = null;
    }
    if (activeGain) {
      activeGain.disconnect();
      activeGain = null;
    }
    if (activeAudioCtx) {
      activeAudioCtx.close();
      activeAudioCtx = null;
    }
  } catch (e) {
    console.warn("Voice synthesizer failed to stop:", e);
  }
}

export interface ThemeStyles {
  name: string;
  bgClass: string;
  bubbleClass: string;
  buttonClass: string;
  accentTextClass: string;
  playProgressClass: string;
  borderClass: string;
  previewIconColor: string;
}

export const THEMES: Record<ChatThemeName, ThemeStyles> = {
  midnight: {
    name: 'Midnight Slate',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(30,27,75,0.4),rgba(15,23,42,0.4))]',
    bubbleClass: 'bg-indigo-600 text-white shadow-indigo-500/20',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    accentTextClass: 'text-indigo-400',
    playProgressClass: 'bg-indigo-500',
    borderClass: 'border-indigo-500/30',
    previewIconColor: 'bg-indigo-500',
  },
  emerald: {
    name: 'Cyber Stealth',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(6,78,59,0.3),rgba(9,9,11,0.5))]',
    bubbleClass: 'bg-emerald-600 text-white shadow-emerald-500/20',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accentTextClass: 'text-emerald-400',
    playProgressClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500/30',
    previewIconColor: 'bg-emerald-500',
  },
  lavender: {
    name: 'Quiet Lavender',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(88,28,135,0.25),rgba(15,23,42,0.4))]',
    bubbleClass: 'bg-purple-600 text-white shadow-purple-500/20',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    accentTextClass: 'text-purple-400',
    playProgressClass: 'bg-purple-500',
    borderClass: 'border-purple-500/30',
    previewIconColor: 'bg-purple-500',
  },
  crimson: {
    name: 'Rose Sanctuary',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(159,18,57,0.25),rgba(15,23,42,0.4))]',
    bubbleClass: 'bg-rose-600 text-white shadow-rose-500/20',
    buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    accentTextClass: 'text-rose-400',
    playProgressClass: 'bg-rose-500',
    borderClass: 'border-rose-500/30',
    previewIconColor: 'bg-rose-500',
  },
  ocean: {
    name: 'Glacier Ocean',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(8,86,139,0.25),rgba(15,23,42,0.4))]',
    bubbleClass: 'bg-sky-600 text-white shadow-sky-500/20',
    buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white',
    accentTextClass: 'text-sky-400',
    playProgressClass: 'bg-sky-500',
    borderClass: 'border-sky-500/30',
    previewIconColor: 'bg-sky-500',
  },
  amber: {
    name: 'Tactical Amber',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,rgba(120,53,4,0.25),rgba(9,9,11,0.5))]',
    bubbleClass: 'bg-amber-500 text-slate-950 font-semibold shadow-amber-500/20',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold',
    accentTextClass: 'text-amber-400',
    playProgressClass: 'bg-amber-500',
    borderClass: 'border-amber-500/30',
    previewIconColor: 'bg-amber-500',
  },
};

interface LocationPreset {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'googleplex',
    name: 'Googleplex HQ',
    address: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    lat: 37.4220,
    lng: -122.0841
  },
  {
    id: 'goldengate',
    name: 'Golden Gate Park',
    address: 'Golden Gate Park, San Francisco, CA 94122',
    lat: 37.7694,
    lng: -122.4862
  },
  {
    id: 'timessquare',
    name: 'Times Square',
    address: 'Broadway & 42nd St, New York, NY 10036',
    lat: 40.7580,
    lng: -73.9855
  },
  {
    id: 'eiffeltower',
    name: 'Eiffel Tower',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    lat: 48.8584,
    lng: 2.2945
  }
];

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (
    text: string,
    mediaType?: 'image' | 'video' | 'file' | 'audio' | 'location' | 'payment',
    mediaUrl?: string,
    fileName?: string,
    fileSize?: string,
    duration?: number,
    paymentAmount?: number,
    paymentStatus?: 'pending' | 'success' | 'declined',
    paymentType?: 'send' | 'request' | 'receipt'
  ) => void;
  onToggleQuiet: (id: string) => void;
  onToggleBlock: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleLock: (id: string, pin?: string) => void;
  onTriggerVideoCall: (contact: Contact) => void;
  contacts: Contact[];
  onSetChatTheme: (id: string, theme: ChatThemeName) => void;
  readReceiptsEnabled: boolean;
  hideLastSeen: boolean;
  onUpdateMessageStatus: (
    messageId: string, 
    status: 'pending' | 'success' | 'declined',
    extra?: Partial<Message>
  ) => void;
  onBackToList?: () => void;
  onAcceptCase?: (contactId: string) => void;
}

export default function ChatArea({
  contact,
  messages,
  onSendMessage,
  onToggleQuiet,
  onToggleBlock,
  onToggleArchive,
  onToggleLock,
  onTriggerVideoCall,
  contacts,
  onSetChatTheme,
  readReceiptsEnabled,
  hideLastSeen,
  onUpdateMessageStatus,
  onBackToList,
  onAcceptCase,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Secure payment panel states
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'send' | 'request'>('send');
  const [payAmountInput, setPayAmountInput] = useState('');
  const [payNoteInput, setPayNoteInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessingStage, setPaymentProcessingStage] = useState<'idle' | 'authorizing' | 'securing' | 'success'>('idle');

  // QR Code Payment Scanner states
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrScanStep, setQrScanStep] = useState<'idle' | 'scanning' | 'detected' | 'authorizing' | 'success'>('idle');
  const [scannedMerchant, setScannedMerchant] = useState('TN Grievance Portal - Merchant');
  const [scannedUpi, setScannedUpi] = useState('pay.tngrievance@okaxis');
  const [scannedAmount, setScannedAmount] = useState('500');

  // Helper to synthesize a neat hardware camera QR scanner beep sound
  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1400, audioCtx.currentTime); // 1400Hz high pitch chirp
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime); // safe low volume
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1); // play for 100ms
    } catch (e) {
      console.warn("Web Audio Context blocked or not supported on this client:", e);
    }
  };

  // Automated Scanner Viewport auto-detect timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQrScanner && qrScanStep === 'scanning') {
      timer = setTimeout(() => {
        playScanBeep();
        setQrScanStep('detected');
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [showQrScanner, qrScanStep]);

  // Export Chat menu states
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Show a temporary visual status message/toast
  const showToast = (message: string) => {
    setExportToast(message);
    setTimeout(() => {
      setExportToast(null);
    }, 3000);
  };

  // 1. Copy All (to clipboard)
  const handleCopyAll = () => {
    if (!contact) return;
    const chatHeader = `=== SECURE CHAT EXPORT: ${contact.name.toUpperCase()} ===\n`;
    const chatBody = activeMessages.map(m => {
      const senderName = m.sender === 'me' ? 'You' : contact.name;
      let textContent = m.text;
      if (m.mediaType === 'payment') {
        textContent = m.paymentType === 'send'
          ? `[Payment Sent: ₹${m.paymentAmount} - Status: ${m.paymentStatus}] ${m.text}`
          : m.paymentType === 'request'
            ? `[Payment Requested: ₹${m.paymentAmount} - Status: ${m.paymentStatus}] ${m.text}`
            : `[Payment Received Receipt: ₹${m.paymentAmount}] ${m.text}`;
      } else if (m.mediaType) {
        textContent = `[Attachment ${m.mediaType.toUpperCase()}]: ${m.text || m.fileName || ''}`;
      }
      return `[${m.timestamp}] ${senderName}: ${textContent}`;
    }).join('\n');

    navigator.clipboard.writeText(chatHeader + chatBody)
      .then(() => {
        showToast("Chat copied to clipboard!");
        setShowExportMenu(false);
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
        showToast("Clipboard copy failed. Please try again.");
      });
  };

  // 2. Convert to PDF
  const handleExportPDF = async () => {
    if (!contact) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "normal");
      
      // Header Section
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`Secure Chat Export: ${contact.name}`, 15, 20);
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exported at: ${new Date().toLocaleString()}`, 15, 26);
      doc.text(`E2EE Sandbox Protocol Client-Side Verified`, 15, 31);
      doc.line(15, 34, 195, 34);
      
      let y = 43;
      doc.setFontSize(10);
      
      activeMessages.forEach((msg) => {
        const senderName = msg.sender === 'me' ? 'You' : contact.name;
        let textContent = msg.text;
        if (msg.mediaType === 'payment') {
          textContent = msg.paymentType === 'send'
            ? `[Payment Sent: ₹${msg.paymentAmount} - ${msg.paymentStatus?.toUpperCase()}] ${msg.text}`
            : msg.paymentType === 'request'
              ? `[Payment Requested: ₹${msg.paymentAmount} - ${msg.paymentStatus?.toUpperCase()}] ${msg.text}`
              : `[Payment Receipt: ₹${msg.paymentAmount}] ${msg.text}`;
        } else if (msg.mediaType) {
          textContent = `[Attachment ${msg.mediaType.toUpperCase()}]: ${msg.text || msg.fileName || ''}`;
        }

        const msgString = `[${msg.timestamp}] ${senderName}: ${textContent}`;
        const lines = doc.splitTextToSize(msgString, 175);
        
        if (y + lines.length * 5.5 > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.setTextColor(msg.sender === 'me' ? 30 : 0);
        lines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += 5.5;
        });
        y += 2.5; // spacing
      });
      
      doc.save(`chat-export-${contact.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`);
      showToast("PDF generated and downloaded!");
      setShowExportMenu(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("PDF generation failed.");
    }
  };

  // 3. Share (via system sheet if supported, else fallback to Clipboard Copy)
  const handleShareSheet = () => {
    if (!contact) return;
    const shareText = activeMessages.map(m => {
      const senderName = m.sender === 'me' ? 'You' : contact.name;
      let textContent = m.text;
      if (m.mediaType === 'payment') {
        textContent = m.paymentType === 'send'
          ? `[Payment Sent: ₹${m.paymentAmount}] ${m.text}`
          : m.paymentType === 'request'
            ? `[Payment Request: ₹${m.paymentAmount}] ${m.text}`
            : `[Payment Receipt: ₹${m.paymentAmount}] ${m.text}`;
      } else if (m.mediaType) {
        textContent = `[Attachment ${m.mediaType.toUpperCase()}]: ${m.text || m.fileName || ''}`;
      }
      return `[${m.timestamp}] ${senderName}: ${textContent}`;
    }).join('\n');

    if (navigator.share) {
      navigator.share({
        title: `Chat with ${contact.name}`,
        text: shareText
      })
      .then(() => {
        showToast("Shared successfully!");
        setShowExportMenu(false);
      })
      .catch((err) => {
        console.warn("System share cancelled or failed:", err);
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(shareText)
        .then(() => {
          showToast("Share sheet unavailable. Copied text to clipboard!");
          setShowExportMenu(false);
        })
        .catch(() => {
          showToast("Sharing failed.");
        });
    }
  };

  // Share Receipt from successful payment to generate a 'Payment Received' card
  const handleShareReceipt = (msg: Message) => {
    onSendMessage(
      `Receipt for ₹${msg.paymentAmount} paid towards "${msg.text || 'No note'}"`,
      'payment',
      undefined,
      undefined,
      undefined,
      undefined,
      msg.paymentAmount,
      'success',
      'receipt'
    );
    showToast("Receipt shared as receipt card!");
  };

  // Pay Request and change status to success
  const handlePayRequest = (msg: Message) => {
    onUpdateMessageStatus(msg.id, 'success');
    showToast(`Paid ₹${msg.paymentAmount} successfully!`);
  };

  // File Picker states and ref
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    url: string;
    mediaType: 'image' | 'video' | 'file';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording & Audio Playback states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Lock PIN setups
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // Simulated Location Sharing states
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState<'current' | 'live' | 'preset'>('current');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('googleplex');
  const [isGpsAcquiring, setIsGpsAcquiring] = useState(false);
  const [gpsAcquisitionProgress, setGpsAcquisitionProgress] = useState(0);

  // GPS Satellite Calibration effect on selection change
  useEffect(() => {
    if (showLocationPicker) {
      setIsGpsAcquiring(true);
      setGpsAcquisitionProgress(0);
      const interval = setInterval(() => {
        setGpsAcquisitionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGpsAcquiring(false);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showLocationPicker, selectedLocationType, selectedPresetId]);

  const handleSendLocation = () => {
    let text = '';
    let coordinates = '';
    let label = ''; // label for specific preset identifier

    if (selectedLocationType === 'current') {
      text = 'Current Location (Silicon Valley Tech Hub)';
      coordinates = '37.4220,-122.0841';
      label = 'current';
    } else if (selectedLocationType === 'live') {
      text = 'Live Location (Active for 1 hour)';
      coordinates = '37.7749,-122.4194';
      label = 'live';
    } else {
      const preset = LOCATION_PRESETS.find(p => p.id === selectedPresetId);
      if (preset) {
        text = `${preset.name} - ${preset.address}`;
        coordinates = `${preset.lat},${preset.lng}`;
        label = preset.id;
      }
    }

    onSendMessage(text, 'location', coordinates, label);
    setShowLocationPicker(false);
  };

  // Recording Timer Effect
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Audio Progress Simulator Effect
  useEffect(() => {
    if (playingAudioId) {
      startVoiceSynth();
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[playingAudioId] || 0;
          if (current >= 100) {
            setPlayingAudioId(null);
            clearInterval(interval);
            return { ...prev, [playingAudioId]: 100 };
          }
          const duration = messages.find(m => m.id === playingAudioId)?.duration || 5;
          const step = 10 / duration; // progression percentage per 100ms
          return { ...prev, [playingAudioId]: Math.min(100, current + step) };
        });
      }, 100);
      return () => {
        clearInterval(interval);
        stopVoiceSynth();
      };
    } else {
      stopVoiceSynth();
    }
  }, [playingAudioId]);

  const handleTogglePlayAudio = (msgId: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      if ((audioProgress[msgId] || 0) >= 100) {
        setAudioProgress(prev => ({ ...prev, [msgId]: 0 }));
      }
      setPlayingAudioId(msgId);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let mediaType: 'image' | 'video' | 'file' = 'file';
    if (file.type.startsWith('image/')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'video';
    }

    const sizeInKb = file.size / 1024;
    const formattedSize = sizeInKb > 1024 
      ? `${(sizeInKb / 1024).toFixed(1)} MB` 
      : `${sizeInKb.toFixed(0)} KB`;

    const url = URL.createObjectURL(file);

    setSelectedFile({
      name: file.name,
      size: formattedSize,
      type: file.type,
      url,
      mediaType,
    });
  };

  // Remove selected file
  const handleRemoveFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.url);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up selected file on contact switch to prevent memory leaks
  useEffect(() => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.url);
      setSelectedFile(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowThemeDropdown(false);
    setShowLocationPicker(false);
    setShowMediaGallery(false);
  }, [contact?.id]);

  // Filter messages for the current active contact
  const activeMessages = contact 
    ? messages.filter(m => m.contactId === contact.id) 
    : [];

  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  useEffect(() => {
    if (!contact) {
      setSmartReplies([]);
      return;
    }

    if (activeMessages.length === 0) {
      setSmartReplies([]);
      return;
    }

    let isMounted = true;
    const fetchSmartReplies = async () => {
      setIsLoadingReplies(true);
      try {
        const response = await fetch("/api/suggest-replies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: activeMessages.map(m => ({ sender: m.sender, text: m.text })),
            contactName: contact.name
          }),
        });
        const data = await response.json();
        if (isMounted && data.suggestions) {
          setSmartReplies(data.suggestions);
        }
      } catch (err) {
        console.error("Failed to fetch smart replies:", err);
      } finally {
        if (isMounted) {
          setIsLoadingReplies(false);
        }
      }
    };

    fetchSmartReplies();

    return () => {
      isMounted = false;
    };
  }, [contact?.id, activeMessages.length]);

  const currentTheme = THEMES[contact?.chatTheme || 'midnight'] || THEMES.midnight;

  // Scroll to bottom whenever messages list or contact changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, contact?.id]);

  const handleSendVoiceNote = () => {
    if (recordingSeconds === 0) {
      setIsRecordingVoice(false);
      return;
    }
    onSendMessage(
      `🎙️ Secure Scrambled Memo`,
      'audio',
      'simulated-voice-note.mp3',
      undefined,
      undefined,
      recordingSeconds
    );
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const hasText = !!inputText.trim();
    const hasFile = !!selectedFile;
    if (!hasText && !hasFile) return;

    if (hasFile && selectedFile) {
      onSendMessage(
        inputText.trim(),
        selectedFile.mediaType,
        selectedFile.url,
        selectedFile.name,
        selectedFile.size
      );
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      onSendMessage(inputText.trim());
    }
    setInputText('');
  };

  // Filter media from only Loud contacts for the Primary Media Gallery
  const primaryMedia = messages.filter(m => {
    if (!m.mediaUrl) return false;
    const c = contacts.find(item => item.id === m.contactId);
    return c && !c.isQuiet && !m.isQuietMessage;
  });

  // Calculate suppressed media from Quiet contacts
  const suppressedMediaCount = messages.filter(m => {
    if (!m.mediaUrl) return false;
    const c = contacts.find(item => item.id === m.contactId);
    return c && (c.isQuiet || m.isQuietMessage);
  }).length;

  if (!contact) {
    return (
      <div className="flex-1 hidden md:flex bg-white/5 backdrop-blur-md flex-col items-center justify-center p-8 text-center text-slate-400" id="no-chat-selected">
        <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-slate-300 shadow-xs mb-4">
          <Smartphone size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200">No Conversation Selected</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Select a contact from your Primary Inbox or Quiet Folder to start messaging and test quiet controls.
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`flex-1 ${contact ? 'flex' : 'hidden md:flex'} ${currentTheme.bgClass} backdrop-blur-md flex-col h-full overflow-hidden text-slate-100 relative z-10 min-w-0`} 
      style={{ flex: 1 }}
      id="chat-area-container"
    >
      {/* Chat Header */}
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between shadow-xs backdrop-blur-md" id="chat-header">
        <div className="flex items-center gap-3">
          {/* Back Button for Mobile */}
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer mr-0.5"
              id="chat-back-to-list-btn"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          {/* Avatar */}
          <div className="relative">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-base ${contact.avatarColor}`}>
              {contact.name.substring(0, 2).replace(/[^a-zA-Z]/g, '') || contact.name.substring(0, 1)}
            </div>
            {contact.status === 'online' && !hideLastSeen && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            )}
            {contact.status === 'typing' && !hideLastSeen && (
              <span className="absolute bottom-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-white text-lg tracking-tight">{contact.name}</h2>
              <span className="text-[11px] bg-white/10 text-slate-300 font-semibold px-2.5 py-0.5 rounded-full border border-white/5 uppercase tracking-wider">
                {contact.role}
              </span>
            </div>
            <p className="text-[13px] text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
              <span>
                {hideLastSeen 
                  ? 'Last Seen: Hidden' 
                  : contact.status === 'online' 
                    ? 'Online' 
                    : contact.status === 'typing' 
                      ? 'typing...' 
                      : 'Offline'}
              </span>
              <span>•</span>
              {contact.isQuiet ? (
                <span className="text-pink-400 font-bold flex items-center gap-1">
                  <VolumeX size={14} /> Quiet Folder
                </span>
              ) : (
                <span className={`font-bold flex items-center gap-1 ${currentTheme.accentTextClass}`}>
                  <Volume2 size={14} /> Primary Inbox
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Simulated Video Call */}
          <button
            type="button"
            onClick={() => onTriggerVideoCall(contact)}
            className="flex items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-700 border border-emerald-500/30 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10"
            title="Start Encrypted Video Call"
            id="video-call-btn"
          >
            <Video size={14} />
          </button>

          {/* Secure Passcode Chat Lock */}
          <button
            type="button"
            onClick={() => {
              if (contact.isLocked) {
                onToggleLock(contact.id);
              } else {
                setShowPinSetup(true);
                setPinInput('');
              }
            }}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              contact.isLocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
            title={contact.isLocked ? "🔒 Chat Locked (Tap to disable)" : "🔓 Secure with Chat Lock"}
            id="lock-chat-btn"
          >
            {contact.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          {/* Archive Toggle */}
          <button
            type="button"
            onClick={() => onToggleArchive(contact.id)}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              contact.isArchived
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
            title={contact.isArchived ? "Unarchive conversation" : "Archive conversation"}
            id="archive-chat-btn"
          >
            <Archive size={14} />
          </button>

          {/* Block User Toggle */}
          <button
            type="button"
            onClick={() => onToggleBlock(contact.id)}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              contact.isBlocked
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-rose-400'
            }`}
            title={contact.isBlocked ? "🚫 User Blocked (Tap to unblock)" : "🚫 Block Contact"}
            id="block-user-btn"
          >
            <Ban size={14} />
          </button>

          <span className="w-[1px] h-6 bg-white/10 mx-1" />

          {/* Theme Selector Palette Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemeDropdown(prev => !prev)}
              className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                showThemeDropdown 
                  ? `${currentTheme.buttonClass} border-transparent` 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
              }`}
              title="🎨 Customize Chat Theme"
              id="theme-selector-btn"
            >
              <Palette size={14} />
            </button>

            <AnimatePresence>
              {showThemeDropdown && (
                <>
                  {/* Invisible overlay to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemeDropdown(false)} 
                  />
                  
                  {/* Dropdown container */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 text-xs"
                    id="theme-dropdown-menu"
                  >
                    <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-white/5 mb-1.5 flex items-center justify-between">
                      <span>Select Chat Theme</span>
                      <Palette size={10} className={currentTheme.accentTextClass} />
                    </div>
                    {Object.entries(THEMES).map(([themeKey, config]) => {
                      const isSelected = contact.chatTheme === themeKey || (themeKey === 'midnight' && !contact.chatTheme);
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => {
                            onSetChatTheme(contact.id, themeKey as ChatThemeName);
                            setShowThemeDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                            isSelected 
                              ? 'bg-white/10 text-white font-semibold' 
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Color preview circle */}
                            <div className={`w-3.5 h-3.5 rounded-full ${config.previewIconColor} border border-white/25 shadow-xs`} />
                            <span>{config.name}</span>
                          </div>
                          {isSelected && (
                            <Check size={12} className={currentTheme.accentTextClass} />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Shared Media Gallery Button */}
          <button
            type="button"
            onClick={() => {
              setShowMediaGallery(prev => !prev);
              setShowLocationPicker(false);
              setShowExportMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs border transition-all cursor-pointer ${
              showMediaGallery
                ? `${currentTheme.buttonClass} border-transparent shadow-md`
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
            id="open-media-gallery-btn"
          >
            <FolderOpen size={14} />
            <span className="hidden sm:inline">Shared Media</span>
          </button>

          {/* Export & Sharing Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowExportMenu(prev => !prev);
                setShowThemeDropdown(false);
                setShowMediaGallery(false);
                setShowLocationPicker(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs border transition-all cursor-pointer ${
                showExportMenu
                  ? `${currentTheme.buttonClass} border-transparent shadow-md`
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
              }`}
              id="export-chat-menu-btn"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Export Chat</span>
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 text-xs"
                    id="export-chat-dropdown-menu"
                  >
                    <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-white/5 mb-1.5 flex items-center justify-between">
                      <span>Export options</span>
                      <Share2 size={10} className={currentTheme.accentTextClass} />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-xs"
                      id="export-action-copy-all"
                    >
                      <Copy size={14} className="text-indigo-400" />
                      <span>Copy All Text</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-xs"
                      id="export-action-pdf"
                    >
                      <FileDown size={14} className="text-emerald-400" />
                      <span>Convert to PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareSheet}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-xs"
                      id="export-action-share-sheet"
                    >
                      <ExternalLink size={14} className="text-pink-400" />
                      <span>Share Chat</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Quiet Mode Control Button */}
          <button
            type="button"
            onClick={() => {
              onToggleQuiet(contact.id);
              setShowExportMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs border transition-all cursor-pointer ${
              contact.isQuiet
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
            id="toggle-quiet-header"
          >
            {contact.isQuiet ? (
              <>
                <VolumeX size={14} />
                <span className="hidden sm:inline">Quiet Mode: ON</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span className="hidden sm:inline">Quiet Mode: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quiet Status Alert Banner */}
      {contact.isQuiet && (
        <div className="bg-pink-500/10 text-pink-100 border-b border-pink-500/20 px-4 py-2.5 text-xs flex items-center gap-2 shadow-inner animate-fade-in" id="quiet-banner">
          <EyeOff size={14} className="text-pink-400 flex-shrink-0" />
          <div className="flex-1">
            <strong>Quiet mode is active for this contact.</strong> Incoming messages and media are filed silently in the Quiet Folder. Read receipts are disabled.
          </div>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded font-mono uppercase font-bold">
            Suppressed
          </span>
        </div>
      )}

      {/* Persistent Advocate Legal Case Connection Bar */}
      {contact.role?.includes('Advocate') && (
        <div className="bg-slate-900/80 border-b border-white/10 px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in" id="advocate-case-status-bar">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              <ShieldCheck size={16} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-200">Attorney-Client Privilege Link</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono tracking-wider ${
                  contact.caseStatus === 'Active Legal Representation' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {contact.caseStatus === 'Active Legal Representation' ? 'ACTIVE LEGAL REPRESENTATION' : 'PENDING ACCEPTANCE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {contact.caseStatus === 'Active Legal Representation'
                  ? '🔒 Direct secure counsel established. Attorney privilege fully active under Sec. 126 Evidence Act.'
                  : '⏳ Legal representation request is currently pending advocate\'s formal acceptance.'}
              </p>
            </div>
          </div>
          
          {contact.caseStatus !== 'Active Legal Representation' && (
            <button
              type="button"
              onClick={() => {
                if (onAcceptCase) {
                  onAcceptCase(contact.id);
                }
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all duration-300 shadow-md shadow-amber-500/10 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-amber-400"
              id="simulate-accept-case-btn"
            >
              <Check size={12} className="stroke-[3]" />
              Accept Case (Simulation)
            </button>
          )}
        </div>
      )}

      {/* Export/Action Toast Notification */}
      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/95 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl z-50 flex items-center gap-2 backdrop-blur-md"
            id="export-toast-notification"
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>{exportToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Layout: Chats and side panel */}
      <div className="flex-1 flex overflow-hidden relative" id="chat-body-split">
        {/* Left main area: Stream + Input */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-transparent" id="messages-container">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-12">
                <p>No messages in this chat yet.</p>
                <p className="mt-1 text-slate-400">Send a greeting message below!</p>
              </div>
            ) : (
              activeMessages.map((msg, index) => {
                const isMe = msg.sender === 'me';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    id={`msg-bubble-${msg.id}`}
                  >
                    <div className="flex items-end gap-2.5 max-w-[80%]">
                      {!isMe && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm border border-white/5 ${contact.avatarColor}`} title={contact.name}>
                          {contact.name.substring(0, 2).replace(/[^a-zA-Z]/g, '') || contact.name.substring(0, 1)}
                        </div>
                      )}
                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[16px] leading-relaxed shadow-lg ${
                          isMe
                            ? `${currentTheme.bubbleClass} rounded-br-none`
                            : msg.isQuietMessage
                              ? 'bg-slate-900/60 text-slate-300 rounded-bl-none border border-white/5'
                              : 'bg-slate-900/85 text-white rounded-bl-none border border-white/10'
                        }`}
                      >
                        {/* Render image/video attachments inside bubble */}
                        {msg.mediaUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-white/15 max-w-full bg-black/40">
                            {msg.mediaType === 'image' ? (
                              <img 
                                src={msg.mediaUrl} 
                                alt="Attached shared image" 
                                className="w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                referrerPolicy="no-referrer"
                                onClick={() => setZoomImageUrl(msg.mediaUrl || null)}
                              />
                            ) : msg.mediaType === 'video' ? (
                              <div className="relative max-h-48 overflow-hidden flex items-center justify-center">
                                <video 
                                  src={msg.mediaUrl} 
                                  controls
                                  className="w-full max-h-48 object-cover"
                                />
                              </div>
                            ) : msg.mediaType === 'file' ? (
                              <div className="p-3 bg-slate-950/45 rounded-xl border border-white/10 flex items-center gap-3 max-w-full">
                                <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 ${currentTheme.accentTextClass}`}>
                                  <FileText size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-white truncate" title={msg.fileName}>
                                    {msg.fileName || 'Untitled File'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    {msg.fileSize || 'Unknown Size'}
                                  </p>
                                </div>
                                <a 
                                  href={msg.mediaUrl} 
                                  download={msg.fileName || 'file'}
                                  className={`p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex-shrink-0 ${currentTheme.accentTextClass}`}
                                  title="Download File"
                                  id={`download-${msg.id}`}
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                  </svg>
                                </a>
                              </div>
                            ) : msg.mediaType === 'audio' ? (
                              <div className="p-3 bg-slate-950/50 rounded-xl border border-white/10 flex items-center gap-3 w-64 max-w-full">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePlayAudio(msg.id)}
                                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm shrink-0 ${currentTheme.buttonClass}`}
                                  id={`play-btn-${msg.id}`}
                                >
                                  {playingAudioId === msg.id ? (
                                    <Square size={12} className="fill-current" />
                                  ) : (
                                    <Play size={12} className="fill-current translate-x-0.5" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                    <span className={`font-mono uppercase tracking-wider ${currentTheme.accentTextClass}`}>Scrambled Memo</span>
                                    <span>{msg.duration || 5}s</span>
                                  </div>
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-100 ${currentTheme.playProgressClass}`} 
                                      style={{ width: `${audioProgress[msg.id] || 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : msg.mediaType === 'location' ? (
                              <div className="w-72 max-w-full bg-slate-950/85 rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-inner" id={`map-card-${msg.id}`}>
                                {/* The dynamic beautiful vector static map */}
                                <div className="h-32 w-full relative overflow-hidden bg-[#080d19]">
                                  <svg className="w-full h-full" viewBox="0 0 300 130">
                                    <defs>
                                      <pattern id={`cardMapGrid-${msg.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
                                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                                      </pattern>
                                    </defs>
                                    <rect width="300" height="130" fill="#080d19" />
                                    <rect width="300" height="130" fill={`url(#cardMapGrid-${msg.id})`} />
                                    
                                    {/* Streets grid */}
                                    <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                                    <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                                    <line x1="90" y1="0" x2="90" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                    <line x1="220" y1="0" x2="220" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                                    
                                    {/* Map outlines based on preset */}
                                    {msg.text.includes('Eiffel') ? (
                                      <path d="M 0 20 C 100 10, 150 70, 300 40 L 300 130 L 0 130 Z" fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.15)" strokeWidth="1.5" />
                                    ) : msg.text.includes('Gate') || msg.text.includes('San Francisco') ? (
                                      <>
                                        <path d="M 0 0 L 120 0 L 120 130 L 0 130 Z" fill="rgba(14,165,233,0.1)" />
                                        <line x1="120" y1="65" x2="300" y2="65" stroke="rgba(239,68,68,0.3)" strokeWidth="2" strokeDasharray="3,3" />
                                      </>
                                    ) : (
                                      <rect x="20" y="15" width="80" height="40" rx="4" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.1)" strokeWidth="1" />
                                    )}
                                    
                                    {/* Pulsing range rings */}
                                    <circle cx="150" cy="65" r="22" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1" className="animate-pulse" />
                                    <circle cx="150" cy="65" r="10" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1" />
                                    <circle cx="150" cy="65" r="4.5" fill="#ef4444" />
                                    
                                    {/* Compass */}
                                    <circle cx="275" cy="25" r="11" fill="none" stroke="rgba(255,255,255,0.08)" />
                                    <line x1="275" y1="17" x2="275" y2="33" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                                    <line x1="267" y1="25" x2="283" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                                    <text x="273" y="19" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">N</text>
                                  </svg>
                                  
                                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 rounded border border-white/5 font-mono text-[8px] text-slate-400 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>GPS SECURE LOCK</span>
                                  </div>
                                </div>
                                
                                <div className="p-3 flex flex-col gap-1 border-t border-white/5 bg-slate-950/40">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                    <span className="text-xs font-semibold text-white leading-snug">{msg.text}</span>
                                  </div>
                                  
                                  <span className="text-[9px] font-mono text-slate-400 pl-5">
                                    Coordinates: {msg.mediaUrl || '37.4220, -122.0841'}
                                  </span>
                                  
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${msg.mediaUrl || '37.4220,-122.0841'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-2 py-1.5 px-3 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${currentTheme.buttonClass}`}
                                    id={`open-maps-btn-${msg.id}`}
                                  >
                                    <span>Open in Google Maps</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            ) : msg.mediaType === 'payment' ? (
                              <div className="w-72 max-w-full rounded-xl overflow-hidden flex flex-col" id={`payment-card-${msg.id}`}>
                                {/* Header badge according to type */}
                                {msg.paymentType === 'send' && (
                                  <div className="bg-emerald-950/40 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-emerald-400">
                                      <CreditCard size={14} />
                                      <span className="text-[10px] font-bold uppercase tracking-wider">Payment Sent</span>
                                    </div>
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase font-bold font-mono">
                                      SUCCESS
                                    </span>
                                  </div>
                                )}

                                {msg.paymentType === 'request' && (
                                  <div className="bg-indigo-950/40 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-indigo-400">
                                      <Wallet size={14} />
                                      <span className="text-[10px] font-bold uppercase tracking-wider">Payment Request</span>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold font-mono ${
                                      msg.paymentStatus === 'success'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                                    }`}>
                                      {msg.paymentStatus === 'success' ? 'PAID' : 'PENDING'}
                                    </span>
                                  </div>
                                )}

                                {msg.paymentType === 'receipt' && (
                                  <div className="bg-teal-950/40 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-teal-400">
                                      <CheckCircle2 size={14} />
                                      <span className="text-[10px] font-bold uppercase tracking-wider">Payment Receipt</span>
                                    </div>
                                    <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30 uppercase font-bold font-mono">
                                      CONFIRMED
                                    </span>
                                  </div>
                                )}

                                {/* Main content card */}
                                <div className="p-3.5 bg-slate-900/40 space-y-3">
                                  <div>
                                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">Amount</p>
                                    <p className="text-2xl font-mono font-bold text-white mt-1 font-sans">₹{msg.paymentAmount}</p>
                                  </div>

                                  <div className="border-t border-white/5 pt-2.5">
                                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">Note</p>
                                    <p className="text-xs text-slate-200 mt-1 italic">"{msg.text}"</p>
                                  </div>

                                  {/* Dynamic Button triggers */}
                                  {msg.paymentType === 'send' && (
                                    <button
                                      type="button"
                                      onClick={() => handleShareReceipt(msg)}
                                      className="w-full mt-2 py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                      <Share2 size={12} />
                                      <span>Share Receipt</span>
                                    </button>
                                  )}

                                  {msg.paymentType === 'request' && msg.paymentStatus === 'pending' && (
                                    isMe ? (
                                      <div className="text-[9px] font-mono text-slate-500 text-center py-1 uppercase tracking-widest">
                                        Waiting for contact to pay...
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handlePayRequest(msg)}
                                        className="w-full mt-2 py-1.5 px-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-indigo-500/10"
                                      >
                                        <CreditCard size={12} />
                                        <span>Pay ₹{msg.paymentAmount} Now</span>
                                      </button>
                                    )
                                  )}

                                  {msg.paymentType === 'request' && msg.paymentStatus === 'success' && (
                                    <div className="flex flex-col gap-2">
                                      <div className="text-[9px] font-mono text-emerald-400 font-bold flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/20 py-1 rounded-lg uppercase tracking-wider">
                                        <CheckCircle2 size={10} />
                                        <span>Request Paid Successfully</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleShareReceipt(msg)}
                                        className="w-full py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                      >
                                        <Share2 size={12} />
                                        <span>Share Receipt Card</span>
                                      </button>
                                    </div>
                                  )}

                                  {msg.paymentType === 'receipt' && (
                                    <div className="p-2.5 bg-emerald-950/20 rounded-xl border border-emerald-500/10 font-mono text-[9px] space-y-1 text-slate-400">
                                      <p>TXN REF: <span className="text-white font-bold uppercase">{`TXN-${msg.id.substring(0, 10).toUpperCase()}`}</span></p>
                                      <p>STATUS: <span className="text-emerald-400 font-bold">SECURE CONFIRMED</span></p>
                                      <p>PROTOCOL: <span className="text-white">QUANTUM E2EE</span></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {msg.mediaType !== 'location' && msg.mediaType !== 'payment' && (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}
                        
                        {/* Timestamp & Status checks */}
                        <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px]">
                          <span className={isMe ? 'text-indigo-200' : 'text-slate-400'}>
                            {msg.timestamp}
                          </span>
                          
                          {isMe && (
                            <span>
                              {msg.status === 'read' && readReceiptsEnabled ? (
                                <CheckCheck size={14} className="text-sky-300" title="Read" />
                              ) : msg.status === 'read' || msg.status === 'delivered' ? (
                                <CheckCheck size={14} className="text-indigo-200" title="Delivered" />
                              ) : (
                                <Check size={14} className="text-indigo-200" title="Sent" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Read Receipt Status Explainer */}
                    {!isMe && (
                      <div className="mt-1 ml-[42px] px-1 flex items-center gap-1 text-[9px] font-mono">
                        {!readReceiptsEnabled ? (
                          <span className="text-pink-400 font-medium flex items-center gap-0.5" title="Read receipts are disabled globally in Privacy Settings.">
                            <EyeOff size={10} /> Read receipt disabled (Privacy Settings)
                          </span>
                        ) : msg.isQuietMessage ? (
                          <span className="text-pink-400 font-medium flex items-center gap-0.5" title="Read receipts are hidden from this contact. They only see 'Delivered'.">
                            <EyeOff size={10} /> Read receipt suppressed (Sender sees: Delivered)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium flex items-center gap-0.5" title="Read receipts are sent normally. The contact can see that you read the message.">
                            <CheckCheck size={10} className="text-emerald-400" /> Read receipt sent (Sender sees: Read)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Area */}
          <div className="bg-transparent border-t border-white/10 p-4 shrink-0" id="composer-container">
            {contact.role?.includes('Advocate') && contact.caseStatus === 'Pending' ? (
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left shadow-lg shadow-amber-500/5 backdrop-blur-md" id="case-pending-lock-composer">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex-shrink-0">
                    <ShieldAlert size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-400 text-xs sm:text-sm uppercase tracking-wide">Secure Masked Channel Locked</h4>
                    <p className="text-[11px] sm:text-xs text-slate-300 mt-1">This communication is encrypted but locked until the Advocate formally reviews and accepts your case brief.</p>
                  </div>
                </div>
                {onAcceptCase && (
                  <button
                    type="button"
                    onClick={() => onAcceptCase(contact.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all duration-300 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer self-center sm:self-auto border border-amber-400 shrink-0"
                    id="simulate-accept-case-composer-btn"
                  >
                    <Check size={12} className="stroke-[3]" />
                    Accept Case (Simulation)
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Helper prompt above input */}
            {contact.isQuiet && (
              <div className="mb-2 text-[11px] text-slate-400 flex items-center gap-1.5 bg-white/5 p-2 rounded-lg border border-white/10">
                <Info size={12} className="text-indigo-400" />
                <span>Sending a reply does not remove this contact from Quiet Mode. They will remain muted until you restore them.</span>
              </div>
            )}

            {/* AI Smart Replies suggestions */}
            {activeMessages.length > 0 && (
              <div className="mb-3 p-2 bg-slate-950/40 rounded-xl border border-white/5" id="ai-smart-replies">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-indigo-400 mb-2 tracking-wider">
                  <Sparkles size={11} className="animate-pulse" />
                  <span>AI Smart Replies</span>
                  {isLoadingReplies && (
                    <span className="text-[9px] text-slate-500 lowercase font-normal animate-pulse">
                      (thinking...)
                    </span>
                  )}
                </div>
                {isLoadingReplies && smartReplies.length === 0 ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-28 rounded-lg bg-white/5 border border-white/5 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {smartReplies.map((reply, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setInputText(reply)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 active:bg-indigo-500/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer shadow-sm text-left truncate max-w-[250px]"
                        title={`Select response: "${reply}"`}
                        id={`smart-reply-${index}`}
                      >
                        {reply}
                      </button>
                    ))}
                    {smartReplies.length === 0 && !isLoadingReplies && (
                      <span className="text-[10px] text-slate-500 italic">No suggestions yet. Type a message or wait for incoming texts.</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Selected File Attachment Preview Panel */}
            {selectedFile && (
              <div className="mb-2 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-200" id="selected-file-preview">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0">
                    {selectedFile.mediaType === 'image' ? (
                      <Image size={16} />
                    ) : selectedFile.mediaType === 'video' ? (
                      <Video size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate text-xs" title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-indigo-300 font-mono">
                      {selectedFile.size} • {selectedFile.mediaType.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove Attachment"
                  id="remove-file-preview-btn"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {isRecordingVoice ? (
              <div className="flex gap-3 items-center justify-between bg-rose-950/40 border border-rose-500/20 p-2 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shrink-0" />
                  <span className="text-xs font-mono text-rose-300">
                    🎙️ ENCRYPTED MEMO ACTIVE... [{recordingSeconds}s]
                  </span>
                  {/* Bouncing visual audio bars */}
                  <div className="flex gap-0.5 items-end h-3">
                    <span className="w-[2px] bg-rose-400 h-2 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
                    <span className="w-[2px] bg-rose-400 h-3 animate-[bounce_0.3s_infinite_alternate_0.2s]" />
                    <span className="w-[2px] bg-rose-400 h-1.5 animate-[bounce_0.4s_infinite_alternate_0.3s]" />
                    <span className="w-[2px] bg-rose-400 h-2.5 animate-[bounce_0.6s_infinite_alternate_0.1s]" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecordingVoice(false);
                      setRecordingSeconds(0);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    id="voice-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendVoiceNote}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md border border-rose-500/30 transition-all cursor-pointer"
                    id="voice-send-btn"
                  >
                    Send Memo
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex gap-2 items-center">
                {/* Hidden native file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="hidden-file-input"
                />

                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
                  title="Attach file, image, or video"
                  id="attachment-trigger-btn"
                >
                  <Paperclip size={18} />
                </button>

                {/* Secure Microphone Voice Recording Trigger */}
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-300 hover:text-pink-400 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
                  title="Record secure scrambled voice note"
                  id="mic-trigger-btn"
                >
                  <Mic size={18} />
                </button>

                {/* Share Location Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowLocationPicker(prev => !prev);
                    setShowMediaGallery(false);
                    setShowPaymentPanel(false);
                  }}
                  className={`p-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-300 hover:text-indigo-400 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 ${
                    showLocationPicker ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25' : ''
                  }`}
                  title="Share Live or Current Location"
                  id="location-trigger-btn"
                >
                  <MapPin size={18} />
                </button>

                {/* Secure Payments UPI Button (₹) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentPanel(prev => !prev);
                    setShowLocationPicker(false);
                    setShowMediaGallery(false);
                    setShowQrScanner(false);
                  }}
                  className={`p-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-300 hover:text-emerald-400 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 ${
                    showPaymentPanel ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' : ''
                  }`}
                  title="Send or Request Secure Payment (₹)"
                  id="payment-trigger-btn"
                >
                  <IndianRupee size={18} />
                </button>

                {/* QR Code Scanner Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowQrScanner(true);
                    setQrScanStep('scanning');
                    setScannedAmount('500'); // reset default amount to pay
                    setShowPaymentPanel(false);
                    setShowLocationPicker(false);
                    setShowMediaGallery(false);
                  }}
                  className={`p-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-300 hover:text-amber-400 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 relative ${
                    showQrScanner ? 'text-amber-400 bg-amber-500/10 border-amber-500/25' : ''
                  }`}
                  title="Scan Merchant UPI QR Code"
                  id="qr-scanner-trigger-btn"
                >
                  <QrCode size={18} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-slate-900 rounded-full animate-ping" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    selectedFile
                      ? `Add a caption to ${selectedFile.name}...`
                      : contact.isQuiet
                        ? "Reply silently in Quiet Mode..."
                        : `Type a message to ${contact.name}...`
                  }
                  className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-sm border border-white/10 focus:border-white/30 focus:outline-none rounded-xl transition-all text-white placeholder:text-slate-400"
                  id="chat-composer-input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedFile}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                    !inputText.trim() && !selectedFile
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
                      : contact.isQuiet
                        ? 'bg-slate-800 hover:bg-slate-900 border border-white/10 text-white hover:shadow-lg'
                        : `${currentTheme.buttonClass} hover:shadow-lg`
                  }`}
                  id="chat-submit-btn"
                >
                  <Send size={15} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            )}
              </>
            )}
          </div>
        </div>

        {/* Media Gallery Drawer Panel */}
        <AnimatePresence>
          {showMediaGallery && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 bg-slate-950/95 border-l border-white/10 flex flex-col h-full z-10"
              id="shared-media-gallery"
            >
              {/* Gallery Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className={`flex items-center gap-1.5 ${currentTheme.accentTextClass}`}>
                  <FolderOpen size={16} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">Primary Gallery</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaGallery(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Guard Alert: Visual validation of safety */}
              <div className="p-3 bg-pink-500/10 border-b border-pink-500/20 text-[10px] text-pink-300 leading-normal flex gap-1.5">
                <EyeOff size={14} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Quiet Mode Isolation Active:</strong> {suppressedMediaCount} attachments from quiet contacts are saved silently inside the <strong>Quiet Folder</strong> and suppressed from this primary gallery.
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {primaryMedia.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center py-12 px-2">
                    <Image size={24} className="mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">Primary Inbox Empty</p>
                    <p className="text-[10px] text-slate-600 mt-1">Loud contacts' shared photos/videos will be indexed here automatically.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {primaryMedia.map((m) => (
                      <div 
                        key={m.id}
                        className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-900 group cursor-pointer"
                      >
                        {m.mediaType === 'image' ? (
                          <>
                            <img 
                              src={m.mediaUrl} 
                              alt="Gallery Thumbnail" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              referrerPolicy="no-referrer"
                              onClick={() => setZoomImageUrl(m.mediaUrl || null)}
                            />
                            <div className="absolute bottom-1 right-1 bg-slate-950/70 p-0.5 rounded text-[8px] font-mono text-slate-400">
                              IMG
                            </div>
                          </>
                        ) : (
                          <div 
                            className="w-full h-full flex flex-col items-center justify-center relative bg-slate-950"
                            onClick={() => {}}
                          >
                            <video src={m.mediaUrl} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play size={16} className={`${currentTheme.accentTextClass} fill-current`} />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-slate-950/70 p-0.5 rounded text-[8px] font-mono text-slate-400">
                              VID
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📍 GOOGLE MAPS PREVIEW SIMULATED PICKER DRAWER */}
        <AnimatePresence>
          {showLocationPicker && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full sm:w-[380px] bg-slate-950/95 border-l border-white/10 flex flex-col h-full z-10 text-white"
              id="location-picker-panel"
            >
              {/* Header */}
              <div className="bg-slate-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-indigo-400 shrink-0" size={18} />
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase">Share Location</h3>
                    <p className="text-[9px] text-slate-400 font-mono">E2EE Geographic Stream</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Picker"
                  id="close-location-picker"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable container stacking previews and settings */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
                
                {/* Tactical map canvas */}
                <div className="rounded-2xl border border-white/10 bg-slate-950 relative overflow-hidden flex items-center justify-center h-44 shadow-inner">
                  {/* Interactive map paths svg */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="none">
                    <defs>
                      <pattern id="sideMapGridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="#080c16" />
                    <rect width="100%" height="100%" fill="url(#sideMapGridPattern)" />

                    {/* Water feature */}
                    <path d="M-50,80 Q150,50 250,150 T550,120 L550,250 L-50,250 Z" fill="rgba(14,165,233,0.06)" stroke="rgba(14,165,233,0.12)" strokeWidth="1.5" />
                    
                    {/* Park feature */}
                    <rect x="80" y="30" width="160" height="70" rx="8" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />

                    {/* Tactical roads network */}
                    <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />
                    <line x1="150" y1="0" x2="150" y2="250" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                    <line x1="380" y1="0" x2="380" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" />
                  </svg>

                  {/* Radar overlays */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_100%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none opacity-25" />

                  {/* Map marker elements */}
                  <div className="relative text-center z-10 flex flex-col items-center">
                    {isGpsAcquiring ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 border-2 border-indigo-500/40 rounded-full flex items-center justify-center relative animate-[spin_4s_linear_infinite] mx-auto">
                          <span className="absolute -inset-3 border border-indigo-500/10 rounded-full animate-ping" />
                          <span className="w-8 h-8 border border-indigo-500/20 rounded-full flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          </span>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono font-bold tracking-wider text-indigo-400">CONNECTING SATELLITES...</p>
                          <div className="w-32 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto mt-1 border border-white/5">
                            <div className="bg-indigo-500 h-full transition-all duration-100" style={{ width: `${gpsAcquisitionProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 flex items-center justify-center relative select-none">
                          <span className="absolute inset-0 bg-indigo-500/15 rounded-full animate-ping pointer-events-none" />
                          <span className="absolute inset-3 bg-indigo-500/25 rounded-full animate-pulse pointer-events-none" />
                          <div className="w-8 h-8 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center text-rose-500 shadow-xl relative z-10">
                            <MapPin size={16} className="animate-bounce" />
                          </div>
                        </div>

                        <div className="mt-1.5 bg-slate-900/95 px-3 py-1 rounded-full border border-white/10 text-[9px] font-bold font-mono tracking-wider text-slate-200">
                          {selectedLocationType === 'current'
                            ? 'Current Location Locked'
                            : selectedLocationType === 'live'
                              ? '🛰️ Live Stream Active'
                              : LOCATION_PRESETS.find(p => p.id === selectedPresetId)?.name}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Compass */}
                  <div className="absolute top-2 right-2 w-10 h-10 rounded-full border border-white/5 bg-slate-950/80 flex items-center justify-center font-mono text-[7px] text-slate-500">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span className="absolute top-0.5 font-bold font-sans">N</span>
                      <span className="absolute bottom-0.5 font-bold font-sans">S</span>
                      <span className="absolute left-0.5 font-bold font-sans">W</span>
                      <span className="absolute right-0.5 font-bold font-sans">E</span>
                      <div className="w-4 h-0.5 bg-rose-500/40 rounded-full animate-[spin_8s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                {/* Satellite Telemetry Readout */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-white/5 font-mono text-[9px] space-y-1 backdrop-blur-md">
                  <div className="flex justify-between items-center text-indigo-400 font-bold uppercase tracking-wider mb-1">
                    <span>🛰️ GNSS FEED STATE</span>
                    <span className={isGpsAcquiring ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}>
                      {isGpsAcquiring ? 'CALIBRATING...' : 'SECURE LOCK'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 text-slate-300">
                    <div>LAT: <span className="font-bold text-white">
                      {isGpsAcquiring ? '...' : selectedLocationType === 'current' ? '37.42200° N' : selectedLocationType === 'live' ? '37.77490° N' : `${LOCATION_PRESETS.find(p => p.id === selectedPresetId)?.lat.toFixed(5)}° N`}
                    </span></div>
                    <div>LNG: <span className="font-bold text-white">
                      {isGpsAcquiring ? '...' : selectedLocationType === 'current' ? '-122.08410° W' : selectedLocationType === 'live' ? '-122.41940° W' : `${LOCATION_PRESETS.find(p => p.id === selectedPresetId)?.lng.toFixed(5)}° W`}
                    </span></div>
                    <div>ALT: <span className="text-white">14.8m WGS-84</span></div>
                    <div>SEC: <span className="text-emerald-400">99.8% Encrypted</span></div>
                  </div>
                </div>

                {/* Telemetry types */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-1">TELEMETRY TYPE</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLocationType('current')}
                      className={`text-left p-2.5 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer border ${
                        selectedLocationType === 'current'
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                          : 'bg-white/[0.02] hover:bg-white/5 border-white/5 text-slate-300'
                      }`}
                      id="picker-loc-current"
                    >
                      <MapPin size={14} className={selectedLocationType === 'current' ? 'text-indigo-400' : 'text-slate-400'} />
                      <div>
                        <p className="text-[11px] font-bold">Current Location</p>
                        <p className="text-[8px] text-slate-400 truncate mt-0.5">Static coordinates</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLocationType('live')}
                      className={`text-left p-2.5 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer border ${
                        selectedLocationType === 'live'
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                          : 'bg-white/[0.02] hover:bg-white/5 border-white/5 text-slate-300'
                      }`}
                      id="picker-loc-live"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      <div>
                        <p className="text-[11px] font-bold">Live Location</p>
                        <p className="text-[8px] text-slate-400 truncate mt-0.5">1 hr subscription</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Location presets list */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-1">LOCATION PRESETS</span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {LOCATION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocationType('preset');
                          setSelectedPresetId(preset.id);
                        }}
                        className={`w-full text-left p-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer border ${
                          selectedLocationType === 'preset' && selectedPresetId === preset.id
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                            : 'bg-white/[0.02] hover:bg-white/5 border-white/5 text-slate-300'
                        }`}
                        id={`picker-preset-${preset.id}`}
                      >
                        <MapPin size={13} className={selectedLocationType === 'preset' && selectedPresetId === preset.id ? 'text-indigo-400' : 'text-slate-500'} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold truncate leading-none">{preset.name}</p>
                          <p className="text-[8px] text-slate-400 truncate mt-1">{preset.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom footer buttons */}
              <div className="p-3 bg-slate-900/60 border-t border-white/10 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(false)}
                  className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-slate-300 transition-all cursor-pointer text-center uppercase font-mono"
                  id="picker-cancel-action"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isGpsAcquiring}
                  onClick={handleSendLocation}
                  className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center uppercase flex items-center justify-center gap-1 shadow-md ${
                    isGpsAcquiring
                      ? 'bg-indigo-500/10 text-indigo-300/40 border border-indigo-500/10 cursor-not-allowed'
                      : `${currentTheme.buttonClass} shadow-indigo-500/10`
                  }`}
                  id="picker-confirm-action"
                >
                  <Send size={11} />
                  <span>Send</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 💸 SECURE PAYMENT DRAWER */}
        <AnimatePresence>
          {showPaymentPanel && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full sm:w-[380px] bg-slate-950/95 border-l border-white/10 flex flex-col h-full z-10 text-white"
              id="payment-picker-panel"
            >
              {/* Header */}
              <div className="bg-slate-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="text-emerald-400 shrink-0" size={18} />
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase">Secure Pay Link</h3>
                    <p className="text-[9px] text-slate-400 font-mono">Quantum E2EE Gateway</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentPanel(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Payments"
                  id="close-payment-picker"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 bg-slate-900/60 p-1">
                <button
                  type="button"
                  onClick={() => setPaymentTab('send')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentTab === 'send'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={12} />
                  <span>Send Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('request')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentTab === 'request'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet size={12} />
                  <span>Request Money</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isProcessingPayment ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="text-emerald-400"
                    >
                      <Loader2 size={36} />
                    </motion.div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest font-mono text-emerald-400">
                        {paymentProcessingStage === 'authorizing' && 'AUTHORIZING LINK...'}
                        {paymentProcessingStage === 'securing' && 'SECURING LEDGER CRYPTO...'}
                        {paymentProcessingStage === 'success' && 'TRANSACTION SEALED!'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {paymentProcessingStage === 'authorizing' && 'Contacting secure banking network node...'}
                        {paymentProcessingStage === 'securing' && 'Registering state change inside encrypted packet...'}
                        {paymentProcessingStage === 'success' && 'Routing transaction receipt to stream...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Visual Card Preview */}
                    <div className={`p-4 rounded-2xl border relative overflow-hidden shadow-2xl transition-all ${
                      paymentTab === 'send'
                        ? 'bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border-emerald-500/20'
                        : 'bg-gradient-to-br from-indigo-950/50 to-slate-950/30 border-indigo-500/20'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[8px] font-mono tracking-widest uppercase text-slate-400">Quantum Network Card</p>
                          <h4 className="text-sm font-bold mt-1 text-white">{contact?.name || 'Contact'}</h4>
                        </div>
                        {paymentTab === 'send' ? (
                          <CreditCard size={18} className="text-emerald-400" />
                        ) : (
                          <Wallet size={18} className="text-indigo-400" />
                        )}
                      </div>
                      
                      <div className="my-6">
                        <p className="text-[8px] font-mono text-slate-400 uppercase">Amount</p>
                        <div className="flex items-baseline text-white">
                          <span className="text-xl font-bold font-mono">₹</span>
                          <span className="text-3xl font-bold font-mono tracking-tight ml-1">
                            {payAmountInput || '0.00'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-white/5 pt-3">
                        <span>NODE SECURE SHIELD</span>
                        <span className={paymentTab === 'send' ? 'text-emerald-400' : 'text-indigo-400'}>ACTIVE (E2EE)</span>
                      </div>
                    </div>

                    {/* Numeric Input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-1">AMOUNT (₹)</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</div>
                        <input
                          type="number"
                          value={payAmountInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 6) setPayAmountInput(val);
                          }}
                          placeholder="Enter amount (max 99999)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    {/* Description Note */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-1">TRANSACTION NOTE</label>
                      <input
                        type="text"
                        value={payNoteInput}
                        onChange={(e) => setPayNoteInput(e.target.value)}
                        placeholder="What is this payment for?"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    {/* Secure Bank Source Info */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-white/5 font-mono text-[9px] space-y-1 backdrop-blur-md">
                      <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider mb-1">
                        <span>🛡️ BANK ROUTING GATEWAY</span>
                        <span className="text-emerald-400">READY</span>
                      </div>
                      <div className="text-slate-300 space-y-0.5">
                        <p>SOURCE: <span className="font-bold text-white">HDFC Bank Secure UPI Wallet</span></p>
                        <p>LIMIT: <span className="text-white">₹1,00,000 daily remaining</span></p>
                        <p>CHARGE: <span className="text-emerald-400">₹0.00 (Zero Fee Channel)</span></p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!isProcessingPayment && (
                <div className="p-3 bg-slate-900/60 border-t border-white/10 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPaymentPanel(false)}
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-slate-300 transition-all cursor-pointer text-center uppercase font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!payAmountInput || parseFloat(payAmountInput) <= 0}
                    onClick={async () => {
                      setIsProcessingPayment(true);
                      setPaymentProcessingStage('authorizing');
                      
                      // Phase 1
                      await new Promise(r => setTimeout(r, 600));
                      setPaymentProcessingStage('securing');
                      
                      // Phase 2
                      await new Promise(r => setTimeout(r, 600));
                      setPaymentProcessingStage('success');
                      
                      // Phase 3
                      await new Promise(r => setTimeout(r, 300));
                      
                      const amount = parseFloat(payAmountInput);
                      onSendMessage(
                        payNoteInput || (paymentTab === 'send' ? 'Payment sent' : 'Payment requested'),
                        'payment',
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        amount,
                        paymentTab === 'send' ? 'success' : 'pending',
                        paymentTab === 'send' ? 'send' : 'request'
                      );

                      setIsProcessingPayment(false);
                      setPaymentProcessingStage('idle');
                      setPayAmountInput('');
                      setPayNoteInput('');
                      setShowPaymentPanel(false);
                      showToast(paymentTab === 'send' ? `Payment of ₹${amount} sent!` : `Payment request of ₹${amount} sent!`);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center uppercase flex items-center justify-center gap-1 shadow-md ${
                      !payAmountInput || parseFloat(payAmountInput) <= 0
                        ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                        : paymentTab === 'send'
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/10'
                    }`}
                  >
                    <Send size={11} />
                    <span>{paymentTab === 'send' ? `Send ₹${payAmountInput || '0'}` : `Request ₹${payAmountInput || '0'}`}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Zoom Lightbox Overlay */}
      {zoomImageUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button 
            type="button"
            onClick={() => setZoomImageUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          <img 
            src={zoomImageUrl} 
            alt="Zoomed shared preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Passcode Lock Setup Modal */}
      {showPinSetup && (
        <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-semibold text-white">Enable Secure Chat Lock</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter a 4-digit numeric passcode to secure this conversation. Locked conversations are isolated and require credentials to access.
            </p>
            <div className="my-5">
              <input
                type="password"
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className="w-32 text-center text-2xl font-mono tracking-widest bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none text-white placeholder:text-slate-700"
                id="pin-setup-input"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPinSetup(false);
                  setPinInput('');
                }}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pinInput.length < 4}
                onClick={() => {
                  if (contact) {
                    onToggleLock(contact.id, pinInput);
                  }
                  setShowPinSetup(false);
                  setPinInput('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  pinInput.length < 4
                    ? 'bg-amber-500/10 text-amber-500/50 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/10'
                }`}
                id="lock-chat-confirm-btn"
              >
                Lock Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📷 SIMULATED CAMERA SCANNER OVERLAY */}
      <AnimatePresence>
        {showQrScanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 z-[90] bg-slate-950 flex flex-col font-sans"
            id="qr-scanner-overlay"
          >
            {/* Header */}
            <div className="bg-slate-900 border-b border-white/10 px-4 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Camera className="text-amber-400 animate-pulse shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-white">Secure QR Scan Gateway</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest font-bold">Live Camera Feed Shield</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQrScanner(false);
                  setQrScanStep('idle');
                }}
                className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cancel Scan"
                id="close-qr-scanner-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content Viewport */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center space-y-6">
              {qrScanStep === 'scanning' && (
                <div className="flex flex-col items-center space-y-6 text-center w-full max-w-xs">
                  {/* Outer Viewfinder Frame */}
                  <div className="w-64 h-64 border border-white/10 rounded-3xl bg-slate-900/60 relative flex items-center justify-center overflow-hidden shadow-2xl">
                    {/* Glowing Grid Background to simulate a camera capture view */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_80%)] pointer-events-none" />

                    {/* Corner Bracket Elements */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-2xl" />

                    {/* Infinite laser sweep line */}
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-1 bg-amber-400 shadow-[0_0_12px_#fbbf24] z-10 pointer-events-none"
                    />

                    {/* Stylized Simulated QR Target */}
                    <div className="opacity-40 animate-pulse relative z-0 scale-90">
                      <QrCode size={128} className="text-white" />
                      {/* Scan tracking focus circle */}
                      <span className="absolute -inset-4 border border-amber-500/30 rounded-full animate-ping" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-400 font-mono tracking-widest animate-pulse">
                      🔍 ALIGN CODE IN FRAME...
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Automatically searching for UPI, TN Portal, or Merchant QR Code targets...
                    </p>
                  </div>

                  {/* Immediate Manual Simulator Detection Trigger for High Accessibility & Testing */}
                  <button
                    type="button"
                    onClick={() => {
                      playScanBeep();
                      setQrScanStep('detected');
                    }}
                    className="w-full py-3 px-5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer transition-all mt-4 flex items-center justify-center gap-1.5"
                    id="simulate-qr-detect-btn"
                  >
                    <Camera size={14} />
                    <span>Instant Detect QR</span>
                  </button>
                </div>
              )}

              {qrScanStep === 'detected' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-sm bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
                >
                  {/* Glowing background shade */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-2.5 border-b border-white/5 pb-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold tracking-wider">
                        Secure QR Decoded
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">UPI Merchant Verified</h4>
                    </div>
                  </div>

                  {/* Form Detail Stack */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Merchant Recipient</p>
                      <p className="text-sm font-bold text-white mt-0.5">{scannedMerchant}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{scannedUpi}</p>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">
                        Transfer Amount (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white font-bold text-lg font-mono">₹</span>
                        <input
                          type="number"
                          value={scannedAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 6) setScannedAmount(val);
                          }}
                          className="w-full py-3.5 pl-8 pr-4 bg-slate-950 border border-white/10 rounded-xl text-lg text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tracking-wide text-left"
                          placeholder="0.00"
                          id="qr-pay-amount-input"
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">
                        Funds will be securely routed from HDFC UPI Secure Wallet.
                      </p>
                    </div>

                    {/* Touch Action Buttons with Large Targets */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setQrScanStep('scanning')}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                      >
                        Rescan
                      </button>
                      <button
                        type="button"
                        disabled={!scannedAmount || parseFloat(scannedAmount) <= 0}
                        onClick={async () => {
                          setQrScanStep('authorizing');
                          
                          // Stage 1 authorization loop
                          await new Promise(r => setTimeout(r, 1200));
                          setQrScanStep('success');
                          
                          // Final Success loop
                          await new Promise(r => setTimeout(r, 1000));
                          
                          const amt = parseFloat(scannedAmount);
                          // Route actual transaction message into chat
                          onSendMessage(
                            `QR Code Secure Merchant Payment to: ${scannedMerchant}`,
                            'payment',
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            amt,
                            'success',
                            'send'
                          );

                          setShowQrScanner(false);
                          setQrScanStep('idle');
                          showToast(`Payment of ₹${amt} Successful!`);
                        }}
                        className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center uppercase shadow-lg flex items-center justify-center gap-1.5 ${
                          !scannedAmount || parseFloat(scannedAmount) <= 0
                            ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed shadow-none'
                            : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-extrabold shadow-emerald-500/10'
                        }`}
                        id="qr-payment-confirm-btn"
                      >
                        <IndianRupee size={12} />
                        <span>Pay ₹{scannedAmount || '0'} Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {qrScanStep === 'authorizing' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-emerald-400"
                  >
                    <Loader2 size={40} />
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest font-mono text-emerald-400">
                      AUTHORIZING TRANSACTION...
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Routing ₹{scannedAmount} securely to {scannedMerchant} over E2EE Node...
                    </p>
                  </div>
                </div>
              )}

              {qrScanStep === 'success' && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-3.5"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Payment Successful!</h4>
                    <p className="text-2xl font-mono font-bold text-emerald-400">₹{scannedAmount}.00</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Txn Ref: TXN-{Math.random().toString(36).substring(2, 12).toUpperCase()}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

