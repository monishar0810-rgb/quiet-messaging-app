export type ChatThemeName = 'midnight' | 'emerald' | 'lavender' | 'crimson' | 'ocean' | 'amber';

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  avatarColor: string;
  isQuiet: boolean;
  status: 'online' | 'offline' | 'typing';
  lastMessageText?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isBlocked?: boolean;
  isArchived?: boolean;
  isLocked?: boolean;
  isSpam?: boolean;
  pinCode?: string;
  chatTheme?: ChatThemeName;
  caseStatus?: 'Pending' | 'Active Legal Representation';
}

export interface Message {
  id: string;
  contactId: string;
  sender: 'me' | 'contact';
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isQuietMessage: boolean; // Captured while contact was quieted
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file' | 'audio' | 'location' | 'payment';
  fileName?: string;
  fileSize?: string;
  duration?: number; // duration in seconds for voice notes
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'success' | 'declined';
  paymentType?: 'send' | 'request' | 'receipt';
}

export interface SystemNotification {
  id: string;
  contactName: string;
  text: string;
  timestamp: string;
  type: 'allowed' | 'suppressed';
}

export interface StatusUpdate {
  id: string;
  text: string;
  bgColor: string;
  timestamp: string;
  viewers: {
    contactId: string;
    name: string;
    isQuiet: boolean;
    viewedAt: string;
  }[];
}

export interface Advocate {
  id: string;
  name: string;
  specialization: 'Criminal' | 'Civil' | 'Property';
  experience: number; // Years
  court_location: string; // E.g., Madras High Court, Coimbatore District Court
  current_availability: 'Available' | 'Busy';
  contactId: string; // Corresponding chat contact ID for masked secure chat
}

export interface CaseContext {
  category: 'Criminal' | 'Civil' | 'Property';
  section: string;
  sectionDescription: string;
  summary: string;
}

export interface CitizenProfile {
  fullName: string;
  anonymizedName: string;
  aadhaarHash: string;
  mobileNumber: string;
  preferredLanguage: 'English' | 'Tamil';
  registeredAt: string;
}

