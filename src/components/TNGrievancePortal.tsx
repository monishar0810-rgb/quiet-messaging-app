import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  User,
  Users,
  Lock,
  Unlock,
  Copy,
  EyeOff,
  AlertCircle,
  Building,
  ChevronRight,
  RefreshCw,
  Plus,
  X,
  ChevronDown,
  Check,
  AlertTriangle,
  LockKeyhole,
  FileSpreadsheet,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Megaphone,
  DollarSign,
  Award,
  BookOpen,
  HeartHandshake,
  TrendingUp,
  Coins,
  FileCheck,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for Grievances
export interface Grievance {
  id: string;
  referenceNo: string;
  timestamp: string;
  recipient: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'investigating' | 'resolved' | 'declined';
  citizenId: string; // Masked identifier
  citizenPhone: string; // Masked phone
  officialReply?: string;
  replyTimestamp?: string;
  replyBy?: string;
  // Financial Assistance additions
  isAidRequest?: boolean;
  aidStudentName?: string;
  aidInstitution?: string;
  aidCourse?: string;
  aidTuitionFee?: number;
  aidAnnualIncome?: number;
  aidHardship?: string;
  grantStatus?: 'pending' | 'approved' | 'declined';
  transferReference?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

const AUTHORITIES = [
  { id: 'gov', name: "Hon'ble Governor of Tamil Nadu", title: 'ஆளுநர்', code: 'GOV' },
  { id: 'cm', name: "Chief Minister's Special Cell", title: 'முதலமைச்சர் தனிப்பிரிவு', code: 'CM' },
  { id: 'it_min', name: "Minister for Information Technology & Digital Services", title: 'தகவல் தொழில்நுட்பத் துறை அமைச்சர்', code: 'MIT' },
  { id: 'mun_min', name: "Minister for Municipal Administration & Water Supply", title: 'நகராட்சி நிர்வாகத் துறை அமைச்சர்', code: 'MMA' },
  { id: 'gcc', name: "Greater Chennai Corporation Commissioner", title: 'மாநகராட்சி ஆணையர் (சென்னை)', code: 'GCC' },
  { id: 'cbe_corp', name: "Coimbatore City Corporation Commissioner", title: 'மாநகராட்சி ஆணையர் (கோவை)', code: 'CBE' },
  { id: 'mdu_corp', name: "Madurai City Corporation Commissioner", title: 'மாநகராட்சி ஆணையர் (மதுரை)', code: 'MDU' }
];

const CATEGORIES = [
  { id: 'infra', label: 'Infrastructure & Roads', tamil: 'சாலைகள் / கட்டமைப்பு' },
  { id: 'water', label: 'Water Supply & Sewage', tamil: 'குடிநீர் மற்றும் கழிவுநீர்' },
  { id: 'power', label: 'Electricity & Power', tamil: 'மின்சாரம் மற்றும் ஆற்றல்' },
  { id: 'safety', label: 'Public Safety & Police', tamil: 'பொது பாதுகாப்பு' },
  { id: 'health', label: 'Public Health & Sanitation', tamil: 'சுகாதாரம் மற்றும் துப்புரவு' },
  { id: 'edu', label: 'Education & Schools', tamil: 'பள்ளிக் கல்வித் துறை' },
  { id: 'bribery', label: 'Corruption & Bribery Complaint', tamil: 'ஊழல் தடுப்புப் பிரிவு' },
  { id: 'other', label: 'Other State Services', tamil: 'இதர அரசு சேவைகள்' }
];

const INITIAL_MOCK_COMPLAINTS: Grievance[] = [
  {
    id: 'grv-1',
    referenceNo: 'TN-GRV-2026-48291',
    timestamp: '2026-07-14 09:15',
    recipient: "Chief Minister's Special Cell",
    category: 'Water Supply & Sewage',
    subject: 'Drinking Water Contamination in Adyar Area',
    description: 'The municipal drinking water supplied to Shastri Nagar 4th street is mixed with sewage water for the past 3 days. Please investigate immediately as this poses a serious health hazard.',
    priority: 'high',
    status: 'investigating',
    citizenId: 'CITIZEN-5932',
    citizenPhone: '+91 ••••• ••834',
    officialReply: 'The Metro Water board has dispatched an engineering crew to identify the cross-contamination pipe. Alternative water tankers have been deployed.',
    replyTimestamp: '2026-07-14 14:30',
    replyBy: 'CM Special Cell Secretary',
    attachment: {
      name: 'sewage_crosscontamination_evidence.jpg',
      size: '2.4 MB',
      type: 'image/jpeg'
    }
  },
  {
    id: 'grv-2',
    referenceNo: 'TN-GRV-2026-39104',
    timestamp: '2026-07-13 16:40',
    recipient: "Greater Chennai Corporation Commissioner",
    category: 'Infrastructure & Roads',
    subject: 'Dangerous potholes near Velachery MRTS Junction',
    description: 'Extremely deep pothole developed right after the rains near Velachery MRTS. Two-wheeler riders are falling daily. Temporary patching is urgently required before a major accident occurs.',
    priority: 'high',
    status: 'resolved',
    citizenId: 'CITIZEN-1094',
    citizenPhone: '+91 ••••• ••291',
    officialReply: 'Patchwork and wet mix compaction have been completed by the local ward contractor. Cold asphalt sealing has been verified by the Zonal Engineer.',
    replyTimestamp: '2026-07-14 10:15',
    replyBy: 'GCC Assistant Engineer',
    attachment: {
      name: 'velachery_junction_road_condition.png',
      size: '3.1 MB',
      type: 'image/png'
    }
  },
  {
    id: 'grv-3',
    referenceNo: 'TN-GRV-2026-10294',
    timestamp: '2026-07-12 11:20',
    recipient: "Hon'ble Governor of Tamil Nadu",
    category: 'Corruption & Bribery Complaint',
    subject: 'Illegal collection of parking fees at public beach road',
    description: 'Some unauthorized local elements are collecting ₹50 forcibly as parking fees on public roads near Marina. No official receipts are being given. Authorities must intervene to stop this extortion.',
    priority: 'medium',
    status: 'pending',
    citizenId: 'CITIZEN-8401',
    citizenPhone: '+91 ••••• ••773'
  },
  {
    id: 'grv-grant-approved',
    referenceNo: 'TN-GRANT-2026-12048',
    timestamp: '2026-07-11 10:20',
    recipient: "Hon'ble Governor of Tamil Nadu",
    category: "Governor's Grant - Financial Assistance",
    subject: "Aid Request for high education fees: Madras Christian College",
    description: "Student Name: [ANONYMIZED]. Institution: Madras Christian College. Course: B.Sc. Physics. Tuition fee burden: ₹45,000. Annual Income: ₹1,20,000. Hardship Statement: Father is an auto-driver and cannot afford the final semester tuition fees after medical bills.",
    priority: 'high',
    status: 'resolved',
    citizenId: 'CITIZEN-5932',
    citizenPhone: '+91 ••••• ••834',
    isAidRequest: true,
    aidStudentName: 'Karthik Subramanian',
    aidInstitution: 'Madras Christian College',
    aidCourse: 'B.Sc. Physics',
    aidTuitionFee: 45000,
    aidAnnualIncome: 120000,
    aidHardship: 'Father is an auto-driver and cannot afford the final semester tuition fees after medical bills.',
    grantStatus: 'approved',
    transferReference: 'GG-IMPS-TRF-2026-482091-SBIN',
    officialReply: "The Hon'ble Governor of Tamil Nadu has reviewed your application and has sanctioned a direct financial assistance grant of ₹45,000 to clear the educational burden. Funds have been disbursed via direct bank transfer to your institution escrow account under reference: GG-IMPS-TRF-2026-482091-SBIN.",
    replyTimestamp: '2026-07-12 11:30',
    replyBy: "Hon'ble Governor's Secretariat Office",
    attachment: {
      name: 'college_tuition_semester3_dues.pdf',
      size: '1.2 MB',
      type: 'application/pdf'
    }
  },
  {
    id: 'grv-grant-pending',
    referenceNo: 'TN-GRANT-2026-89401',
    timestamp: '2026-07-15 08:30',
    recipient: "Hon'ble Governor of Tamil Nadu",
    category: "Governor's Grant - Financial Assistance",
    subject: "Aid Request for high education fees: PSG College of Technology",
    description: "Student Name: [ANONYMIZED]. Institution: PSG College of Technology. Course: B.E. Mechanical Engineering. Tuition fee burden: ₹1,15,000. Annual Income: ₹1,80,000. Hardship Statement: Single mother working as a primary school helper cannot clear the high semester tuition fee.",
    priority: 'high',
    status: 'pending',
    citizenId: 'CITIZEN-8401',
    citizenPhone: '+91 ••••• ••773',
    isAidRequest: true,
    aidStudentName: 'Anitha Srinivasan',
    aidInstitution: 'PSG College of Technology',
    aidCourse: 'B.E. Mechanical Engineering',
    aidTuitionFee: 115000,
    aidAnnualIncome: 180000,
    aidHardship: 'Single mother working as a primary school helper cannot clear the high semester tuition fee.',
    grantStatus: 'pending',
    attachment: {
      name: 'psg_tuition_fees_structure.pdf',
      size: '1.9 MB',
      type: 'application/pdf'
    }
  }
];

export default function TNGrievancePortal() {
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [complaints, setComplaints] = useState<Grievance[]>(() => {
    const saved = localStorage.getItem('tn_govt_grievances');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MOCK_COMPLAINTS;
      }
    }
    return INITIAL_MOCK_COMPLAINTS;
  });

  // Save to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('tn_govt_grievances', JSON.stringify(complaints));
  }, [complaints]);

  // Screen Security State
  const [isBlurred, setIsBlurred] = useState(false);
  const [screenshotAttempted, setScreenshotAttempted] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  // Focus tracking to prevent background screenshot capture
  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => {
      setIsBlurred(false);
      setScreenshotAttempted(false);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Prevent PrintScreen/Screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setScreenshotAttempted(true);
        alert('SECURITY PROTOCOL: Screenshots are strictly blocked on this official secure government screen.');
      }
      // Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('SECURITY PROTOCOL: Printing this classified portal page is disabled to prevent leakage.');
      }
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
    };

    // Prevent Copy/Paste events
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert('ANONYMITY PRESERVATION: Copying text from the TN Government Grievance Portal is strictly disabled.');
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  // Navigation tabs
  const [citizenTab, setCitizenTab] = useState<'grievances' | 'feed' | 'aid'>('grievances');
  const [adminTab, setAdminTab] = useState<'all_grievances' | 'aid_requests'>('all_grievances');

  // Form states for "Report Issue"
  const [showReportModal, setShowReportModal] = useState(false);
  const [recipient, setRecipient] = useState(AUTHORITIES[1].name); // Default to CM Cell
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Financial Aid Form States
  const [aidStudentName, setAidStudentName] = useState('');
  const [aidInstitution, setAidInstitution] = useState('');
  const [aidCourse, setAidCourse] = useState('');
  const [aidAnnualIncome, setAidAnnualIncome] = useState('');
  const [aidTuitionFee, setAidTuitionFee] = useState('');
  const [aidHardship, setAidHardship] = useState('');
  const [aidCreatedNo, setAidCreatedNo] = useState('');
  const [aidPhone, setAidPhone] = useState('');

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [aidUploadedFile, setAidUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || 'unknown'
      });
    }
  };

  const handleAidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setAidUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || 'unknown'
      });
    }
  };
  
  // Submit animation states
  const [submittingState, setSubmittingState] = useState<'idle' | 'encrypting' | 'verifying' | 'routing' | 'done'>('idle');
  const [newlyCreatedNo, setNewlyCreatedNo] = useState('');

  // Selected complaint for review (Citizen views own, Gov views selected)
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Admin responding states
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminStatusChange, setAdminStatusChange] = useState<'pending' | 'investigating' | 'resolved' | 'declined'>('investigating');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Filters for Admin View
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRecipient, setFilterRecipient] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Triggering toast notice
  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => {
      setAdminToast(null);
    }, 3500);
  };

  // Generate anonymous citizen signature for submission
  const generateAnonymousId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CITIZEN-${randomNum}`;
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    // Start secure submission flow
    setSubmittingState('encrypting');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('verifying');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('routing');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('done');
    await new Promise(r => setTimeout(r, 400));

    const refNumber = `TN-GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setNewlyCreatedNo(refNumber);

    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      referenceNo: refNumber,
      timestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
      recipient,
      category,
      subject,
      description,
      priority,
      status: 'pending',
      citizenId: generateAnonymousId(),
      citizenPhone: '+91 ••••• ••' + Math.floor(100 + Math.random() * 900),
      attachment: uploadedFile ? { ...uploadedFile } : undefined
    };

    setComplaints(prev => [newGrievance, ...prev]);
    
    // Reset Form
    setSubject('');
    setDescription('');
    setPriority('medium');
    setUploadedFile(null);
    
    // Keep dialog open to show success state, then user can close it.
  };

  // Admin handles replying & changing status of a complaint
  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId) return;

    setComplaints(prev => prev.map(c => {
      if (c.id === selectedComplaintId) {
        return {
          ...c,
          status: adminStatusChange,
          officialReply: adminReplyText.trim() || c.officialReply,
          replyTimestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
          replyBy: role === 'admin' ? 'Hon\'ble Governor\'s Secretariat Office' : 'State Representative Node'
        };
      }
      return c;
    }));

    triggerToast(`Grievance status updated & encrypted response routed.`);
    setAdminReplyText('');
  };

  // Admin handles Gov Grants (approving or declining)
  const handleAdminGrantAction = (id: string, action: 'approve' | 'decline') => {
    const trfRef = `GG-IMPS-TRF-2026-${Math.floor(100000 + Math.random() * 900000)}-SBIN`;
    
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        if (action === 'approve') {
          return {
            ...c,
            status: 'resolved',
            grantStatus: 'approved',
            transferReference: trfRef,
            officialReply: `The Hon'ble Governor of Tamil Nadu has reviewed your application and has sanctioned a direct discretionary education grant of ₹${c.aidTuitionFee?.toLocaleString('en-IN')} to clear your outstanding educational fee burden. Funds have been successfully disbursed via direct bank transfer to your institution escrow account under reference: ${trfRef}.`,
            replyTimestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
            replyBy: "Hon'ble Governor's Secretariat Office"
          };
        } else {
          return {
            ...c,
            status: 'declined',
            grantStatus: 'declined',
            officialReply: "After careful evaluation of the income-to-burden ratio against the current fiscal discretionary allotment, we are unable to clear the discretionary grant at this time. We encourage applying for state-level general welfare fee waivers.",
            replyTimestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
            replyBy: "Hon'ble Governor's Secretariat Office"
          };
        }
      }
      return c;
    }));

    triggerToast(action === 'approve' ? "Governor's Grant approved. Disbursal transaction committed and routed." : "Grant application declined.");
  };

  // Submit Financial Aid Request
  const handleCreateAidRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aidStudentName.trim() || !aidInstitution.trim() || !aidTuitionFee || !aidHardship.trim()) return;

    // Start secure submission flow
    setSubmittingState('encrypting');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('verifying');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('routing');
    await new Promise(r => setTimeout(r, 650));
    setSubmittingState('done');
    await new Promise(r => setTimeout(r, 400));

    const refNumber = `TN-GRANT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setAidCreatedNo(refNumber);

    const newAidGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      referenceNo: refNumber,
      timestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
      recipient: "Hon'ble Governor of Tamil Nadu",
      category: "Governor's Grant - Financial Assistance",
      subject: `Aid Request for high education fees: ${aidInstitution}`,
      description: `Student Name: [ANONYMIZED]. Institution: ${aidInstitution}. Course: ${aidCourse || 'N/A'}. Tuition fee burden: ₹${Number(aidTuitionFee).toLocaleString('en-IN')}. Annual Family Income: ₹${Number(aidAnnualIncome).toLocaleString('en-IN')}. Hardship Statement: ${aidHardship}`,
      priority: 'high',
      status: 'pending',
      citizenId: generateAnonymousId(),
      citizenPhone: '+91 ••••• ••' + Math.floor(100 + Math.random() * 900),
      isAidRequest: true,
      aidStudentName,
      aidInstitution,
      aidCourse,
      aidTuitionFee: Number(aidTuitionFee),
      aidAnnualIncome: Number(aidAnnualIncome),
      aidHardship,
      grantStatus: 'pending',
      attachment: aidUploadedFile ? { ...aidUploadedFile } : undefined
    };

    setComplaints(prev => [newAidGrievance, ...prev]);

    // Reset Form
    setAidStudentName('');
    setAidInstitution('');
    setAidCourse('');
    setAidAnnualIncome('');
    setAidTuitionFee('');
    setAidHardship('');
    setAidUploadedFile(null);
  };

  // Dynamic + Static Public Alerts and Action stream
  const getPublicFeed = () => {
    // Dynamic alerts from resolved/investigating standard grievances and approved grants
    const dynamicAlerts = complaints
      .filter(c => c.status === 'resolved' || c.status === 'investigating' || c.officialReply)
      .map(c => ({
        id: `feed-${c.id}`,
        type: c.isAidRequest ? 'grant' : 'grievance',
        title: c.isAidRequest ? "Governor's Financial Grant Disbursed" : 'Public Grievance Action Taken',
        refNo: c.referenceNo,
        timestamp: c.replyTimestamp || c.timestamp,
        summary: c.isAidRequest 
          ? `Governor's Grant of ₹${c.aidTuitionFee?.toLocaleString('en-IN')} approved and wired for tuition fees at ${c.aidInstitution}. Anonymized citizen student identifier: ${c.citizenId}.`
          : `Grievance reference ${c.referenceNo} resolved by ${c.replyBy || 'Zonal Authority'}. Action: "${c.officialReply || 'Remedial actions completed.'}"`,
        category: c.category,
        recipient: c.recipient,
        status: c.status,
        subject: c.subject
      }));

    // Realistic static historical feed items to populate the view
    const staticAlerts = [
      {
        id: 'feed-static-1',
        type: 'grievance',
        title: 'Road Re-laying and Patchwork Verified',
        refNo: 'TN-GRV-2026-39104',
        timestamp: '2026-07-14 10:15',
        summary: 'Greater Chennai Corporation Commissioner successfully completed high-grade asphalt patchwork and compaction sealing near Velachery MRTS Junction to safeguard public commute.',
        category: 'Infrastructure & Roads',
        recipient: 'Greater Chennai Corporation Commissioner',
        status: 'resolved',
        subject: 'Dangerous potholes near Velachery MRTS Junction'
      },
      {
        id: 'feed-static-2',
        type: 'grant',
        title: 'Governor\'s Education Discretionary Grant Wired',
        refNo: 'TN-GRANT-2026-12048',
        timestamp: '2026-07-12 11:30',
        summary: 'The Hon\'ble Governor approved and cleared semester tuition fees of ₹45,000 for a struggling student studying B.Sc. Physics at Madras Christian College. Transfer ID: GG-IMPS-TRF-2026-482091-SBIN.',
        category: "Governor's Grant - Financial Assistance",
        recipient: "Hon'ble Governor of Tamil Nadu",
        status: 'resolved',
        subject: 'College Tuition Fee Burden'
      },
      {
        id: 'feed-static-3',
        type: 'grievance',
        title: 'Municipal Sewers cross-contamination Remedied',
        refNo: 'TN-GRV-2026-48291',
        timestamp: '2026-07-14 14:30',
        summary: 'Chief Minister\'s Special Cell routed water complaints to Metro Water engineers who successfully isolated a cross-contamination sewer pipe in Shastri Nagar, Adyar. Drinking water quality restored.',
        category: 'Water Supply & Sewage',
        recipient: "Chief Minister's Special Cell",
        status: 'investigating',
        subject: 'Drinking Water Contamination in Adyar Area'
      }
    ];

    // Combine and remove duplicate reference numbers (dynamic overrides static mock if matches)
    const combined = [...dynamicAlerts];
    staticAlerts.forEach(item => {
      if (!combined.some(c => c.refNo === item.refNo)) {
        combined.push(item);
      }
    });

    // Sort descending by timestamp
    return combined.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  };

  // Visible complaints according to Tab + Role + Filters
  const visibleComplaints = complaints.filter(c => {
    // 1. Filter by Role & Sub-tab
    if (role === 'citizen') {
      if (citizenTab === 'grievances') {
        // Exclude aid requests
        if (c.isAidRequest) return false;
      } else if (citizenTab === 'aid') {
        // Show only aid requests
        if (!c.isAidRequest) return false;
      } else if (citizenTab === 'feed') {
        // No left-side complaints needed for public feed tab!
        return false;
      }
    } else {
      // Admin filter by tab
      if (adminTab === 'all_grievances') {
        if (c.isAidRequest) return false;
      } else {
        if (!c.isAidRequest) return false;
      }

      // Admin custom filters
      if (filterCategory !== 'all' && c.category !== filterCategory) return false;
      if (filterRecipient !== 'all' && c.recipient !== filterRecipient) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    }
    return true;
  });

  const citizenGrievances = complaints.filter(c => !c.isAidRequest);
  
  // Calculate stats dynamically for dashboard
  const statsTotal = role === 'admin' 
    ? (adminTab === 'all_grievances' ? complaints.filter(c => !c.isAidRequest).length : complaints.filter(c => c.isAidRequest).length)
    : citizenGrievances.length;
    
  const statsPending = role === 'admin'
    ? (adminTab === 'all_grievances' ? complaints.filter(c => !c.isAidRequest && c.status === 'pending').length : complaints.filter(c => c.isAidRequest && c.status === 'pending').length)
    : citizenGrievances.filter(c => c.status === 'pending').length;
    
  const statsResolved = role === 'admin'
    ? (adminTab === 'all_grievances' ? complaints.filter(c => !c.isAidRequest && c.status === 'resolved').length : complaints.filter(c => c.isAidRequest && c.status === 'resolved').length)
    : citizenGrievances.filter(c => c.status === 'resolved').length;

  return (
    <div
      ref={portalRef}
      className="relative flex-1 flex flex-col overflow-hidden bg-[#fbfcfb] text-slate-800 h-full w-full select-none"
      style={{ userSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
      id="tn-grievance-portal"
    >
      {/* ⚠️ HIGH SECURITY SCREEN BLUR OVERLAY (Protects against lose-focus/background-capture) */}
      <AnimatePresence>
        {isBlurred && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl z-[90] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
              <LockKeyhole size={32} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
              TN GOVT SECURE PROTOCOL ACTIVE
            </h2>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1.5 font-mono">
              Content is encrypted and hidden because focus left the application window. Return cursor to restore Citizen Link.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Watermark Pattern to prevent clean photos/screen capture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden select-none z-30 flex flex-wrap gap-12 p-6 rotate-[-12deg] scale-110">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="text-[9px] font-mono tracking-widest text-slate-900 font-bold select-none whitespace-nowrap">
            TN-GOVT-SECURE-PROTOCOL • CITIZEN-ANONYMOUS-PAYLOAD
          </div>
        ))}
      </div>

      {/* TOP HEADER BLOCK - TN OFFICIAL AESTHETIC */}
      <div className="bg-emerald-900 border-b-2 border-amber-500/80 shadow-md shrink-0 select-none" id="portal-govt-header">
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Text in English and Tamil */}
          <div className="flex items-center gap-3.5 text-white">
            {/* Real Official TN Government Logo */}
            <div className="w-14 h-14 bg-white rounded-full border border-amber-400 p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300" id="tn-emblem-badge">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/81/Emblem_of_Tamil_Nadu.svg" 
                alt="Government of Tamil Nadu Emblem" 
                className="w-11 h-11 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('tn-emblem-fallback-header');
                  if (fallback) {
                    fallback.classList.remove('hidden');
                  }
                }}
              />
              <div id="tn-emblem-fallback-header" className="hidden w-full h-full text-amber-500">
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500" fill="currentColor">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M50 15 L32 75 L38 75 L39 65 L61 65 L62 75 L68 75 Z" fill="currentColor" opacity="0.85" />
                  <path d="M50 25 L41 55 L59 55 Z" fill="#15803d" />
                  <rect x="47" y="55" width="6" height="20" fill="currentColor" />
                  <line x1="25" y1="80" x2="75" y2="80" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="15" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-base font-bold tracking-wider text-amber-300 font-sans leading-tight">தமிழ்நாடு அரசு</span>
                <span className="text-white/40 font-mono text-xs">|</span>
                <span className="text-xs font-bold tracking-widest text-slate-200 font-mono uppercase">Govt of Tamil Nadu</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white font-sans mt-0.5" id="portal-title-banner">
                Grievance Redressal & Citizen Portal <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 ml-1.5 font-mono font-bold">மக்கள் குறைதீர்ப்பகம்</span>
              </h1>
              <p className="text-[10px] text-emerald-200/80 font-serif italic mt-0.5 tracking-wide">
                "வாய்மையே வெல்லும்" • Truth Alone Triumphs • Secure Sandbox Encryption Protocol
              </p>
            </div>
          </div>

          {/* Role selection & Security Indicators */}
          <div className="flex flex-wrap items-center gap-3.5 justify-center">
            
            {/* Active Security badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-inner select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SCREEN-CAPTURE SHIELD ACTIVE</span>
            </div>

            {/* Role switch toggle */}
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/10" id="role-toggle-selector">
              <button
                type="button"
                onClick={() => {
                  setRole('citizen');
                  setSelectedComplaintId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                  role === 'citizen'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={11} />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setSelectedComplaintId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                  role === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                id="role-btn-authority"
              >
                <Shield size={11} />
                <span>TN Governor / Admin</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex flex-wrap gap-2 items-center justify-between shrink-0 select-none z-10" id="portal-tab-bar">
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {role === 'citizen' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setCitizenTab('grievances');
                  setSelectedComplaintId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  citizenTab === 'grievances'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText size={14} />
                <span>My Grievances</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCitizenTab('feed');
                  setSelectedComplaintId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  citizenTab === 'feed'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Megaphone size={14} />
                <span>Public Alerts & Action Feed</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCitizenTab('aid');
                  setSelectedComplaintId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  citizenTab === 'aid'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen size={14} />
                <span>Apply for Assistance</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setAdminTab('all_grievances');
                  setSelectedComplaintId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  adminTab === 'all_grievances'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building size={14} />
                <span>Standard Grievances Desk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminTab('gov_grants');
                  setSelectedComplaintId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  adminTab === 'gov_grants'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Award size={14} />
                <span>Governor's Grants Review Desk</span>
              </button>
            </>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-mono hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>PORTAL_SESSION_ACTIVE</span>
        </div>
      </div>

      {/* MAIN BODY OF PAGE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden" id="portal-grid-body">
        
        {role === 'citizen' && citizenTab === 'feed' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50" id="portal-public-feed-view">
            {/* LEFT BAR: Public Information and Statistics */}
            <div className="w-full md:w-80 bg-emerald-950 text-white p-5 space-y-6 flex flex-col overflow-y-auto shrink-0 border-r border-slate-200">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Megaphone size={20} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">Public Awareness Bulletin</h3>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed font-sans">
                  Real-time action stream of resolved grievances and Discretionary Grants. This feed is published in the interest of transparency and building citizen trust.
                </p>
              </div>

              <div className="border-t border-emerald-800/60 pt-5 space-y-4">
                <h4 className="text-[10px] uppercase font-mono font-bold text-amber-400/80 tracking-widest">TRANSPARENCY METRICS</h4>
                
                <div className="grid grid-cols-2 gap-3 font-mono text-center">
                  <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/40">
                    <span className="block text-lg font-bold text-white">100%</span>
                    <span className="text-[9px] text-emerald-300 uppercase font-bold">Anonymized</span>
                  </div>
                  <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/40">
                    <span className="block text-lg font-bold text-amber-300">₹4.8M+</span>
                    <span className="text-[9px] text-emerald-300 uppercase font-bold">Aid Disbursed</span>
                  </div>
                </div>

                <div className="bg-emerald-900/30 p-3.5 rounded-xl border border-emerald-800/30 text-[10px] leading-relaxed text-emerald-100/90 space-y-2">
                  <p className="font-bold uppercase tracking-wide flex items-center gap-1 font-mono">
                    <Shield size={12} className="text-amber-400" />
                    <span>Identity Lock Active</span>
                  </p>
                  <p className="font-mono text-[9px] text-emerald-300/80">
                    Names, telephone digits, and localized addresses are fully hashed and masked. Only official Resolution IDs are visible to the public.
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN STREAM VIEW */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Live Resolution & Grant Stream</h2>
                  <p className="text-[10px] text-slate-400">Cryptographically signed resolutions updated in real-time</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComplaints([...complaints])}
                  className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                >
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Sync Feed</span>
                </button>
              </div>

              <div className="space-y-4 max-w-3xl">
                {getPublicFeed().map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 space-y-3.5 relative overflow-hidden"
                  >
                    {/* Badge header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold font-mono tracking-wider px-2 py-0.5 rounded uppercase border ${
                          alert.type === 'grant'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {alert.type === 'grant' ? "GOVERNOR'S GRANT DISBURSEMENT" : 'RESOLVED GRIEVANCE'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">ID: {alert.referenceNo}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-800">{alert.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{alert.summary}"
                      </p>
                    </div>

                    {/* Official seal decoration */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 size={11} />
                        <span>TN Secretariat Verified Action</span>
                      </span>
                      <span>MD5: {alert.verificationCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : role === 'citizen' && citizenTab === 'aid' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50" id="portal-financial-aid-view">
            
            {/* LEFT COLUMN: Apply for Assistance Form */}
            <div className="w-full md:w-[420px] bg-white border-r border-slate-200 p-6 space-y-5 flex flex-col overflow-y-auto shrink-0">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <Award size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">Apply for Governor's Grant</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Discretionary financial assistance for high-hardship private school and college tuition fee burdens. Fully anonymized for citizen privacy.
                </p>
              </div>

              <form onSubmit={handleCreateAidRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Student Full Name</label>
                  <input
                    type="text"
                    value={aidStudentName}
                    onChange={(e) => setAidStudentName(e.target.value)}
                    placeholder="Enter full legal name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-bold"
                    required
                  />
                  <p className="text-[9px] text-slate-400 italic">Anonymized automatically; only the reviewing authority will verify eligibility.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Annual Family Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">₹</span>
                      <input
                        type="number"
                        value={aidAnnualIncome}
                        onChange={(e) => setAidAnnualIncome(e.target.value)}
                        placeholder="e.g. 150000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-6 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tuition Fee Burden</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">₹</span>
                      <input
                        type="number"
                        value={aidTuitionFee}
                        onChange={(e) => setAidTuitionFee(e.target.value)}
                        placeholder="e.g. 75000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-6 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">School / College Name</label>
                  <input
                    type="text"
                    value={aidInstitution}
                    onChange={(e) => setAidInstitution(e.target.value)}
                    placeholder="Enter school or university name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Course / Grade</label>
                    <input
                      type="text"
                      value={aidCourse}
                      onChange={(e) => setAidCourse(e.target.value)}
                      placeholder="e.g. B.E. Computer Science"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Mobile No</label>
                    <input
                      type="tel"
                      value={aidPhone}
                      onChange={(e) => setAidPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Financial Hardship Circumstances</label>
                  <textarea
                    value={aidHardship}
                    onChange={(e) => setAidHardship(e.target.value)}
                    rows={3}
                    placeholder="Describe outstanding dues, parental income constraints, and why discretionary aid is required..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                {/* Secure Tuition Bill / Receipt Upload Drag & Drop */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Tuition Bill / Fee Receipt (கட்டண ரசீது - Optional)
                  </label>
                  
                  {!aidUploadedFile ? (
                    <div 
                      className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/10 transition-all duration-200 group relative"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                          setAidUploadedFile({
                            name: file.name,
                            size: `${sizeMB} MB`,
                            type: file.type || 'unknown'
                          });
                        }
                      }}
                    >
                      <input 
                        type="file" 
                        id="aid-file-upload" 
                        className="hidden" 
                        onChange={handleAidFileChange} 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <label htmlFor="aid-file-upload" className="cursor-pointer block w-full h-full">
                        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-colors">
                            <Plus size={16} />
                          </div>
                          <p className="text-[11px] font-bold text-slate-700">Drag & drop files here, or <span className="text-emerald-600">browse</span></p>
                          <p className="text-[9px] text-slate-400 font-mono">PDF, PNG, JPG, DOC (Max 10MB)</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800 shrink-0 font-bold">
                          <FileSpreadsheet size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 font-mono truncate">{aidUploadedFile.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{aidUploadedFile.size} • {aidUploadedFile.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAidUploadedFile(null)}
                        className="w-7 h-7 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5 uppercase font-mono tracking-wider"
                >
                  <Award size={14} className="text-amber-400" />
                  <span>Submit Discretionary Aid Request</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: Interactive Status Assessment & Verified Aid Cards */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">My Financial Aid Requests</h3>
                <p className="text-[10px] text-slate-400">Track and view official Governor's Treasury disbursements</p>
              </div>

              {visibleComplaints.length === 0 ? (
                <div className="max-w-xl p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
                  <BookOpen className="mx-auto text-slate-300" size={32} />
                  <h4 className="text-xs font-bold text-slate-700">No Active Assistance Requests Found</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Submit your application using the discretionary aid request form on the left. Once assessed by the Governor's Secretariat, updates will render here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-5xl">
                  {visibleComplaints.map((item) => {
                    const isApproved = item.grantStatus === 'approved';
                    const isDeclined = item.grantStatus === 'declined';
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedComplaintId(item.id)}
                        className={`bg-white border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md cursor-pointer relative overflow-hidden space-y-4 ${
                          selectedComplaintId === item.id ? 'ring-2 ring-emerald-800' : ''
                        }`}
                      >
                        {/* Header info */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-1">
                          <div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200 px-2 py-0.5 rounded font-mono">
                              REF: {item.referenceNo}
                            </span>
                            <p className="text-[9px] text-slate-400 mt-1 font-mono">{item.timestamp}</p>
                          </div>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isDeclined
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          }`}>
                            GRANT {item.grantStatus || 'pending'}
                          </span>
                        </div>

                        {/* Summary of Burden */}
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Institution & Course</p>
                          <p className="font-bold text-slate-800 truncate">{item.aidInstitution}</p>
                          <p className="text-slate-500 text-[11px] truncate">{item.aidCourse}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold">FEES REQUESTED</p>
                            <p className="font-bold text-amber-700">₹{item.aidTuitionFee?.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold font-mono">FAMILY INCOME</p>
                            <p className="text-slate-600 font-bold">₹{item.aidAnnualIncome?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        {/* Verification or Disbursed Badge */}
                        {isApproved ? (
                          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-xl border border-amber-500/30 p-4 font-mono text-[10px] space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                              <Award size={13} />
                              <span className="uppercase tracking-widest text-[9px]">GOVERNOR'S DISCRETIONARY GRANT DISBURSED</span>
                            </div>
                            <div className="bg-black/25 p-2 rounded text-[9px] space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-400">TRANSFER WIRE</span>
                                <span className="text-white font-bold truncate max-w-[120px]">{item.transferReference}</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-emerald-300 italic">"Treasury funds dispatched directly to school escrow."</p>
                          </div>
                        ) : (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 border-dashed text-slate-400 text-[10px] font-mono text-center">
                            {isDeclined ? 'Assessment completed. Application concluded.' : 'Under Assessment by Discretionary Desk'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* LEFT SIDEBAR: STATISTICS & FILTERS / RECENT COMPLAINTS */}
            <div className={`${selectedComplaintId ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-slate-50 border-r border-slate-200 flex-col overflow-y-auto shrink-0`} id="portal-side-panel">
          
          {/* Top Info Alert Block */}
          <div className="p-4 bg-emerald-900/[0.03] border-b border-slate-200 space-y-3.5 select-none">
            <div className="flex gap-2.5">
              <ShieldAlert className="text-emerald-800 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">ANONYMITY & PRIVACY ASSURED</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Your identity is cryptographic. Phone numbers are fully masked. Authorities handle issues based on location/category without exposing personal databases.
                </p>
              </div>
            </div>

            {role === 'citizen' ? (
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(true);
                  setSubmittingState('idle');
                }}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                id="report-issue-trigger-btn"
              >
                <Plus size={14} />
                <span>மனு தாக்கல் / Report Issue</span>
              </button>
            ) : (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-bold text-amber-900 flex items-center gap-2">
                <Shield size={13} className="text-amber-700" />
                <span>OFFICIAL GOVERNOR ACCESS ENABLED</span>
              </div>
            )}
          </div>

          {/* STATS COUNT */}
          <div className="p-4 border-b border-slate-200 select-none">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 font-mono">
              {role === 'admin' ? 'STATE-WIDE STATUS LOGS' : 'MY CURRENT LOG SUMMARY'}
            </h3>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-mono font-medium text-slate-400 leading-none uppercase">Total</p>
                <p className="text-lg font-bold text-slate-800 mt-1.5 font-mono">
                  {role === 'admin' ? statsTotal : complaints.length}
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-mono font-medium text-slate-400 leading-none uppercase">Pending</p>
                <p className="text-lg font-bold text-amber-600 mt-1.5 font-mono">
                  {role === 'admin' ? statsPending : complaints.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-mono font-medium text-slate-400 leading-none uppercase">Resolved</p>
                <p className="text-lg font-bold text-emerald-600 mt-1.5 font-mono">
                  {role === 'admin' ? statsResolved : complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          {/* ADMIN FILTERS CONTROL */}
          {role === 'admin' && (
            <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-100/60 select-none">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Filter Grievances</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterRecipient('all');
                    setFilterStatus('all');
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Recipient authority filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Target Recipient</label>
                <select
                  value={filterRecipient}
                  onChange={(e) => setFilterRecipient(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="all">All Authorities</option>
                  {AUTHORITIES.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="investigating">In Investigation</option>
                  <option value="resolved">Resolved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
          )}

          {/* LIST OF COMPLAINTS */}
          <div className="flex-1 flex flex-col min-h-[250px]" id="complaints-list-pane">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center select-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                {role === 'admin' ? `Filtered Logs (${visibleComplaints.length})` : citizenTab === 'aid' ? `My Aid Requests (${visibleComplaints.length})` : `My Submissions (${visibleComplaints.length})`}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {visibleComplaints.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <FileText className="mx-auto text-slate-300" size={28} />
                  <p className="text-xs">No entries found.</p>
                  {role === 'citizen' && citizenTab === 'grievances' && (
                    <p className="text-[10px] text-slate-400">Click "Report Issue" to file your first official request.</p>
                  )}
                  {role === 'citizen' && citizenTab === 'aid' && (
                    <p className="text-[10px] text-slate-400">Use the form to request discretionary financial assistance.</p>
                  )}
                </div>
              ) : (
                visibleComplaints.map((item) => {
                  const isSelected = selectedComplaintId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedComplaintId(item.id);
                        setAdminStatusChange(item.status);
                      }}
                      className={`w-full p-3.5 text-left transition-all hover:bg-slate-100/80 flex flex-col gap-2 border-l-4 cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50/60 border-l-emerald-600' 
                          : item.status === 'resolved' 
                            ? 'border-l-emerald-500/40 bg-white' 
                            : item.status === 'pending'
                              ? 'border-l-amber-500 bg-white'
                              : 'border-l-indigo-500/40 bg-white'
                      }`}
                      id={`complaint-item-${item.id}`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-slate-200/50">
                          {item.referenceNo}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          item.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'investigating'
                              ? 'bg-indigo-100 text-indigo-800'
                              : item.status === 'declined'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 capitalize">{item.subject}</h4>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                        <span className="truncate max-w-[130px]">{item.recipient}</span>
                        <span>{item.timestamp.split(' ')[0]}</span>
                      </div>

                      {/* Display masking details for safety assurance */}
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 border-t border-slate-100/80 pt-1.5">
                        <EyeOff size={10} className="text-slate-300" />
                        <span className="font-mono">ID: {item.citizenId}</span>
                        <span>•</span>
                        <span className="font-mono">{item.citizenPhone}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR / CONTENT VIEW: DETAILED COMPLAINT REDRESSAL DESK */}
        <div className={`${selectedComplaintId ? 'flex' : 'hidden md:flex'} flex-1 bg-white flex-col overflow-y-auto`} id="portal-content-details">
          {selectedComplaintId ? (
            (() => {
              const activeComplaint = complaints.find(c => c.id === selectedComplaintId);
              if (!activeComplaint) return null;

              if (activeComplaint.isAidRequest) {
                return (
                  <div className="p-6 space-y-6" id={`complaint-detailed-pane-${activeComplaint.id}`}>
                    {/* Grant Header */}
                    <div className="border-b border-slate-100 pb-5 space-y-3">
                      {/* Mobile Back Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedComplaintId(null)}
                        className="md:hidden flex items-center gap-1 text-xs text-indigo-600 font-bold mb-2 cursor-pointer hover:text-indigo-800 transition-colors"
                      >
                        <ArrowLeft size={14} />
                        <span>Back to submissions</span>
                      </button>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-800 font-bold border border-amber-500/20 px-2 py-1 rounded-md font-mono tracking-wider">
                            GOVERNOR'S DISCRETIONARY GRANT: {activeComplaint.referenceNo}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                            Cryptographic Timestamp: {activeComplaint.timestamp}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase border ${
                            activeComplaint.grantStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : activeComplaint.grantStatus === 'declined'
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          }`}>
                            GRANT: {activeComplaint.grantStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug flex items-center gap-2">
                        <Award size={18} className="text-amber-500 shrink-0" />
                        <span>Discretionary Financial Aid Merit Assessment</span>
                      </h2>
                    </div>

                    {/* Merit Assessment Profile Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Student Name</p>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-1">
                          <User size={14} className="text-amber-600" />
                          <span>{role === 'admin' ? activeComplaint.aidStudentName : '[ANONYMIZED FOR CITIZENS]'}</span>
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Annual Family Income</p>
                        <p className="text-xs font-bold text-slate-800 mt-1 font-mono">
                          ₹{activeComplaint.aidAnnualIncome?.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">School / College</p>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {activeComplaint.aidInstitution}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Outstanding Tuition Fee Burden</p>
                        <p className="text-xs font-bold text-amber-700 mt-1 font-mono">
                          ₹{activeComplaint.aidTuitionFee?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Hardship Statement Description */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">HARDSHIP STATEMENT & CIRCUMSTANCES</h3>
                      <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed border border-white/5 relative overflow-hidden select-none">
                        <span className="text-amber-400 font-bold mr-1.5">$</span>
                        <span>{activeComplaint.aidHardship}</span>

                        <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-slate-500 flex justify-between items-center select-none font-mono">
                          <span>GRANT_VERIFICATION_MD5: f1b90...283c</span>
                          <span className="text-amber-500/80 font-bold">OFFICIAL MERIT DISCRETION ENCRYPTED</span>
                        </div>
                      </div>
                    </div>

                    {/* Attached Tuition Bill/Receipt file with TN Government Seal Logo Badge */}
                    {activeComplaint.attachment && (
                      <div className="space-y-2">
                        <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">ATTACHED TUITION BILL / RECEIPT</h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 font-bold shrink-0">
                              <FileSpreadsheet size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 font-mono truncate max-w-[200px] sm:max-w-xs">{activeComplaint.attachment.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{activeComplaint.attachment.size} • {activeComplaint.attachment.type.toUpperCase()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Real TN Government Logo Seal Badge on verified attachment */}
                            <div className="flex items-center gap-1.5 bg-emerald-900/5 border border-emerald-900/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-800 font-bold">
                              <div className="w-4 h-4 rounded-full bg-white border border-amber-400 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                <img 
                                  src="https://upload.wikimedia.org/wikipedia/commons/8/81/Emblem_of_Tamil_Nadu.svg" 
                                  alt="TN Logo" 
                                  className="w-3 h-3 object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span>VERIFIED BY TN GOVT</span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => triggerToast(`Downloading secure sandboxed file: ${activeComplaint.attachment?.name}`)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] font-mono rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Secure Shield Alert */}
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200/50 rounded-xl flex items-center gap-3">
                      <EyeOff className="text-indigo-600 shrink-0" size={18} />
                      <div className="text-[10px] text-indigo-900 leading-relaxed font-mono">
                        <p className="font-bold uppercase tracking-wider">🔒 Citizen Identity Cloaked</p>
                        <p className="text-slate-500 mt-0.5">
                          Citizen ID: <span className="font-bold text-slate-700">{activeComplaint.citizenId}</span> | 
                          Masked Contact: <span className="font-bold text-slate-700">{activeComplaint.citizenPhone}</span>.
                          Real identities are hidden from logs to prevent profiling or discrimination.
                        </p>
                      </div>
                    </div>

                    {/* RESPONSE / DISBURSEMENT RECEIPT CARD */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-700" />
                        <span>Action Report & Secretariat Response</span>
                      </h3>

                      {activeComplaint.grantStatus === 'approved' ? (
                        <div className="space-y-4">
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-start text-[10px] font-mono border-b border-emerald-500/10 pb-2">
                              <div>
                                <span className="font-bold text-emerald-800 uppercase tracking-wider">GRANT RECIPIENT STATUS: </span>
                                <span className="text-slate-700 font-bold">FUNDS DISBURSED</span>
                              </div>
                              <span className="text-slate-400">{activeComplaint.replyTimestamp}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-sans italic">
                              "{activeComplaint.officialReply}"
                            </p>
                            <div className="pt-1.5 flex items-center gap-1 text-[9px] text-emerald-700 font-mono font-bold">
                              <Check size={12} />
                              <span>Governor's Treasury Seal Verified</span>
                            </div>
                          </div>

                          {/* Beautiful Disbursed card inline */}
                          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl border-2 border-amber-500/50 p-5 shadow-md">
                            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-3">
                              <div className="flex items-center gap-2">
                                <Award className="text-amber-400" size={16} />
                                <span className="text-[10px] font-mono tracking-widest font-bold text-amber-300">
                                  FINANCIAL ASSISTANCE APPROVED
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Wired</span>
                            </div>
                            <div className="text-xs space-y-2.5 font-mono">
                              <p className="text-[11px] font-serif text-slate-300 italic">"Discretionary funds disbursed via direct bank transfer to institution escrow account."</p>
                              <div className="bg-black/25 p-3 rounded-lg space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">STUDENT IDENTIFIER</span>
                                  <span className="text-white font-bold">{activeComplaint.citizenId}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">INSTITUTION</span>
                                  <span className="text-white font-bold truncate max-w-[200px]">{activeComplaint.aidInstitution}</span>
                                </div>
                                <div className="flex justify-between text-[10px] border-t border-white/5 pt-1.5 mt-1.5">
                                  <span className="text-amber-400 font-bold">GRANT TOTAL APPROVED</span>
                                  <span className="text-sm font-bold text-amber-300">₹{activeComplaint.aidTuitionFee?.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-950 p-2 rounded-lg border border-emerald-800">
                                <Coins size={14} className="text-amber-400" />
                                <div className="text-[9px]">
                                  <p className="text-slate-400 font-bold">Simulated Transfer Reference</p>
                                  <p className="text-amber-300 font-bold truncate max-w-[240px]">{activeComplaint.transferReference}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : activeComplaint.grantStatus === 'declined' ? (
                        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 space-y-2">
                          <div className="flex justify-between text-[10px] font-mono border-b border-slate-200/50 pb-2 mb-2">
                            <span className="font-bold text-slate-600">GRANT APPLICATION CONCLUDED</span>
                            <span>{activeComplaint.replyTimestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            "{activeComplaint.officialReply}"
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center text-slate-400 text-xs py-6">
                          <Clock size={20} className="mx-auto text-slate-300 mb-2 animate-spin-slow" />
                          <span>No official resolution has been decided yet. This aid request is under assessment by the Governor's Secretariat.</span>
                        </div>
                      )}
                    </div>

                    {/* GOVERNOR GRANT ACTIONS (Only authority can decide grants) */}
                    {role === 'admin' && activeComplaint.grantStatus === 'pending' && (
                      <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-4 mt-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
                          <Shield className="text-amber-600 font-bold" size={16} />
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
                            Governor's Grant Assessment Actions
                          </h4>
                        </div>
                        
                        <div className="p-3 bg-white border border-amber-500/10 rounded-xl text-[10.5px] leading-relaxed text-slate-600">
                          Review student income (₹{activeComplaint.aidAnnualIncome?.toLocaleString('en-IN')}) against tuition burden (₹{activeComplaint.aidTuitionFee?.toLocaleString('en-IN')}). If genuine, click Approve to instantly dispatch discretionary fund transfer.
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleAdminGrantAction(activeComplaint.id, 'approve')}
                            className="py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5 uppercase font-mono tracking-wider text-center"
                          >
                            <CheckSquare size={13} />
                            <span>Approve Grant (₹)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAdminGrantAction(activeComplaint.id, 'decline')}
                            className="py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5 uppercase font-mono tracking-wider text-center border border-slate-300"
                          >
                            <X size={13} />
                            <span>Decline Request</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="p-6 space-y-6" id={`complaint-detailed-pane-${activeComplaint.id}`}>
                  
                  {/* Detailed Card Top Block */}
                  <div className="border-b border-slate-100 pb-5 space-y-3.5">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedComplaintId(null)}
                      className="md:hidden flex items-center gap-1 text-xs text-indigo-600 font-bold mb-2 cursor-pointer hover:text-indigo-800 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to submissions</span>
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200 px-2 py-1 rounded-md font-mono tracking-wider">
                          OFFICIAL REF: {activeComplaint.referenceNo}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                          Cryptographic Timestamp: {activeComplaint.timestamp}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Priority indicator */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          activeComplaint.priority === 'high'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {activeComplaint.priority} priority
                        </span>
                        
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase border ${
                          activeComplaint.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : activeComplaint.status === 'investigating'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : activeComplaint.status === 'declined'
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                        }`}>
                          Status: {activeComplaint.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                      {activeComplaint.subject}
                    </h2>
                  </div>

                  {/* Grievance Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Recipient Authority</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-1">
                        <Building size={14} className="text-emerald-700 shrink-0" />
                        <span>{activeComplaint.recipient}</span>
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Department / Category</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {activeComplaint.category}
                      </p>
                    </div>
                  </div>

                  {/* Complaint Description Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">CITIZEN GRIEVANCE STATEMENT</h3>
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed border border-white/5 relative overflow-hidden select-none">
                      {/* Terminal prompt symbol */}
                      <span className="text-emerald-400 font-bold mr-1.5">$</span>
                      <span>{activeComplaint.description}</span>

                      {/* Cryptographic hash visual representation */}
                      <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-slate-500 flex justify-between items-center select-none font-mono">
                        <span>SHA256: d83f7a...19e048a2</span>
                        <span className="text-emerald-500/80 font-bold">E2EE PAYLOAD SIGNED</span>
                      </div>
                    </div>
                  </div>

                  {/* Attached Evidence file with TN Government Logo / Seal */}
                  {activeComplaint.attachment && (
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">ATTACHED EVIDENCE / FILES</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 font-bold shrink-0">
                            <FileCheck size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 font-mono truncate max-w-[200px] sm:max-w-xs">{activeComplaint.attachment.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{activeComplaint.attachment.size} • {activeComplaint.attachment.type.toUpperCase()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Real TN Government Logo Seal Badge on verified attachment */}
                          <div className="flex items-center gap-1.5 bg-emerald-900/5 border border-emerald-900/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-800 font-bold">
                            <div className="w-4 h-4 rounded-full bg-white border border-amber-400 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                              <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/8/81/Emblem_of_Tamil_Nadu.svg" 
                                alt="TN Logo" 
                                className="w-3 h-3 object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span>VERIFIED BY TN GOVT</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => triggerToast(`Downloading secure sandboxed file: ${activeComplaint.attachment?.name}`)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] font-mono rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CITIZEN ANONYMITY INFORMATION CARD */}
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200/50 rounded-xl flex items-center gap-3">
                    <EyeOff className="text-indigo-600 shrink-0" size={18} />
                    <div className="text-[10px] text-indigo-900 leading-relaxed font-mono">
                      <p className="font-bold uppercase tracking-wider">🔒 Citizen Identity Cloaked</p>
                      <p className="text-slate-500 mt-0.5">
                        Citizen ID: <span className="font-bold text-slate-700">{activeComplaint.citizenId}</span> | 
                        Masked Contact: <span className="font-bold text-slate-700">{activeComplaint.citizenPhone}</span>.
                        The database prevents any third party or general authority from viewing real phone numbers or direct contact files to enforce E2EE state regulations.
                      </p>
                    </div>
                  </div>

                  {/* GOVERNMENT RESPONSE / ACTION TAKEN SECTION */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      <span>Official Action Taken Report & Response</span>
                    </h3>

                    {activeComplaint.officialReply ? (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-start text-[10px] font-mono border-b border-emerald-500/10 pb-2">
                          <div>
                            <span className="font-bold text-emerald-800 uppercase tracking-wider">REPLY AUTHORITY: </span>
                            <span className="text-slate-700 font-bold">{activeComplaint.replyBy}</span>
                          </div>
                          <span className="text-slate-400">{activeComplaint.replyTimestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans italic">
                          "{activeComplaint.officialReply}"
                        </p>
                        <div className="pt-1.5 flex items-center gap-1 text-[9px] text-emerald-700 font-mono font-bold">
                          <Check size={12} />
                          <span>TN Secretariat Seal Verified</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center text-slate-400 text-xs py-6">
                        <Clock size={20} className="mx-auto text-slate-300 mb-2 animate-spin-slow" />
                        <span>No official reply has been submitted yet for this grievance.</span>
                      </div>
                    )}
                  </div>

                  {/* TN GOVERNOR/ADMIN POWER OF ACTION BOX */}
                  {role === 'admin' && (
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 mt-6 select-none">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                        <Shield className="text-amber-500" size={16} />
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Governor's Action Console
                        </h4>
                      </div>

                      <form onSubmit={handleAdminReply} className="space-y-3.5">
                        
                        {/* Status Change Selector */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Update Status</label>
                            <select
                              value={adminStatusChange}
                              onChange={(e: any) => setAdminStatusChange(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-bold"
                            >
                              <option value="pending">Pending Review</option>
                              <option value="investigating">In Investigation</option>
                              <option value="resolved">Resolved (Action Taken)</option>
                              <option value="declined">Declined / Closed</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signing Authority</label>
                            <input
                              type="text"
                              disabled
                              value="Hon'ble Governor's Secretariat Office"
                              className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-500 outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Action Description Response */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Response / Action Taken Statement</label>
                          <textarea
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            rows={3}
                            placeholder="Write the official response, repair actions dispatched, or department routing instructions here..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-sans"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer uppercase font-mono tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <Send size={13} />
                          <span>Dispatch Official Government Response</span>
                        </button>

                      </form>
                    </div>
                  )}

                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 mb-4 shadow-inner">
                <FileText size={28} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Official Grievance Redressal Panel</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                {role === 'admin' 
                  ? 'Select any citizen complaint from the left sidebar to investigate, update status, and issue official redress replies.'
                  : 'Welcome to the TN Secure Portal. Select any of your existing complaints from the list, or click "Report Issue" to register a new encrypted grievance.'}
              </p>

              {role === 'citizen' && complaints.length > 0 && (
                <div className="mt-8 flex items-center gap-2 text-[10px] text-emerald-700 font-mono bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10 shadow-xs">
                  <CheckSquare size={12} strokeWidth={2.5} />
                  <span>You have {complaints.length} active encrypted grievance entries in the sandbox.</span>
                </div>
              )}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* 🧾 NEW COMPLAINT REGISTRATION OVERLAY / MODAL ("REPORT ISSUE") */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-slate-800 select-none max-h-[90vh]"
              id="report-issue-modal-dialog"
            >
              
              {/* Modal Header */}
              <div className="bg-emerald-900 text-white px-5 py-4 border-b border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="text-amber-400" size={18} />
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase font-mono">மனு தாக்கல் • File Grievance Packet</h3>
                    <p className="text-[10px] text-slate-300">End-to-End Cryptographic Citizen Uplink</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="p-1 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body with submittal stages indicator */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {submittingState !== 'idle' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    
                    {submittingState !== 'done' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          className="text-emerald-700"
                        >
                          <RefreshCw size={44} />
                        </motion.div>
                        <div className="space-y-1.5">
                          <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800">
                            {submittingState === 'encrypting' && 'AES-256 ENCRYPTING COMPLAINT...'}
                            {submittingState === 'verifying' && 'D-SECURE KEY CITIZEN SIGNING...'}
                            {submittingState === 'routing' && 'ESTABLISHING SECURE GATEWAY TUNNEL...'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono max-w-xs mx-auto">
                            {submittingState === 'encrypting' && 'Obfuscating citizen text, stripping clear telemetry records...'}
                            {submittingState === 'verifying' && 'Assigning anonymous fingerprint block payload...'}
                            {submittingState === 'routing' && 'Connecting with state nodes at Secretariat Chennai...'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-600"
                        >
                          <CheckCircle2 size={36} />
                        </motion.div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">SECURED GRIEVANCE COMMITTED!</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            The complaint packet was sealed and routed successfully.
                          </p>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-600 mt-2">
                            REF NO: <span className="font-bold text-emerald-800">{newlyCreatedNo}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setShowReportModal(false);
                              setSubmittingState('idle');
                            }}
                            className="mt-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono rounded-xl cursor-pointer uppercase tracking-wider"
                          >
                            Close & View Logs
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                ) : (
                  <form onSubmit={handleCreateComplaint} className="space-y-4">
                    
                    {/* Recipient Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        Select Recipient Authority (மனு பெறுபவர்)
                      </label>
                      <div className="relative">
                        <select
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 outline-none focus:border-emerald-600 cursor-pointer appearance-none"
                        >
                          {AUTHORITIES.map(auth => (
                            <option key={auth.id} value={auth.name}>
                              {auth.name} ({auth.title})
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Category & Priority Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          Grievance Category (துறை)
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 outline-none focus:border-emerald-600 cursor-pointer appearance-none"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.label}>
                                {cat.label} ({cat.tamil})
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          Urgency Level (முன்னுரிமை)
                        </label>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                          {['low', 'medium', 'high'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p as any)}
                              className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                                priority === p
                                  ? p === 'high'
                                    ? 'bg-red-600 text-white'
                                    : p === 'medium'
                                      ? 'bg-amber-500 text-slate-950'
                                      : 'bg-slate-600 text-white'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Grievance Subject */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        Subject (குறையின் தலைப்பு)
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="E.g., Contaminated water supply in ward 14"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                        maxLength={80}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        Detailed Description (குறையின் விவரம்)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        placeholder="Please write the full grievance details. Be accurate with location points or street names for speedier dispatch..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>

                    {/* Secure File Attachment Upload Drag & Drop */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        Evidence / Supporting Document (ஆவணங்கள் - Optional)
                      </label>
                      
                      {!uploadedFile ? (
                        <div 
                          className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/10 transition-all duration-200 group relative"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                              setUploadedFile({
                                name: file.name,
                                size: `${sizeMB} MB`,
                                type: file.type || 'unknown'
                              });
                            }
                          }}
                        >
                          <input 
                            type="file" 
                            id="citizen-file-upload" 
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <label htmlFor="citizen-file-upload" className="cursor-pointer block w-full h-full">
                            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-colors">
                                <Plus size={16} />
                              </div>
                              <p className="text-[11px] font-bold text-slate-700">Drag & drop files here, or <span className="text-emerald-600">browse</span></p>
                              <p className="text-[9px] text-slate-400 font-mono">PDF, PNG, JPG, DOC (Max 10MB)</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                              <FileCheck size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 font-mono truncate">{uploadedFile.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{uploadedFile.size} • {uploadedFile.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="w-7 h-7 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Safe Sandbox Warning Card */}
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200/40 text-[9.5px] text-indigo-900 leading-relaxed font-mono">
                      <span className="font-bold">NOTICE: </span>
                      Submitting this form commits state parameters to the sandbox E2EE storage array. This simulates live API gateway routing with state secretariats. No actual identity files are transmitted outside this container.
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReportModal(false)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer uppercase font-mono text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer uppercase font-mono tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Send size={12} />
                        <span>Submit Grievance Packet</span>
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN LEVEL TOAST NOTIFICATIONS */}
      <AnimatePresence>
        {adminToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-6 right-6 bg-slate-900/95 border border-amber-500/30 text-white py-3 px-5 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-mono backdrop-blur-md"
            id="admin-toast-message"
          >
            <Shield className="text-amber-400 shrink-0" size={16} />
            <div>
              <p className="font-bold text-amber-300">SECURITY PROTOCOL VERIFIED</p>
              <p className="text-slate-300 text-[10px] mt-0.5">{adminToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
