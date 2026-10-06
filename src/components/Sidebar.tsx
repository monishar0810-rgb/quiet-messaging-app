import React, { useState } from 'react';
import { Contact, StatusUpdate } from '../types';
import { 
  VolumeX, 
  Archive, 
  ShieldAlert, 
  MessageSquare, 
  UserPlus, 
  X, 
  ShieldCheck, 
  Smartphone, 
  Link, 
  Search, 
  Volume2, 
  Bell, 
  BellOff,
  Lock,
  Plus,
  PenTool,
  Eye,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  activeFolder: string;
  hideLastSeen: boolean;
  unlockedChatIds: string[];
  onSelectContact: (id: string) => void;
  onToggleQuiet: (id: string) => void;
  setChallengeContact: (contact: Contact | null) => void;
  setChallengePin: (pin: string) => void;
  setChallengeError: (error: boolean) => void;
}

function ContactItem({
  contact,
  isSelected,
  activeFolder,
  hideLastSeen,
  unlockedChatIds,
  onSelectContact,
  onToggleQuiet,
  setChallengeContact,
  setChallengePin,
  setChallengeError,
}: ContactItemProps) {
  return (
    <div
      onClick={() => {
        if (contact.isLocked && !unlockedChatIds.includes(contact.id)) {
          setChallengeContact(contact);
          setChallengePin("");
          setChallengeError(false);
        } else {
          onSelectContact(contact.id);
        }
      }}
      className={`group flex items-center gap-3.5 py-3 px-4 transition-all cursor-pointer relative ${
        isSelected
          ? activeFolder === 'quiet'
            ? 'bg-white/10 border-l-[3px] border-pink-500'
            : 'bg-white/10 border-l-[3px] border-indigo-500'
          : 'hover:bg-white/[0.04] border-l-[3px] border-transparent'
      }`}
      id={`contact-item-${contact.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (contact.isLocked && !unlockedChatIds.includes(contact.id)) {
            setChallengeContact(contact);
            setChallengePin("");
            setChallengeError(false);
          } else {
            onSelectContact(contact.id);
          }
        }
      }}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] ${contact.avatarColor}`}>
          {contact.name.substring(0, 2).replace(/[^a-zA-Z]/g, "") || contact.name.substring(0, 1)}
        </div>
        {contact.status === 'online' && !hideLastSeen && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
        )}
        {contact.status === 'typing' && !hideLastSeen && (
          <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <h2 className="text-[14px] font-bold text-white pr-1 flex items-center gap-2 min-w-0 flex-1">
            <span className="truncate flex-1">{contact.name}</span>
            {contact.isLocked && (
              <Lock size={12} className="text-amber-400 flex-shrink-0" title="Passcode protected" />
            )}
            <span className="text-[9.5px] bg-white/10 text-slate-300 font-mono px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 border border-white/5">
              {contact.role}
            </span>
          </h2>
          <span className="text-[11px] text-slate-300 flex-shrink-0 font-mono font-medium">
            {contact.lastMessageAt || "Now"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-[12.5px] text-slate-300 truncate pr-3 leading-normal">
            {contact.status === 'typing' && !hideLastSeen ? (
              <span className="text-indigo-400 font-medium italic">typing...</span>
            ) : (
              contact.lastMessageText || 'No messages yet'
            )}
          </p>
          {contact.unreadCount > 0 && !contact.isQuiet && (
            <span className="flex-shrink-0 bg-indigo-600 text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center animate-pulse">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleQuiet(contact.id);
        }}
        className={`absolute right-3.5 top-3.5 opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all border shadow-sm cursor-pointer ${
          contact.isQuiet
            ? 'bg-indigo-950/60 border-indigo-500/30 hover:bg-indigo-900/80 text-indigo-400'
            : 'bg-pink-950/60 border-pink-500/30 hover:bg-pink-900/80 text-pink-400'
        }`}
        title={contact.isQuiet ? "Move to Primary Inbox" : "Move to Quiet Folder"}
        id={`toggle-quiet-btn-${contact.id}`}
      >
        {contact.isQuiet ? <Bell size={13} /> : <BellOff size={13} />}
      </button>
    </div>
  );
}

export interface SidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  activeFolder: string;
  setActiveFolder: (folder: string) => void;
  onToggleQuiet: (id: string) => void;
  onAddContact: (name: string, role: string) => void;
  statuses: StatusUpdate[];
  onPostStatus: (text: string, bgColor: string) => void;
  unlockedChatIds: string[];
  onUnlockContact: (id: string) => void;
  readReceiptsEnabled: boolean;
  onToggleReadReceipts: () => void;
  hideLastSeen: boolean;
  onToggleHideLastSeen: () => void;
}

export default function Sidebar({
  contacts,
  selectedContactId,
  onSelectContact,
  activeFolder,
  setActiveFolder,
  onToggleQuiet,
  onAddContact,
  statuses,
  onPostStatus,
  unlockedChatIds,
  onUnlockContact,
  readReceiptsEnabled,
  onToggleReadReceipts,
  hideLastSeen,
  onToggleHideLastSeen
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyExpanded, setPrivacyExpanded] = useState(true);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [companionStatus, setCompanionStatus] = useState<"idle" | "handshake" | "connected">("idle");
  const [companionProgress, setCompanionProgress] = useState(0);
  const [companionQrCode, setCompanionQrCode] = useState("");
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatusText, setNewStatusText] = useState("");
  const [newStatusBg, setNewStatusBg] = useState("from-indigo-600 to-purple-600");
  const [activeStatusId, setActiveStatusId] = useState<string | null>(null);
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("Personal");
  const [challengeContact, setChallengeContact] = useState<Contact | null>(null);
  const [challengePin, setChallengePin] = useState("");
  const [challengeError, setChallengeError] = useState(false);

  // Filter contacts based on folder and search query
  const filteredContacts = contacts.filter(contact => {
    if (activeFolder === "normal") {
      return !contact.isQuiet && !contact.isArchived && !contact.isBlocked && !contact.isSpam;
    }
    if (activeFolder === "quiet") {
      return !!contact.isQuiet && !contact.isArchived && !contact.isBlocked && !contact.isSpam;
    }
    if (activeFolder === "archive") {
      return !!contact.isArchived && !contact.isBlocked && !contact.isSpam;
    }
    if (activeFolder === "spam") {
      return !!contact.isBlocked || !!contact.isSpam;
    }
    return true;
  }).filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Unread badge counts per folder
  const normalUnread = contacts.filter(c => !c.isQuiet && !c.isArchived && !c.isBlocked && !c.isSpam).reduce((sum, c) => sum + c.unreadCount, 0);
  const quietUnread = contacts.filter(c => c.isQuiet && !c.isArchived && !c.isBlocked && !c.isSpam).reduce((sum, c) => sum + c.unreadCount, 0);
  const archivedUnread = contacts.filter(c => !!c.isArchived && !c.isBlocked && !c.isSpam).reduce((sum, c) => sum + c.unreadCount, 0);
  const spamUnread = contacts.filter(c => !!c.isBlocked || !!c.isSpam).reduce((sum, c) => sum + c.unreadCount, 0);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactName.trim()) {
      onAddContact(newContactName.trim(), newContactRole);
      setNewContactName("");
      setNewContactRole("Personal");
      setAddContactOpen(false);
    }
  };

  return (
    <aside 
      className={`${selectedContactId ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] md:min-w-[320px] md:max-w-[320px] flex-col h-full bg-slate-900 border-r border-slate-700 overflow-hidden text-slate-100 shrink-0`}
      id="sidebar-container"
    >
      {/* Top Section */}
      <header className="flex flex-col flex-shrink-0 border-b border-white/10 bg-slate-900/40" id="sidebar-top-section">
        {/* Header */}
        <div className="p-3.5 flex items-center justify-between" id="sidebar-header">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <MessageSquare size={19} />
            </div>
            <h1 className="font-bold text-white text-[15px] tracking-tight">Quiet Messenger</h1>
          </div>
          <button 
            type="button"
            onClick={() => setAddContactOpen(true)}
            className="p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Add Custom Contact"
            id="add-contact-btn"
          >
            <UserPlus size={18} />
          </button>
        </div>

        {/* Companion Device Sync Trigger */}
        <div className="px-3 pb-3" id="sidebar-companion-container">
          <button
            type="button"
            onClick={() => {
              setCompanionOpen(true);
              if (companionStatus !== "connected" && companionStatus !== "handshake") {
                setCompanionStatus("idle");
              }
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 active:scale-[0.98] text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-sm"
            title="Link Companion Device"
            id="sidebar-link-device-trigger-btn"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-md shrink-0 relative">
                <Smartphone size={14} />
                {companionStatus === "connected" && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
              </div>
              <div className="text-left leading-snug">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Companion Device</p>
                <p className="text-[9px] text-slate-350">
                  {companionStatus === "connected" ? "● Connected" : "Sync phone via QR"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-indigo-300 font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
              <span>{companionStatus === "connected" ? "Paired" : "Link"}</span>
              <Link size={10} className={companionStatus === "connected" ? "text-emerald-400" : "animate-pulse"} />
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3" id="sidebar-search-container">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-350">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-[13px] rounded-lg border border-white/10 focus:border-white/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-100"
              id="sidebar-search"
            />
          </div>
        </div>

        {/* Folder Tabs */}
        <nav className="grid grid-cols-4 gap-1.5 px-3 pb-3" id="sidebar-tabs" aria-label="Folder navigation">
          <button
            type="button"
            onClick={() => setActiveFolder("normal")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeFolder === "normal"
                ? "bg-white/10 text-white border border-white/10 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold border border-transparent"
            }`}
            id="tab-normal"
            title="Primary Inbox"
          >
            <div className="relative">
              <Volume2 size={17} className={activeFolder === "normal" ? "text-indigo-400" : "text-slate-400"} />
              {normalUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9.5px] px-1 rounded-sm font-bold min-w-[14px] h-[14px] flex items-center justify-center leading-none">
                  {normalUnread}
                </span>
              )}
            </div>
            <span className="text-[13px] mt-1.5 font-bold tracking-tight">Primary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolder("quiet")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeFolder === "quiet"
                ? "bg-pink-500/15 text-pink-300 border border-pink-500/25 font-bold shadow-sm"
                : "text-slate-400 hover:text-pink-300 hover:bg-pink-500/5 font-semibold border border-transparent"
            }`}
            id="tab-quiet"
            title="Quiet Folder"
          >
            <div className="relative">
              <VolumeX size={17} className={activeFolder === "quiet" ? "text-pink-400" : "text-slate-400"} />
              {quietUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[9.5px] px-1 rounded-sm font-bold min-w-[14px] h-[14px] flex items-center justify-center leading-none">
                  {quietUnread}
                </span>
              )}
            </div>
            <span className="text-[13px] mt-1.5 font-bold tracking-tight">Quiet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolder("archive")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeFolder === "archive"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/25 font-bold shadow-sm"
                : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5 font-semibold border border-transparent"
            }`}
            id="tab-archive"
            title="Archive"
          >
            <div className="relative">
              <Archive size={17} className={activeFolder === "archive" ? "text-amber-400" : "text-slate-400"} />
              {archivedUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9.5px] px-1 rounded-sm font-bold min-w-[14px] h-[14px] flex items-center justify-center leading-none">
                  {archivedUnread}
                </span>
              )}
            </div>
            <span className="text-[13px] mt-1.5 font-bold tracking-tight">Archive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolder("spam")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeFolder === "spam"
                ? "bg-rose-500/15 text-rose-300 border border-rose-500/25 font-bold shadow-sm"
                : "text-slate-400 hover:text-rose-300 hover:bg-rose-500/5 font-semibold border border-transparent"
            }`}
            id="tab-spam"
            title="Spam"
          >
            <div className="relative">
              <ShieldAlert size={17} className={activeFolder === "spam" ? "text-rose-400" : "text-slate-400"} />
              {spamUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9.5px] px-1 rounded-sm font-bold min-w-[14px] h-[14px] flex items-center justify-center leading-none">
                  {spamUnread}
                </span>
              )}
            </div>
            <span className="text-[13px] mt-1.5 font-bold tracking-tight">Spam</span>
          </button>
        </nav>
      </header>

      {/* Status Header (Contains 'My Status Updates' block) */}
      <section className="flex-shrink-0 sticky top-0 z-10 p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/95 backdrop-blur-md" id="sidebar-status-bar">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
          <button 
            type="button"
            onClick={() => {
              setStatusModalOpen(true);
              if (statuses.length > 0) {
                setActiveStatusId(statuses[0].id);
              }
            }}
            className="relative flex-shrink-0 cursor-pointer group animate-none"
          >
            <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-[12px] text-indigo-300 border border-slate-950">
                ME
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full animate-pulse" />
          </button>
          <div className="min-w-0 flex-1">
            <button 
              type="button"
              onClick={() => {
                setStatusModalOpen(true);
                if (statuses.length > 0) {
                  setActiveStatusId(statuses[0].id);
                }
              }}
              className="text-[14px] font-bold text-white hover:text-indigo-400 transition-colors text-left block truncate cursor-pointer leading-tight w-full"
            >
              My Status Updates
            </button>
            <span className="text-[12.5px] text-slate-300 block truncate leading-tight mt-0.5 w-full">
              {statuses.length > 0 ? statuses[0].text : 'No active updates'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatusModalOpen(true);
            if (statuses.length > 0) {
              setActiveStatusId(statuses[0].id);
            }
          }}
          className="text-[12.5px] bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors flex-shrink-0"
        >
          Post
        </button>
      </section>

      {/* Contact List (Scrollable) */}
      <nav className="flex-1 min-h-0 overflow-y-auto" id="contacts-list-scroll-wrapper" aria-label="Conversation list">
        <ul className="divide-y divide-white/5 bg-slate-950/10" id="contacts-list">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-10 px-4" id="empty-contacts-state">
              <div className="mx-auto w-10 h-10 bg-white/5 text-slate-400 rounded-full flex items-center justify-center mb-2.5 border border-white/10">
                {activeFolder === 'quiet' ? (
                  <VolumeX size={18} className="text-pink-400" />
                ) : activeFolder === 'archive' ? (
                  <Archive size={18} className="text-amber-400" />
                ) : activeFolder === 'spam' ? (
                  <ShieldAlert size={18} className="text-rose-400" />
                ) : (
                  <MessageSquare size={18} className="text-indigo-400" />
                )}
              </div>
              <h3 className="font-semibold text-slate-200 text-xs">No conversations</h3>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto leading-normal">
                {activeFolder === 'quiet'
                  ? 'Muted contacts will appear here silently.'
                  : activeFolder === 'archive'
                  ? 'Archived chats are stored here safely.'
                  : activeFolder === 'spam'
                  ? 'Blocked spam contacts appear here.'
                  : 'No active conversations in your main inbox.'}
              </p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <li key={contact.id}>
                <ContactItem
                  contact={contact}
                  isSelected={selectedContactId === contact.id}
                  activeFolder={activeFolder}
                  hideLastSeen={hideLastSeen}
                  unlockedChatIds={unlockedChatIds}
                  onSelectContact={onSelectContact}
                  onToggleQuiet={onToggleQuiet}
                  setChallengeContact={setChallengeContact}
                  setChallengePin={setChallengePin}
                  setChallengeError={setChallengeError}
                />
              </li>
            ))
          )}
        </ul>
      </nav>

      {/* Privacy Settings Block & Footer */}
      <footer className="flex-shrink-0 border-t border-white/10 bg-slate-950/20 flex flex-col" id="sidebar-bottom-panel">
        <div className="mx-2.5 my-2 bg-white/5 border border-white/10 rounded-lg overflow-hidden" id="sidebar-privacy-settings">
          <button
            type="button"
            onClick={() => setPrivacyExpanded(!privacyExpanded)}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck size={14} />
              <span>Privacy Settings</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {privacyExpanded ? "▼" : "▲"}
            </span>
          </button>
          {privacyExpanded && (
            <div className="p-2.5 border-t border-white/5 space-y-2 bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[11.5px] font-bold text-white block">Blue Ticks</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight">Read Receipts</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleReadReceipts()}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${
                    readReceiptsEnabled ? "bg-indigo-600" : "bg-white/10"
                  }`}
                  id="toggle-read-receipts"
                  title={readReceiptsEnabled ? "Turn Read Receipts OFF" : "Turn Read Receipts ON"}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 transform ${
                    readReceiptsEnabled ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[11.5px] font-bold text-white block">Hide Last Seen</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight">Hide online status</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleHideLastSeen()}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${
                    hideLastSeen ? "bg-indigo-600" : "bg-white/10"
                  }`}
                  id="toggle-hide-last-seen"
                  title={hideLastSeen ? "Turn Last Seen ON" : "Turn Last Seen OFF"}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 transform ${
                    hideLastSeen ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 bg-slate-950/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400" id="sidebar-footer">
          <div className="flex items-center gap-1.5 font-bold">
            <VolumeX size={14} className="text-pink-400 animate-pulse" />
            <span>Quiet Folders Active</span>
          </div>
          <span className="text-slate-300 font-mono font-medium">
            {contacts.filter(c => c.isQuiet).length} muted
          </span>
        </div>
      </footer>

      <AnimatePresence>
        {/* Add Contact Modal */}
        {addContactOpen && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-xl w-full max-w-xs overflow-hidden"
            >
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-semibold text-white text-sm">Add New Contact</h3>
                <button
                  onClick={() => setAddContactOpen(false)}
                  className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleCreateContact} className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chatty Cousin 💬"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-500"
                    id="new-contact-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category / Role</label>
                  <select
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-white"
                    id="new-contact-role"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Family">Family</option>
                    <option value="Work Boss">Work</option>
                    <option value="Promotional Spam">Promotional</option>
                    <option value="Bot Tracker">Bot</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus size={14} />
                  <span>Create Contact</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Status Updates Modal */}
        {statusModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[500px] shadow-2xl text-slate-100"
              id="status-modal-inner"
            >
              <div className="flex-1 p-5 flex flex-col border-r border-white/10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <PenTool size={16} />
                    <span>Post New Status</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="md:hidden p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mb-3">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Select Background Style</label>
                  <div className="flex gap-2">
                    {[
                      { key: "from-indigo-600 to-purple-600", name: "Classic" },
                      { key: "from-pink-600 to-rose-600", name: "Twilight" },
                      { key: "from-emerald-600 to-teal-600", name: "Teal" },
                      { key: "from-amber-500 to-orange-600", name: "Sunset" },
                      { key: "from-slate-700 to-slate-900", name: "Midnight" }
                    ].map(style => (
                      <button
                        key={style.key}
                        type="button"
                        onClick={() => setNewStatusBg(style.key)}
                        className={`w-6 h-6 rounded-full bg-gradient-to-tr ${style.key} border transition-all cursor-pointer ${
                          newStatusBg === style.key ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                        }`}
                        title={style.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <textarea
                    placeholder="What's on your mind? e.g., Code is compiling beautifully! 🚀"
                    value={newStatusText}
                    onChange={(e) => setNewStatusText(e.target.value)}
                    maxLength={70}
                    rows={3}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-500 resize-none"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>{70 - newStatusText.length} chars left</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (newStatusText.trim()) {
                          onPostStatus(newStatusText.trim(), newStatusBg);
                          setNewStatusText("");
                        }
                      }}
                      disabled={!newStatusText.trim()}
                      className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        newStatusText.trim()
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                          : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                      }`}
                    >
                      Post Status
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[140px]">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">My Active Statuses</label>
                  {statuses.length === 0 ? (
                    <div className="flex-1 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-4 text-center text-slate-500">
                      <p className="text-xs">No active status updates</p>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-2 overflow-y-auto max-h-[150px] pr-1">
                      {statuses.map(status => {
                        const isCurrent = status.id === activeStatusId;
                        return (
                          <div
                            key={status.id}
                            onClick={() => setActiveStatusId(status.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isCurrent ? "bg-indigo-600/20 border-indigo-500" : "bg-white/5 border-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${status.bgColor} flex items-center justify-center text-[10px] p-1 text-center font-bold leading-tight select-none flex-shrink-0 text-white`}>
                                {status.text.substring(0, 3)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-white font-medium truncate max-w-[150px]">{status.text}</p>
                                <span className="text-[9px] text-slate-400 block">{status.timestamp}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-[10px] bg-slate-800 text-indigo-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Eye size={10} /> {status.viewers.length}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-72 bg-slate-950 p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                    <Eye size={16} />
                    <span>Views</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="hidden md:block p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg mb-3 text-[10px] text-slate-300 leading-normal">
                  💡 <strong>Status Visibility:</strong> Even contacts currently in <strong>Quiet Mode</strong> (🤫) can fetch and view your stories normally.
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {(() => {
                    const activeStatus = statuses.find(s => s.id === activeStatusId) || statuses[0];
                    if (!activeStatus) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center py-8">
                          <p>Post a status to see viewers list!</p>
                        </div>
                      );
                    }
                    if (activeStatus.viewers.length === 0) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center py-8">
                          <p className="animate-pulse">Waiting for viewers...</p>
                          <p className="text-[10px] text-slate-600 mt-1">Simulated friends view statuses in real time!</p>
                        </div>
                      );
                    }
                    return activeStatus.viewers.map((viewer, idx) => (
                      <div key={idx} className="p-2 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-indigo-500/10 text-indigo-300 flex-shrink-0">
                            {viewer.name.substring(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{viewer.name}</h4>
                            <span className="text-[9px] text-slate-400 block">{viewer.viewedAt}</span>
                          </div>
                        </div>
                        {viewer.isQuiet ? (
                          <span className="text-[8px] bg-pink-500/15 text-pink-300 border border-pink-500/20 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 uppercase flex-shrink-0" title="Quiet Mode is ON for this contact">
                            🤫 Quiet
                          </span>
                        ) : (
                          <span className="text-[8px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 uppercase flex-shrink-0">
                            🔊 Active
                          </span>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Companion Pairing QR Modal */}
        {companionOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-slate-900 border border-white/15 rounded-2xl overflow-hidden flex flex-col shadow-2xl text-slate-100 font-sans"
              id="qr-pairing-modal-inner"
            >
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Link size={16} />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Link Companion Device</span>
                </div>
                <button
                  onClick={() => setCompanionOpen(false)}
                  className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                  title="Close Modal"
                  id="close-pairing-modal-btn"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-center">
                {companionStatus === "idle" && (
                  <div className="space-y-4 text-center flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Pair Primary Terminal</span>
                    <div className="p-3 bg-white rounded-xl inline-block relative group shadow-2xl">
                      <svg width="120" height="120" viewBox="0 0 100 100" className="text-slate-900 fill-current">
                        <path d="M0 0h30v10H10v20H0V0zm10 10h10v10H10V10zM70 0h30v30H90V10H70V0zm10 10h10v10H80V10zM0 70h30v30H0V70zm10 10h10v10H10V80z" />
                        <rect x="40" y="10" width="10" height="10" />
                        <rect x="50" y="20" width="10" height="10" />
                        <rect x="10" y="40" width="10" height="10" />
                        <rect x="20" y="50" width="10" height="10" />
                        <rect x="40" y="40" width="20" height="20" />
                        <rect x="70" y="50" width="10" height="10" />
                        <rect x="80" y="40" width="10" height="10" />
                        <rect x="50" y="70" width="10" height="10" />
                        <rect x="40" y="80" width="20" height="10" />
                        <rect x="70" y="80" width="20" height="20" />
                      </svg>
                      <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <QrCode size={32} className="text-indigo-500 animate-bounce" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300 font-medium">
                        Secure Session Key: <span className="font-mono text-amber-400 font-bold select-all">MESSENGER-SYNC-XP92</span>
                      </p>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Generates an end-to-end quiet sync channel to share private notifications with your secondary phone or tablet.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompanionStatus("handshake");
                        setCompanionProgress(0);
                        setCompanionQrCode("📡 BROADCASTING SYNC BEACON...");
                        let progress = 0;
                        const timer = setInterval(() => {
                          progress += 20;
                          setCompanionProgress(progress);
                          if (progress === 20) {
                            setCompanionQrCode("🔐 EXCHANGE SECURE QUANTUM PARAMS...");
                          } else if (progress === 40) {
                            setCompanionQrCode("🔒 GENERATING CRYPTO DECRYPT HOOKS...");
                          } else if (progress === 60) {
                            setCompanionQrCode("🤝 INITIATING SECURE HANDSHAKE SEAL...");
                          } else if (progress === 80) {
                            setCompanionQrCode("🧬 PERFORMING COMPANION VALIDATION...");
                          } else if (progress >= 100) {
                            clearInterval(timer);
                            setCompanionStatus("connected");
                            try {
                              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                              const playTone = (freq: number, time: number, dur: number) => {
                                const osc = audioCtx.createOscillator();
                                const gain = audioCtx.createGain();
                                osc.connect(gain);
                                gain.connect(audioCtx.destination);
                                osc.type = "sine";
                                osc.frequency.setValueAtTime(freq, time);
                                gain.gain.setValueAtTime(0.05, time);
                                osc.start(time);
                                osc.stop(time + dur);
                              };
                              const now = audioCtx.currentTime;
                              playTone(600, now, 0.08);
                              playTone(1200, now + 0.09, 0.15);
                            } catch (err) {
                              console.warn(err);
                            }
                          }
                        }, 550);
                      }}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      id="connect-companion-system-btn-modal"
                    >
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Connect to System</span>
                    </button>
                  </div>
                )}

                {companionStatus === "handshake" && (
                  <div className="py-6 space-y-5 text-center">
                    <div className="flex items-center justify-center relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="w-20 h-20 border-2 border-dashed border-indigo-500/40 rounded-full flex items-center justify-center"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        className="w-16 h-16 border border-dotted border-amber-500/50 rounded-full absolute"
                      />
                      <Smartphone size={24} className="text-amber-400 absolute animate-pulse" />
                    </div>
                    <div className="space-y-3.5">
                      <p className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest min-h-[16px]">{companionQrCode}</p>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-amber-400"
                          animate={{ width: `${companionProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">Node: tng-terminal-node-4089 | Strength: E2EE Secure</p>
                    </div>
                  </div>
                )}

                {companionStatus === "connected" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-center p-1"
                  >
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 relative shrink-0">
                        <Smartphone size={20} />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-[11px] text-slate-950 font-bold rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">✓</span>
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">Quiet Sync Established</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">Pixel 8 Pro paired</h4>
                      </div>
                    </div>
                    <div className="bg-slate-950/40 border border-emerald-500/15 p-3 rounded-xl space-y-1.5 text-left font-mono">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Status:</span>
                        <span className="text-emerald-400 font-bold">● ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Encrypted Sync:</span>
                        <span className="text-indigo-400 font-bold">128-BIT QUANTUM</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Last Sync:</span>
                        <span className="text-slate-300">Just Now</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompanionStatus("idle")}
                      className="w-full py-2.5 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-slate-400 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      id="disconnect-companion-system-btn-modal"
                    >
                      Unlink Device Terminal
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* PIN Lock Screen Prompt / Passcode Challenge Modal */}
        {challengeContact && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 animate-pulse">
                <Lock size={28} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide uppercase font-mono">SECURE CHAT LINK</h3>
              <p className="text-xs text-slate-400 mt-1">
                Encrypted channel locked for <span className="text-amber-300 font-semibold">{challengeContact.name}</span>.
                <br />
                Provide authentication PIN to establish handshake.
              </p>
              <div className="h-6 mt-2">
                {challengeError && (
                  <span className="text-rose-400 text-xs font-mono font-bold tracking-wider animate-bounce">
                    ⚠️ AUTHENTICATION FAIL: ACCESS DENIED
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-4 my-6">
                {[0, 1, 2, 3].map(H => (
                  <div
                    key={H}
                    className={`w-4.5 h-4.5 rounded-full border transition-all duration-150 ${
                      challengePin.length > H
                        ? "bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-500/30"
                        : challengeError
                        ? "bg-rose-500/25 border-rose-500 animate-pulse"
                        : "bg-white/5 border-white/20"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (challengePin.length < 4) {
                        const newPin = challengePin + num;
                        setChallengePin(newPin);
                        setChallengeError(false);
                        if (newPin.length === 4) {
                          if (newPin === (challengeContact.pinCode || "1234")) {
                            onUnlockContact(challengeContact.id);
                            onSelectContact(challengeContact.id);
                            setChallengeContact(null);
                            setChallengePin("");
                          } else {
                            setChallengeError(true);
                            setTimeout(() => {
                              setChallengePin("");
                            }, 600);
                          }
                        }
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/25 border border-white/10 flex items-center justify-center text-xl font-mono text-white font-medium transition-all duration-100 cursor-pointer shadow-xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setChallengeContact(null);
                    setChallengePin("");
                    setChallengeError(false);
                  }}
                  className="w-16 h-16 rounded-full bg-white/5 hover:bg-rose-950/40 text-rose-300 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-all duration-100 cursor-pointer border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (challengePin.length < 4) {
                      const newPin = challengePin + "0";
                      setChallengePin(newPin);
                      setChallengeError(false);
                      if (newPin.length === 4) {
                        if (newPin === (challengeContact.pinCode || "1234")) {
                          onUnlockContact(challengeContact.id);
                          onSelectContact(challengeContact.id);
                          setChallengeContact(null);
                          setChallengePin("");
                        } else {
                          setChallengeError(true);
                          setTimeout(() => {
                            setChallengePin("");
                          }, 600);
                        }
                      }
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/25 border border-white/10 flex items-center justify-center text-xl font-mono text-white font-medium transition-all duration-100 cursor-pointer shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChallengePin(prev => prev.slice(0, -1));
                    setChallengeError(false);
                  }}
                  className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-all duration-100 cursor-pointer border border-white/5"
                >
                  Clear
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-mono animate-pulse">SECURE LOCK-OUT PROTECTION PROTOCOL CO-902</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}
