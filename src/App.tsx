import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message, SystemNotification, StatusUpdate, ChatThemeName, Advocate, CaseContext } from './types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, SIMULATED_RESPONSES } from './utils/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SimulatorControl from './components/SimulatorControl';
import NotificationToast from './components/NotificationToast';
import TNGrievancePortal from './components/TNGrievancePortal';
import LegalBridge from './components/LegalBridge';
import LoginScreen from './components/LoginScreen';
import { playNotificationSound } from './utils/audio';
import { 
  VolumeX, 
  Volume2,
  HelpCircle, 
  Info, 
  Bell, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  Lock,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  AlertTriangle,
  MapPin,
  Activity,
  FileText,
  Wifi,
  AlertCircle,
  ShieldAlert,
  Archive,
  Trash2,
  EyeOff,
  Play,
  Send,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_CONTACTS_KEY = 'quiet_app_contacts';
const LOCAL_STORAGE_MESSAGES_KEY = 'quiet_app_messages';

export default function App() {
  // Load initial states from LocalStorage or mock defaults using our custom hook
  const [contacts, setContacts] = useLocalStorage<Contact[]>(LOCAL_STORAGE_CONTACTS_KEY, INITIAL_CONTACTS);

  const [messages, setMessages] = useLocalStorage<Message[]>(LOCAL_STORAGE_MESSAGES_KEY, INITIAL_MESSAGES);

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<'messenger' | 'simulator' | 'grievance' | 'legal'>('messenger');
  const [activeFolder, setActiveFolder] = useState<'normal' | 'quiet' | 'archive' | 'spam'>('normal');
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(8); // every 8s
  const [toast, setToast] = useState<{ id: string; contactName: string; text: string; avatarColor: string } | null>(null);

  // User Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('quiet_app_authenticated') === 'true';
  });
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(() => {
    const saved = localStorage.getItem('quiet_app_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (loggedInUser: { name: string; email: string; avatarUrl?: string }) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem('quiet_app_authenticated', 'true');
    localStorage.setItem('quiet_app_user', JSON.stringify(loggedInUser));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem('quiet_app_authenticated', 'false');
    localStorage.removeItem('quiet_app_user');
  };

  // Security features and Session States
  const [unlockedChatIds, setUnlockedChatIds] = useState<string[]>([]);
  const [activeVideoCall, setActiveVideoCall] = useState<Contact | null>(null);

  // SOS Protocol States
  const [sosActive, setSosActive] = useState(false);
  const [sosLogs, setSosLogs] = useState<{ text: string; type: 'info' | 'critical' | 'success'; timestamp: string }[]>([]);
  const [sosLocation, setSosLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Privacy Settings States
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('quiet_app_read_receipts_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [hideLastSeen, setHideLastSeen] = useState<boolean>(() => {
    const saved = localStorage.getItem('quiet_app_hide_last_seen');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Sync privacy settings to localStorage
  useEffect(() => {
    localStorage.setItem('quiet_app_read_receipts_enabled', JSON.stringify(readReceiptsEnabled));
  }, [readReceiptsEnabled]);

  useEffect(() => {
    localStorage.setItem('quiet_app_hide_last_seen', JSON.stringify(hideLastSeen));
  }, [hideLastSeen]);

  const handleToggleReadReceipts = () => {
    setReadReceiptsEnabled(prev => !prev);
  };

  const handleToggleHideLastSeen = () => {
    setHideLastSeen(prev => !prev);
  };
  
  // High-frequency spam filter tracker
  const lastMessageTimesRef = useRef<Record<string, number[]>>({});

  // Call simulation states
  const [incomingCall, setIncomingCall] = useState<Contact | null>(null);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; duration: number } | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Story / Status updates state
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>(() => {
    const saved = localStorage.getItem('quiet_app_status_updates');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'status-1',
        text: 'Chilling at the beach! 🏖️🌞',
        bgColor: 'from-pink-600 to-rose-600',
        timestamp: 'Today, 9:00 AM',
        viewers: [
          { name: 'Mom ❤️', isQuiet: false, viewedAt: 'Today, 9:15 AM' },
          { name: '🔥 CRYPTO DAILY', isQuiet: true, viewedAt: 'Today, 9:22 AM' }
        ]
      },
      {
        id: 'status-2',
        text: 'Coding some React apps today 💻☕',
        bgColor: 'from-indigo-600 to-purple-600',
        timestamp: 'Today, 10:30 AM',
        viewers: [
          { name: 'Mom ❤️', isQuiet: false, viewedAt: 'Today, 10:45 AM' },
          { name: 'Boss Man 👔', isQuiet: true, viewedAt: 'Today, 11:02 AM' }
        ]
      }
    ];
  });

  // Sync statuses to localStorage
  useEffect(() => {
    localStorage.setItem('quiet_app_status_updates', JSON.stringify(statusUpdates));
  }, [statusUpdates]);

  // References for intervals
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save states to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  // Read Receipt Suppressor and Unread Count Reset logic
  useEffect(() => {
    if (!selectedContactId) return;

    // Find the active contact
    const activeContact = contacts.find(c => c.id === selectedContactId);
    if (!activeContact) return;

    // Reset unread count for this contact
    setContacts(prev => prev.map(c => 
      c.id === selectedContactId ? { ...c, unreadCount: 0 } : c
    ));

    // Update message status to "read" ONLY if contact is NOT quieted (Allowed read receipts)
    if (!activeContact.isQuiet) {
      setMessages(prev => prev.map(m => {
        if (m.contactId === selectedContactId && m.sender === 'contact' && m.status !== 'read') {
          return { ...m, status: 'read' };
        }
        return m;
      }));
    }
  }, [selectedContactId, messages.length]); // Triggers when changing chat or when a new message arrives

  // Handle user sending a message
  const handleSendMessage = (
    text: string,
    mediaType?: 'image' | 'video' | 'file' | 'audio' | 'location' | 'payment',
    mediaUrl?: string,
    fileName?: string,
    fileSize?: string,
    duration?: number,
    paymentAmount?: number,
    paymentStatus?: 'pending' | 'success' | 'declined',
    paymentType?: 'send' | 'request' | 'receipt'
  ) => {
    if (!selectedContactId) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `m-user-${Date.now()}`,
      contactId: selectedContactId,
      sender: 'me',
      text,
      timestamp: timeString,
      status: 'sent',
      isQuietMessage: false,
      mediaType,
      mediaUrl,
      fileName,
      fileSize,
      duration,
      paymentAmount,
      paymentStatus,
      paymentType,
    };

    // Add user's message
    setMessages(prev => [...prev, newMessage]);

    // Update last message preview in contacts
    const lastText = mediaType === 'audio'
      ? `🎙️ Voice Note (${duration}s)`
      : mediaType === 'location'
        ? `📍 Location Shared: ${text}`
        : mediaType === 'payment'
          ? paymentType === 'send'
            ? `💸 Payment Sent: ₹${paymentAmount}`
            : paymentType === 'request'
              ? `📩 Payment Requested: ₹${paymentAmount}`
              : `🧾 Receipt Shared: ₹${paymentAmount}`
          : mediaType
            ? `[${mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'File'}] ${text || fileName || 'Attachment'}`
            : text;

    setContacts(prev => prev.map(c => 
      c.id === selectedContactId 
        ? { ...c, lastMessageText: lastText, lastMessageAt: 'Now' } 
        : c
    ));

    const activeContactObj = contacts.find(c => c.id === selectedContactId);
    const isAdvocateActive = activeContactObj?.role?.startsWith('Advocate') && activeContactObj?.caseStatus === 'Active Legal Representation';

    if (isAdvocateActive) {
      // Fast delivered checkmark
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ));
      }, 500);

      // Fast read receipt
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        ));
      }, 1500);
    } else {
      // Simulate "Delivered" checkmark after 4500ms
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ));
      }, 4500); // 4.5 seconds to simulate network delivery delay
    }

    // Simulate standard response from contact after 1.5 - 3 seconds
    const responseDelay = 1500 + Math.random() * 1500;
    
    // Set status to typing first
    setTimeout(() => {
      setContacts(prev => prev.map(c => 
        c.id === selectedContactId ? { ...c, status: 'typing' } : c
      ));
    }, 600);

    setTimeout(() => {
      // Revert status to online and deliver automated message
      setContacts(prev => prev.map(c => 
        c.id === selectedContactId ? { ...c, status: 'online' } : c
      ));
      
      let contactPhrases = SIMULATED_RESPONSES[selectedContactId] || [
        "That sounds perfect!",
        "Thanks for getting back to me.",
        "Got it, talk soon!",
        "Alright, let's sync up later."
      ];
      
      if (isAdvocateActive) {
        contactPhrases = [
          "I have reviewed the case details. Please upload any relevant documents or legal notices.",
          "Under Indian law, we have strong grounds here. I will draft the initial application.",
          "We should secure a temporary injunction. Let's proceed with preparing the petition.",
          "I am on it. Rest assured, your data is completely confidential on this privileged bridge.",
          "I will review the registry files at the Madras High Court and update you shortly."
        ];
      }
      
      const randomPhrase = contactPhrases[Math.floor(Math.random() * contactPhrases.length)];
      receiveMessage(selectedContactId, randomPhrase);
    }, responseDelay);
  };

  // Logic to process a newly received message (either auto-generated or manual simulation)
  const receiveMessage = (contactId: string, text: string, mediaType?: 'image' | 'video', mediaUrl?: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Block Check: Silently discard everything if contact is blocked
    if (contact.isBlocked) {
      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text: `🚫 BLOCKED MESSAGE: Incoming communication from blocked contact '${contact.name}' suppressed entirely.`,
        timestamp: timeString,
        type: 'suppressed'
      };
      setNotifications(prev => [logEntry, ...prev]);
      return;
    }

    // 2. High Frequency Spam Check: Flag and divert if >= 4 messages in 10 seconds
    if (!contact.isSpam) {
      const now = Date.now();
      const recentTimes = (lastMessageTimesRef.current[contactId] || []).filter(t => now - t < 10000);
      recentTimes.push(now);
      lastMessageTimesRef.current[contactId] = recentTimes;

      if (recentTimes.length >= 4) { // 4th message in 10s
        // Auto-Spam flagging
        setContacts(prev => prev.map(c => 
          c.id === contactId 
            ? { ...c, isSpam: true, status: 'offline' } 
            : c
        ));

        const logEntry: SystemNotification = {
          id: `log-${Date.now()}`,
          contactName: contact.name,
          text: `🛡️ SPAM FILTER AUTO-DIVERT: Contact '${contact.name}' auto-diverted to Spam/Blocked folder due to rapid-frequency bot pattern (4 msgs/10s).`,
          timestamp: timeString,
          type: 'suppressed'
        };
        setNotifications(prev => [logEntry, ...prev]);

        setToast({
          id: `toast-${Date.now()}`,
          contactName: "🛡️ Spam Filter Action",
          text: `Diverted suspicious high-frequency contact '${contact.name}' to Spam/Blocked folder.`,
          avatarColor: "bg-rose-950 text-rose-300 border-rose-500/20"
        });

        // Mutate local variable to skip regular processing
        contact.isSpam = true;
      }
    }

    const messageId = `m-sim-${Date.now()}`;
    const isQuietNow = contact.isQuiet;
    const isSpamNow = contact.isSpam;

    const newIncomingMessage: Message = {
      id: messageId,
      contactId,
      sender: 'contact',
      text,
      timestamp: timeString,
      // If contact is quieted or marked as spam, we NEVER trigger 'read'. It stays 'delivered'.
      status: (contactId === selectedContactId && !isQuietNow && !isSpamNow) ? 'read' : 'delivered',
      isQuietMessage: isQuietNow || isSpamNow, // Tagged to block read receipts permanently
      mediaType,
      mediaUrl
    };

    // Save message
    setMessages(prev => [...prev, newIncomingMessage]);

    // Update last message preview in sidebar
    setContacts(prev => prev.map(c => 
      c.id === contactId 
        ? { 
            ...c, 
            lastMessageText: text, 
            lastMessageAt: timeString,
            unreadCount: (contactId === selectedContactId) ? 0 : c.unreadCount + 1
          } 
        : c
    ));

    // Handle Notifications & Sound based on Mute state
    if (isQuietNow || isSpamNow) {
      // 🤫 SILENT INTENTION: Block all ringtones, badges and push notifications!
      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text: isSpamNow 
          ? `[🛡️ Spam Suppressed] ${text}`
          : mediaType 
            ? `[🤫 Silent ${mediaType}] ${text}` 
            : text,
        timestamp: timeString,
        type: 'suppressed'
      };
      setNotifications(prev => [logEntry, ...prev]);
    } else {
      // 🔊 ACTIVE INTENTION: Play chime sound, dispatch OS-style toast!
      playNotificationSound();
      
      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text,
        timestamp: timeString,
        type: 'allowed'
      };
      setNotifications(prev => [logEntry, ...prev]);

      // Trigger floating system-style banner (only if user is not actively focused on this chat)
      if (contactId !== selectedContactId) {
        setToast({
          id: `toast-${Date.now()}`,
          contactName: contact.name,
          text,
          avatarColor: contact.avatarColor
        });
      }
    }
  };

  // Handle updating payment status
  const handleUpdateMessageStatus = (
    messageId: string, 
    status: 'pending' | 'success' | 'declined',
    extra?: Partial<Message>
  ) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, paymentStatus: status, ...(extra || {}) } 
        : m
    ));
  };

  // Toggle Contact's Quiet mode
  const handleToggleQuiet = (id: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        const nextQuietState = !c.isQuiet;
        
        // Log the change
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const logEntry: SystemNotification = {
          id: `log-${Date.now()}`,
          contactName: c.name,
          text: nextQuietState 
            ? "Muted to Quiet Folder. Sound blocked, read receipts disabled." 
            : "Restored to Primary Inbox. Notifications active.",
          timestamp: timeString,
          type: nextQuietState ? 'suppressed' : 'allowed'
        };
        setNotifications(prev => [logEntry, ...prev]);

        // If the contact was quieted, and we are currently viewing them, reset folder selection to avoid confusion
        if (selectedContactId === id) {
          // If moving to quiet, switch folder to Quiet to keep viewing, or vice versa
          setActiveFolder(nextQuietState ? 'quiet' : 'normal');
        }

        return { ...c, isQuiet: nextQuietState };
      }
      return c;
    }));
  };

  // Toggle Block mode
  const handleToggleBlock = (id: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        const nextBlockState = !c.isBlocked;
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const logEntry: SystemNotification = {
          id: `log-${Date.now()}`,
          contactName: c.name,
          text: nextBlockState 
            ? `🚫 BLOCKED: Fully blocked and blacklisted '${c.name}'. Discarding all future packets.` 
            : `✅ UNBLOCKED: Communications from '${c.name}' restored.`,
          timestamp: timeString,
          type: nextBlockState ? 'suppressed' : 'allowed'
        };
        setNotifications(prev => [logEntry, ...prev]);

        // If blocking, deselect the contact
        if (nextBlockState && selectedContactId === id) {
          setSelectedContactId(null);
        }

        return { ...c, isBlocked: nextBlockState, unreadCount: 0 };
      }
      return c;
    }));
  };

  // Toggle Archive mode
  const handleToggleArchive = (id: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        const nextArchiveState = !c.isArchived;
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const logEntry: SystemNotification = {
          id: `log-${Date.now()}`,
          contactName: c.name,
          text: nextArchiveState 
            ? `📁 ARCHIVED: Moved conversation with '${c.name}' to Archive folder.` 
            : `📥 UNARCHIVED: Restored conversation with '${c.name}' to primary inbox.`,
          timestamp: timeString,
          type: 'allowed'
        };
        setNotifications(prev => [logEntry, ...prev]);

        // Switch active tab view if archiving active chat
        if (nextArchiveState && selectedContactId === id) {
          setActiveFolder('archive');
        } else if (!nextArchiveState && selectedContactId === id) {
          setActiveFolder('normal');
        }

        return { ...c, isArchived: nextArchiveState };
      }
      return c;
    }));
  };

  // Toggle Lock mode (Secure chats with PIN passcode)
  const handleToggleLock = (id: string, pinCode?: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        const nextLockState = !c.isLocked;
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const logEntry: SystemNotification = {
          id: `log-${Date.now()}`,
          contactName: c.name,
          text: nextLockState 
            ? `🔒 LOCKED: Chat secured using passcode '${pinCode || "1234"}'. Locked state activated.` 
            : "🔓 UNLOCKED: Chat unlocked. Security restrictions revoked.",
          timestamp: timeString,
          type: 'allowed'
        };
        setNotifications(prev => [logEntry, ...prev]);

        // Clear lock session list for this chat
        if (nextLockState) {
          setUnlockedChatIds(prev => prev.filter(item => item !== id));
        }

        return { 
          ...c, 
          isLocked: nextLockState,
          pinCode: nextLockState ? pinCode || '1234' : undefined
        };
      }
      return c;
    }));
  };

  // Unlock contact chat
  const handleUnlockContact = (id: string) => {
    if (!unlockedChatIds.includes(id)) {
      setUnlockedChatIds(prev => [...prev, id]);
    }
  };

  // Set chat theme
  const handleSetChatTheme = (id: string, theme: ChatThemeName) => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, chatTheme: theme };
      }
      return c;
    }));
  };

  // Establish secure, identity-masked legal bridge connection
  const handleRequestLegalAid = (advocate: Advocate, caseContext?: CaseContext) => {
    const contactExists = contacts.some(c => c.id === advocate.contactId);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!contactExists) {
      const newContact: Contact = {
        id: advocate.contactId,
        name: advocate.name,
        role: `Advocate (${advocate.specialization})`,
        avatarColor: advocate.specialization === 'Criminal' ? 'bg-rose-600 text-white' : advocate.specialization === 'Property' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white',
        isQuiet: false,
        status: advocate.current_availability === 'Available' ? 'online' : 'offline',
        lastMessageText: caseContext ? `🔒 Brief: ${caseContext.section}` : "🔒 Secure masked connection request sent.",
        lastMessageAt: timeString,
        unreadCount: 0,
        chatTheme: advocate.specialization === 'Criminal' ? 'crimson' : advocate.specialization === 'Property' ? 'emerald' : 'ocean',
        caseStatus: 'Pending'
      };
      setContacts(prev => [newContact, ...prev]);
    } else {
      setContacts(prev => {
        const index = prev.findIndex(c => c.id === advocate.contactId);
        if (index > -1) {
          const updated = [...prev];
          const [item] = updated.splice(index, 1);
          const refreshedItem = {
            ...item,
            role: `Advocate (${advocate.specialization})`,
            status: advocate.current_availability === 'Available' ? ('online' as const) : ('offline' as const),
            caseStatus: 'Pending' as const
          };
          updated.unshift(refreshedItem);
          return updated;
        }
        return prev;
      });
    }

    const secureId = `CTZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const systemMsgId = `sys-aid-${Date.now()}`;
    
    // Build custom secure message text containing the dynamic CaseContext details
    const caseContextDetails = caseContext
      ? `\n\n💼 CONFIDENTIAL CASE BREVITY PARAMETERS:\n  • Category: ${caseContext.category} Law\n  • Primary Issue: ${caseContext.section}\n  • Definition: ${caseContext.sectionDescription}\n  • Brief Statement: "${caseContext.summary}"`
      : "";

    const systemMsg: Message = {
      id: systemMsgId,
      contactId: advocate.contactId,
      sender: 'contact',
      text: `🔒 SECURE MASKED BRIDGE ESTABLISHED.\n\nCitizen Identity Cloaked:\n- Anonymized ID: ${secureId}\n- Masked Phone: +91 ••••• ••829\n- Legal Privilege Active (Sec. 126 Evidence Act).${caseContextDetails}\n\nGreetings! I am ${advocate.name}, your verified ${advocate.specialization} Law Counsel. I have received your dynamic case brief. How can I assist you on this secure portal?`,
      timestamp: timeString,
      status: 'read',
      isQuietMessage: false
    };

    setMessages(prev => [...prev, systemMsg]);
    setSelectedContactId(advocate.contactId);
    setActivePage('messenger');
    setActiveFolder('normal');

    const logBriefText = caseContext ? ` [Case brief: ${caseContext.section}]` : "";
    const logEntry: SystemNotification = {
      id: `log-${Date.now()}`,
      contactName: advocate.name,
      text: `🔒 LEGAL BRIDGE ENGAGED: Masked, zero-trust cryptographic proxy session opened with ${advocate.name} (${advocate.specialization} Law).${logBriefText} Phone cloaked successfully.`,
      timestamp: timeString,
      type: 'allowed'
    };
    setNotifications(prev => [logEntry, ...prev]);

    setToast({
      id: `toast-legal-${Date.now()}`,
      contactName: "🔒 Masked Intercom",
      text: `Connected to ${advocate.name}. Citizen ID is securely masked.`,
      avatarColor: advocate.specialization === 'Criminal' ? "bg-rose-600 text-white border-rose-500/20" : advocate.specialization === 'Property' ? "bg-emerald-600 text-white border-emerald-500/20" : "bg-indigo-600 text-white border-indigo-500/20"
    });
  };

  // Accept the case (Simulation trigger from Advocate side)
  const handleAcceptCase = (contactId: string) => {
    // 1. Update contact caseStatus and status
    setContacts(prev => prev.map(c => 
      c.id === contactId 
        ? { ...c, caseStatus: 'Active Legal Representation', status: 'online', lastMessageText: '⚖️ Case Accepted', lastMessageAt: 'Now' }
        : c
    ));

    // 2. Add automated message from the advocate
    const activeContact = contacts.find(c => c.id === contactId);
    const advocateName = activeContact ? activeContact.name : 'your Advocate';
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const acceptMsg: Message = {
      id: `m-accept-${Date.now()}`,
      contactId,
      sender: 'contact',
      text: `Advocate ${advocateName} has accepted your case. I am ready to assist you. Let's proceed.`,
      timestamp: timeString,
      status: 'read',
      isQuietMessage: false
    };
    setMessages(prev => [...prev, acceptMsg]);

    // 3. Log a secure notification
    const logEntry: SystemNotification = {
      id: `log-accept-${Date.now()}`,
      contactName: advocateName,
      text: `⚖️ CASE ACCEPTED: ${advocateName} has transitioned this masked channel to Active Legal Representation under full attorney-client privilege.`,
      timestamp: timeString,
      type: 'allowed'
    };
    setNotifications(prev => [logEntry, ...prev]);

    setToast({
      id: `toast-accept-${Date.now()}`,
      contactName: "⚖️ Legal Representation",
      text: `${advocateName} has accepted your case!`,
      avatarColor: "bg-amber-600 text-slate-950 font-bold"
    });
  };

  // Trigger Video Call simulation
  const handleTriggerVideoCall = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logEntry: SystemNotification = {
      id: `log-${Date.now()}`,
      contactName: contact.name,
      text: `📹 OUTGOING VIDEO CALL: Connected via secure, military-grade end-to-end encrypted channel.`,
      timestamp: timeString,
      type: 'allowed'
    };
    setNotifications(prev => [logEntry, ...prev]);
    setActiveVideoCall(contact);
  };

  // Trigger SOS Protocol (GPS simulation, auto SMS log, stealth background recorder)
  const handleTriggerSOS = () => {
    if (sosActive) return; // Prevent double trigger
    
    setSosActive(true);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate GPS coordinates (San Francisco tech hub / Golden Gate Park coordinates)
    const mockLat = 37.76942 + (Math.random() - 0.5) * 0.002;
    const mockLng = -122.48621 + (Math.random() - 0.5) * 0.002;
    setSosLocation({ latitude: mockLat, longitude: mockLng });

    const newLogs = [
      {
        text: `🚨 SOS DISTRESS BEACON ACTIVE: personal security perimeter established.`,
        type: 'critical' as const,
        timestamp: timeString
      },
      {
        text: `🛰️ GPS POSITION ACQUIRED: Lat ${mockLat.toFixed(5)}, Lng ${mockLng.toFixed(5)}. Syncing emergency nodes...`,
        type: 'info' as const,
        timestamp: timeString
      },
      {
        text: `📲 DISTRESS SMS BROADCASTED: "EMERGENCY! I am under immediate threat at: http://maps.google.com/?q=${mockLat},${mockLng}. Access audio feed & dispatch rescue." sent to designated contacts.`,
        type: 'success' as const,
        timestamp: timeString
      },
      {
        text: `🚓 POLICE NODE ENGAGED: Automated GPS coordinate payload sent to regional emergency center dispatch SF-911-E.`,
        type: 'success' as const,
        timestamp: timeString
      },
      {
        text: `🎙️ STEALTH AMBIENT RECORDER DEPLOYED: Stealth environment ambient recorder activated in background. Saving encrypted audio logs to secure vault.`,
        type: 'info' as const,
        timestamp: timeString
      }
    ];

    setSosLogs(newLogs);

    // Also inject into general system notifications list so user can see it in logs!
    setNotifications(prev => [
      {
        id: `sos-distress-${Date.now()}`,
        contactName: "🚨 SOS EMERGENCY PROTOCOL",
        text: `DISTRESS TRIGGERED: Broad-casted coordinates (${mockLat.toFixed(4)}, ${mockLng.toFixed(4)}) to First Responders. Ambient recording live.`,
        timestamp: timeString,
        type: 'allowed'
      },
      ...prev
    ]);

    setToast({
      id: `toast-sos-${Date.now()}`,
      contactName: "🚨 DISASTER DISTRESS PROTOCOL",
      text: "SOS distress broadcast completed successfully. Emergency dispatchers notified.",
      avatarColor: "bg-rose-600 text-white font-semibold"
    });
  };

  // Deactivate SOS protocol
  const handleDeactivateSOS = () => {
    setSosActive(false);
    setSosLocation(null);
    setSosLogs([]);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      {
        id: `sos-deact-${Date.now()}`,
        contactName: "🚨 SYSTEM SOS PROTOCOL",
        text: `Distress beacon deactivated. Standing down security teams. Ambient recorders offline.`,
        timestamp: timeString,
        type: 'allowed'
      },
      ...prev
    ]);
  };

  // Add custom contact
  const handleAddContact = (name: string, role: string) => {
    const id = `custom-${Date.now()}`;
    const avatarColors = [
      'bg-indigo-500 text-white',
      'bg-purple-500 text-white',
      'bg-pink-500 text-white',
      'bg-orange-500 text-white',
      'bg-cyan-500 text-white',
      'bg-teal-500 text-white'
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newContact: Contact = {
      id,
      name,
      role,
      avatarColor: randomColor,
      isQuiet: false, // Default normal inbox
      status: 'online',
      lastMessageText: 'No messages yet',
      lastMessageAt: 'Now',
      unreadCount: 0,
    };

    setContacts(prev => [...prev, newContact]);
    setSelectedContactId(id);
    setActiveFolder('normal');
  };

  // Handle user posting a status update and simulate other contacts viewing it
  const handlePostStatus = (text: string, bgColor: string) => {
    const timeString = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newStatus: StatusUpdate = {
      id: `status-${Date.now()}`,
      text,
      bgColor,
      timestamp: timeString,
      viewers: []
    };

    setStatusUpdates(prev => [newStatus, ...prev]);

    // Simulate viewers viewing this status update after a small delay (staggered)
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        setStatusUpdates(currentStatuses => {
          return currentStatuses.map(s => {
            if (s.id !== newStatus.id) return s;
            if (s.viewers.some(v => v.name === contact.name)) return s;

            const viewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...s,
              viewers: [
                ...s.viewers,
                {
                  name: contact.name,
                  isQuiet: contact.isQuiet,
                  viewedAt: `Today, ${viewTime}`
                }
              ]
            };
          });
        });
      }, 2000 + (index * 1500) + Math.random() * 2000);
    });
  };

  // Clear system simulator logs
  const handleClearLogs = () => {
    setNotifications([]);
  };

  // Trigger a Spam Bot attack to test security filters
  const handleTriggerSpamAttack = () => {
    const targetContactId = 'spam_crypto';
    // Make sure contact is active and in normal view to demonstrate the diversion
    setContacts(prev => prev.map(c => 
      c.id === targetContactId 
        ? { ...c, isQuiet: false, isSpam: false, isBlocked: false, status: 'online' } 
        : c
    ));

    const spamTexts = [
      "🚨 URGENT NOTICE: Your secure wallet connection has been severed!",
      "💸 LIQUIDITY ALERT: Claim 5,000 $USDT rewards within 60 seconds!",
      "🔗 CONNECT NODE: Validate your mnemonic seed phrase instantly at fake-wallet-safety.org",
      "⚠️ SYSTEM WARNING: High frequency protocol mismatch! Tap to bypass security grids!"
    ];

    // Dispatch messages rapidly
    spamTexts.forEach((text, index) => {
      setTimeout(() => {
        receiveMessage(targetContactId, text);
      }, index * 400); // 400ms interval (4 messages in 1.6 seconds - triggers spam filter instantly!)
    });
  };

  // Trigger a Spam Call simulation to test security filters
  const handleTriggerSpamCall = () => {
    const targetContactId = 'spam_crypto';
    // Ensure target is flagged as spam so the automatic call-filtering logic is highlighted
    setContacts(prev => prev.map(c => 
      c.id === targetContactId 
        ? { ...c, isSpam: true, status: 'offline' } 
        : c
    ));

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Log the suppressed call directly to the notification logs with a warning message
    const logEntry: SystemNotification = {
      id: `log-${Date.now()}`,
      contactName: '🔥 CRYPTO DAILY',
      text: `🚨 [SPAM CALL BLOCKED] Suppressed incoming voice call from verified spam/bot source. Security protocol automatically deflected call to voicemail.`,
      timestamp: timeString,
      type: 'suppressed'
    };
    setNotifications(prev => [logEntry, ...prev]);

    setToast({
      id: `toast-spam-call-${Date.now()}`,
      contactName: "🛡️ Spam Call Suppressed",
      text: `Blocked suspicious incoming call from '🔥 CRYPTO DAILY'.`,
      avatarColor: "bg-rose-950 text-rose-300 border-rose-500/20"
    });
  };

  // Trigger manual simulation text or media
  const handleSimulateIncoming = (contactId: string, customText?: string, mediaType?: 'image' | 'video', mediaUrl?: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    let textToSend = '';
    if (customText) {
      textToSend = customText;
    } else {
      if (mediaType === 'image') {
        textToSend = "📷 Sent an image attachment";
      } else if (mediaType === 'video') {
        textToSend = "🎥 Sent a video attachment";
      } else {
        const phrases = SIMULATED_RESPONSES[contactId] || [
          "Hey! Just checking in.",
          "Did you see this update?",
          "Are you around to talk?"
        ];
        textToSend = phrases[Math.floor(Math.random() * phrases.length)];
      }
    }

    receiveMessage(contactId, textToSend, mediaType, mediaUrl);
  };

  // Call features simulation: auto-rejection for Quiet, ringing overlay for Loud
  const handleSimulateCall = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (contact.isBlocked || contact.isSpam) {
      // Suppressed call logs for blocked/spam contacts
      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text: `📞 BLOCKED CALL AUTO-REJECT: Incoming phone call from blocked/spam contact '${contact.name}' silently dropped.`,
        timestamp: timeString,
        type: 'suppressed'
      };
      setNotifications(prev => [logEntry, ...prev]);
      return;
    }

    if (contact.isQuiet) {
      // 🤫 SILENT REJECTION LOGIC: Call notifications disabled, silently auto-rejected to voicemail logs
      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text: `📞 SILENT AUTO-REJECT: Incoming phone call from quieted contact auto-diverted directly to voicemail logs. No ringing, no intrusive visual/audio interruption.`,
        timestamp: timeString,
        type: 'suppressed'
      };
      setNotifications(prev => [logEntry, ...prev]);
    } else {
      // 🔊 ACTIVE RINGING LOGIC: Play chime, trigger full-screen ringing UI
      playNotificationSound();
      setIncomingCall(contact);

      const logEntry: SystemNotification = {
        id: `log-${Date.now()}`,
        contactName: contact.name,
        text: `📞 RINGING: Incoming phone call ringing from active contact '${contact.name}'...`,
        timestamp: timeString,
        type: 'allowed'
      };
      setNotifications(prev => [logEntry, ...prev]);
    }
  };

  const handleAcceptCall = () => {
    if (!incomingCall) return;
    setActiveCall({ contact: incomingCall, duration: 0 });
    setIncomingCall(null);
  };

  const handleDeclineCall = () => {
    if (!incomingCall) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logEntry: SystemNotification = {
      id: `log-${Date.now()}`,
      contactName: incomingCall.name,
      text: `📞 DECLINED: Call from '${incomingCall.name}' was declined.`,
      timestamp: timeString,
      type: 'allowed'
    };
    setNotifications(prev => [logEntry, ...prev]);
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    if (!activeCall) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logEntry: SystemNotification = {
      id: `log-${Date.now()}`,
      contactName: activeCall.contact.name,
      text: `📞 DISCONNECTED: Active call with '${activeCall.contact.name}' ended. Duration: ${activeCall.duration} seconds.`,
      timestamp: timeString,
      type: 'allowed'
    };
    setNotifications(prev => [logEntry, ...prev]);
    setActiveCall(null);
  };

  // Timer interval for active calls
  useEffect(() => {
    if (activeCall) {
      callTimerRef.current = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          return { ...prev, duration: prev.duration + 1 };
        });
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeCall]);

  // Background Auto-Simulation loop
  useEffect(() => {
    if (isAutoSimulating) {
      simTimerRef.current = setInterval(() => {
        // Pick a random contact
        const randomIndex = Math.floor(Math.random() * contacts.length);
        const contact = contacts[randomIndex];
        if (contact) {
          const phrases = SIMULATED_RESPONSES[contact.id] || [
            "Are you there?",
            "Look at this!",
            "Call me when you can.",
            "Can you double check this?"
          ];
          const randomText = phrases[Math.floor(Math.random() * phrases.length)];
          
          // Show visual "typing" indicator on selected contact before they send a text
          setContacts(prev => prev.map(c => 
            c.id === contact.id ? { ...c, status: 'typing' } : c
          ));

          setTimeout(() => {
            // Revert status to original
            setContacts(prev => prev.map(c => 
              c.id === contact.id ? { ...c, status: 'online' } : c
            ));
            receiveMessage(contact.id, randomText);
          }, 1500); // Wait 1.5s typing simulation
        }
      }, simulationInterval * 1000);
    } else {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
    }

    return () => {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
    };
  }, [isAutoSimulating, simulationInterval, contacts]);

  const activeContact = contacts.find(c => c.id === selectedContactId) || null;

  return (
    <div 
      className="flex items-center justify-center min-h-screen font-sans p-0 md:p-6 text-slate-100 relative overflow-x-hidden" 
      id="app-root"
      style={{
        background: 'radial-gradient(circle at top left, #4f46e5, transparent), radial-gradient(circle at bottom right, #db2777, transparent), #0f172a'
      }}
    >
      {/* OS Push Notification Card (Allowed Contacts Only) */}
      <NotificationToast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

      {/* Primary Application Frame */}
      <div className="w-full max-w-6xl h-[100dvh] md:h-[85vh] md:min-h-[600px] bg-slate-900/40 backdrop-blur-xl border border-white/15 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative" id="app-workspace">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {/* Mock App Chrome Title bar */}
              <div className="bg-white/5 text-slate-400 px-6 py-3 flex items-center justify-between border-b border-white/10 select-none" id="app-chrome-header">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/85 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/85 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/85 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 ml-4 uppercase">
                    Secure Sandbox Environment
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Logged in User info */}
                  {user && (
                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[11px] text-slate-200 font-mono shadow-inner animate-fade-in" id="user-info-header">
                      {user.avatarUrl && (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="w-4 h-4 rounded-full border border-indigo-300" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="font-semibold text-indigo-300">{user.name}</span>
                      <span className="text-slate-500">•</span>
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-black uppercase tracking-wider transition-colors cursor-pointer"
                        id="user-signout-btn"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}

                  {/* SOS Distress Trigger */}
                  <button
                    onClick={handleTriggerSOS}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 shadow-md cursor-pointer select-none ${
                      sosActive
                        ? 'bg-rose-600 text-white animate-pulse border border-rose-400 shadow-rose-600/50'
                        : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 border border-red-500 shadow-red-600/30'
                    }`}
                    id="sos-trigger-button"
                  >
                    <AlertTriangle size={13} className={sosActive ? 'animate-bounce' : ''} />
                    <span>{sosActive ? 'SOS DISTRESS ENGAGED' : 'EMERGENCY SOS'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-pink-300 font-semibold bg-pink-950/30 border border-pink-500/30 px-3 py-1 rounded-full">
                    <Lock size={12} />
                    <span>Encrypted Quiet Sync Active</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="bg-slate-900/60 border-b border-white/10 px-3 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 select-none shrink-0" id="app-nav-tabs-bar">
                <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/10 w-full sm:w-auto" id="app-tabs-container">
                  <button
                    onClick={() => setActivePage('messenger')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      activePage === 'messenger'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/35'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                    id="tab-btn-messenger"
                  >
                    <Smartphone size={13} />
                    <span>Messenger</span>
                  </button>
                  
                  <button
                    onClick={() => setActivePage('simulator')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      activePage === 'simulator'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/35'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                    id="tab-btn-simulator"
                  >
                    <Activity size={13} />
                    <span>Simulator</span>
                  </button>

                  <button
                    onClick={() => setActivePage('grievance')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      activePage === 'grievance'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/35'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                    id="tab-btn-grievance"
                  >
                    <FileText size={13} />
                    <span>TN Portal</span>
                  </button>

                  <button
                    onClick={() => setActivePage('legal')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      activePage === 'legal'
                        ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/25 border border-amber-500/35'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                    id="tab-btn-legal"
                  >
                    <Scale size={13} />
                    <span>Legal Bridge</span>
                  </button>
                </div>
                
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 self-end sm:self-center bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE SANDBOX VIEW:</span>
                  <span className="text-indigo-400 font-bold uppercase tracking-wider">
                    {activePage === 'messenger' ? 'Chat Sandbox' : activePage === 'simulator' ? 'Interactive Controls' : activePage === 'grievance' ? 'TN Secure Portal' : 'TN Legal Bridge'}
                  </span>
                </div>
              </div>

              {/* Main Application Inner Pane */}
              <div className="flex-1 flex overflow-hidden bg-transparent" id="app-inner-panels">
                <AnimatePresence mode="wait">
                  {activePage === 'messenger' ? (
                    <motion.div
                      key="messenger-view"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex flex-row overflow-hidden bg-transparent"
                      id="messenger-container"
                    >
                      {/* Left panel: Directory & Folders */}
                      <Sidebar
                        contacts={contacts}
                        selectedContactId={selectedContactId}
                        onSelectContact={setSelectedContactId}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                        onToggleQuiet={handleToggleQuiet}
                        onAddContact={handleAddContact}
                        statuses={statusUpdates}
                        onPostStatus={handlePostStatus}
                        unlockedChatIds={unlockedChatIds}
                        onUnlockContact={handleUnlockContact}
                        readReceiptsEnabled={readReceiptsEnabled}
                        onToggleReadReceipts={handleToggleReadReceipts}
                        hideLastSeen={hideLastSeen}
                        onToggleHideLastSeen={handleToggleHideLastSeen}
                      />

                      {/* Center panel: Messages Sandbox */}
                      <ChatArea
                        contact={activeContact}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onToggleQuiet={handleToggleQuiet}
                        contacts={contacts}
                        onToggleBlock={handleToggleBlock}
                        onToggleArchive={handleToggleArchive}
                        onToggleLock={handleToggleLock}
                        onTriggerVideoCall={(contact) => handleTriggerVideoCall(contact.id)}
                        onSetChatTheme={handleSetChatTheme}
                        readReceiptsEnabled={readReceiptsEnabled}
                        hideLastSeen={hideLastSeen}
                        onUpdateMessageStatus={handleUpdateMessageStatus}
                        onBackToList={() => setSelectedContactId(null)}
                        onAcceptCase={handleAcceptCase}
                      />
                    </motion.div>
                  ) : activePage === 'simulator' ? (
                    <motion.div
                      key="simulator-view"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex overflow-hidden bg-transparent"
                      id="simulator-container"
                    >
                      {/* Right panel: Simulation dev controller */}
                      <SimulatorControl
                        contacts={contacts}
                        notifications={notifications}
                        isAutoSimulating={isAutoSimulating}
                        setIsAutoSimulating={setIsAutoSimulating}
                        simulationInterval={simulationInterval}
                        setSimulationInterval={setSimulationInterval}
                        onSimulateIncoming={handleSimulateIncoming}
                        onSimulateCall={handleSimulateCall}
                        onClearLogs={handleClearLogs}
                        onTriggerSpamAttack={handleTriggerSpamAttack}
                        onTriggerSpamCall={handleTriggerSpamCall}
                      />
                    </motion.div>
                  ) : activePage === 'grievance' ? (
                    <motion.div
                      key="grievance-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex overflow-hidden bg-transparent"
                      id="grievance-container"
                    >
                      <TNGrievancePortal />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="legal-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex overflow-hidden bg-transparent"
                      id="legal-bridge-container"
                    >
                      <LegalBridge 
                        onRequestLegalAid={handleRequestLegalAid}
                        triggerToast={(msg) => setToast({
                          id: `toast-l-${Date.now()}`,
                          contactName: "⚖️ Legal Bridge",
                          text: msg,
                          avatarColor: "bg-amber-600 text-slate-950 font-bold"
                        })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 📞 INCOMING CALL RINGING OVERLAY */}
      {incomingCall && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900/95 border border-white/20 p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden animate-fade-in" id="incoming-call-overlay">
            <div className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider animate-pulse">
              Loud Contact Ringing
            </div>
            
            <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 mb-4 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xl text-white">
                {incomingCall.name.substring(0, 1)}
              </div>
              <span className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping z-[-1]" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{incomingCall.name}</h3>
            <p className="text-xs text-slate-400 mb-6 font-mono animate-pulse">Incoming voice/video call...</p>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleDeclineCall}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg hover:shadow-rose-600/30"
                title="Decline Call"
              >
                <VolumeX size={20} />
              </button>
              <button
                type="button"
                onClick={handleAcceptCall}
                className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg hover:shadow-emerald-600/30 animate-bounce"
                title="Accept Call"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📞 ACTIVE CALL SCREEN */}
      {activeCall && (
        <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900/95 border border-white/20 p-8 rounded-2xl text-center shadow-2xl relative" id="active-call-overlay">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Call in Progress</span>
            </div>

            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-emerald-500 via-indigo-500 to-purple-500 p-1 mt-6 mb-4 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-2xl text-white">
                {activeCall.contact.name.substring(0, 1)}
              </div>
              <span className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{activeCall.contact.name}</h3>
            
            <p className="text-sm text-indigo-300 font-mono mb-8 font-medium">
              {Math.floor(activeCall.duration / 60).toString().padStart(2, '0')}:
              {(activeCall.duration % 60).toString().padStart(2, '0')}
            </p>

            <button
              type="button"
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center mx-auto cursor-pointer transition-colors shadow-lg hover:shadow-rose-600/30"
              title="Hang Up"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      )}

      {/* 📹 SIMULATED VIDEO CALL INTERFACE (Fullscreen Secure Link) */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col justify-between p-6 animate-fade-in text-white select-none">
          {/* Header */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">E2EE VIDEO TUNNEL</span>
                <span className="text-sm font-bold text-white tracking-wide">{activeVideoCall.name}</span>
              </div>
            </div>
            
            <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full uppercase">
              🔐 AES-256 SECURE LINK
            </span>
          </div>

          {/* Main Remote Stream Panel */}
          <div className="flex-1 my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center">
            {/* Holographic scanner grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none" />

            {/* Remote Avatar and waveform */}
            <div className="text-center relative z-10">
              <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 mb-6 flex items-center justify-center relative shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-3xl text-indigo-300">
                  {activeVideoCall.name.substring(0, 2).replace(/[^a-zA-Z]/g, '') || activeVideoCall.name.substring(0, 1)}
                </div>
                <span className="absolute -inset-3 bg-indigo-500/10 rounded-full animate-ping pointer-events-none" />
              </div>

              <h2 className="text-xl font-bold tracking-wide text-white">{activeVideoCall.name}</h2>
              <span className="text-xs text-indigo-400 font-semibold font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full mt-2 inline-block">
                {activeVideoCall.role}
              </span>

              {/* Animated cipher handshakes */}
              <p className="text-[10px] text-slate-400 font-mono mt-4 animate-pulse uppercase tracking-wider">
                🔄 Handshake active. Telemetry bandwidth: 4.8 Mbps.
              </p>
            </div>

            {/* Local PIP Video (Self Camera Preview) */}
            <div className="absolute top-4 right-4 w-32 h-44 rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden flex flex-col justify-between p-3 select-none">
              <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block self-start">
                Self Feed
              </span>
              
              <div className="flex-1 flex items-center justify-center text-slate-600">
                <Camera size={24} className="animate-pulse" />
              </div>

              <span className="text-[8px] font-mono text-slate-400 text-center block">
                SECURE CAMERA
              </span>
            </div>
          </div>

          {/* Controller Dock */}
          <div className="max-w-md w-full mx-auto bg-slate-900/90 border border-white/10 rounded-3xl p-4 flex items-center justify-around shadow-2xl backdrop-blur-md">
            {/* Mic Mute Toggle */}
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-slate-300 cursor-pointer transition-all"
            >
              <Mic size={18} />
            </button>

            {/* Camera Disable Toggle */}
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-slate-300 cursor-pointer transition-all"
            >
              <Video size={18} />
            </button>

            {/* Hang Up (Terminate stream) */}
            <button
              type="button"
              onClick={() => {
                const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setNotifications(prev => [
                  {
                    id: `vid-${Date.now()}`,
                    contactName: activeVideoCall.name,
                    text: `📹 DISCONNECTED: Video session closed safely. Streams purged.`,
                    timestamp: timeString,
                    type: 'allowed'
                  },
                  ...prev
                ]);
                setActiveVideoCall(null);
              }}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 flex items-center justify-center text-white cursor-pointer transition-all shadow-lg shadow-rose-600/30 hover:scale-105"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}

      {/* 🚨 SOS DISTRESS BEACON EMERGENCY MODE INTERFACE */}
      {sosActive && (
        <div className="fixed inset-0 z-[150] bg-slate-950/98 flex flex-col justify-between p-6 overflow-y-auto animate-fade-in text-white select-none font-mono">
          {/* Header warning bar */}
          <div className="bg-red-950/60 border border-red-500/30 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div>
                <h1 className="text-lg font-bold text-red-400 tracking-wider">CRITICAL INCIDENT PROTOCOL</h1>
                <span className="text-xs text-slate-400">DISTRESS TRANSMITTER BEACON: ACTIVE AND BROADCASTING</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-red-900/50 border border-red-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-red-200">
              <Wifi size={13} className="animate-pulse" />
              <span>SF-911-TACTICAL PERIMETER CONNECTED</span>
            </div>
          </div>

          {/* Bento Tactical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 flex-1">
            
            {/* TACTICAL GEOGRAPHIC BEACON */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-red-400" />
                    Geographic GNSS Beacon
                  </h3>
                  <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded uppercase font-bold">
                    GPS Fix
                  </span>
                </div>
                <p className="text-xs text-slate-400">Broadcasting live latitude and longitude satellite telemetry to first responders.</p>
              </div>

              {/* Dynamic geographic sonar radar radar */}
              <div className="relative w-40 h-40 border border-red-500/30 rounded-full mx-auto flex items-center justify-center overflow-hidden bg-red-950/10 my-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
                <div className="absolute w-full h-0.5 bg-red-500/30 top-1/2 left-0 animate-[spin_5s_linear_infinite] origin-center" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-red-500" />
                <div className="absolute text-[8px] text-red-400 bottom-3 tracking-widest uppercase font-bold">RADAR SWEEP</div>
              </div>

              {/* Coordinates display */}
              <div className="bg-slate-950/80 border border-white/10 p-3 rounded-xl">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">LATITUDE:</span>
                  <span className="text-red-300 font-bold">{sosLocation?.latitude.toFixed(5) || '37.76942'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">LONGITUDE:</span>
                  <span className="text-red-300 font-bold">{sosLocation?.longitude.toFixed(5) || '-122.48621'}</span>
                </div>
              </div>
            </div>

            {/* REAL-TIME DISTRESS TELEMETRY LOGS */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between gap-4 min-h-[300px]">
              <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={13} className="text-red-400" />
                  Tactical Logs & Outbound Dispatch Feed
                </h3>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                  Streaming Live
                </span>
              </div>

              {/* Console log list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1" id="sos-logs-console">
                {sosLogs.map((log, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-xl border flex gap-3 ${
                      log.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/20 text-red-200'
                        : log.type === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                          : 'bg-slate-950/50 border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-bold tracking-tighter shrink-0">{log.timestamp}</span>
                    <p className="leading-relaxed font-mono">{log.text}</p>
                  </div>
                ))}
              </div>

              {/* Stealth ambient recorder audio visualizer wave */}
              <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                    <Mic size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-400">STEALTH AUDIO CAPTURE SYSTEM</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Recording background ambiance silently...</p>
                  </div>
                </div>

                {/* Animated wave bars */}
                <div className="flex gap-1 items-end h-8">
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 bg-red-400 rounded-full animate-[bounce_0.8s_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 bg-red-600 rounded-full animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0.0s' }} />
                  <div className="w-1 bg-red-400 rounded-full animate-[bounce_0.7s_infinite_alternate]" style={{ animationDelay: '0.4s' }} />
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stand down button */}
          <div className="text-center">
            <button
              onClick={handleDeactivateSOS}
              className="max-w-md w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold tracking-wider rounded-2xl border border-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 hover:scale-[1.02] uppercase font-mono text-sm"
              id="sos-deactivate-button"
            >
              🔓 STAND DOWN EMERGENCY PROTOCOL
            </button>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              Secured channel auth code verified. Click to restore quiet sandbox encryption grids.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
