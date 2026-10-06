import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, BellRing } from 'lucide-react';

/**
 * Interface representing the structural payload of a single toast notification.
 */
interface ToastData {
  id: string;          // Unique identifier for the notification toast instance
  contactName: string; // Display name of the contact who sent the trigger message
  text: string;        // Text content preview of the incoming message
  avatarColor: string; // Tailwind class representing the background color of the avatar
}

/**
 * Props expected by the NotificationToast component.
 */
interface NotificationToastProps {
  toast: ToastData | null; // The current active toast payload, or null if hidden
  onClose: () => void;     // Callback handler to dismiss/dismiss the active toast
}

/**
 * NotificationToast Component
 * 
 * Renders a visually polished, interactive floating notification banner at the top-right
 * corner of the window. Supports micro-animations via motion, springs for natural physics,
 * and automatic self-dismissal after a 5-second idle duration.
 */
export default function NotificationToast({ toast, onClose }: NotificationToastProps) {
  
  // Set up the automatic dismissal timeout handler upon mounting a new toast
  useEffect(() => {
    if (toast) {
      // Auto close/dismiss the notification banner after 5000ms (5 seconds)
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      // Cleanup the subscription/timer when the component unmounts or toast changes
      return () => clearTimeout(timer);
    }
  }, [toast?.id, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="absolute top-4 right-4 z-50 w-80 bg-slate-950/90 backdrop-blur-md border border-white/15 shadow-2xl rounded-2xl p-4 flex gap-3 pointer-events-auto text-white"
          id={`toast-banner-${toast.id}`}
        >
          {/* Custom Notification Avatar Icon with Status Indicator */}
          <div className="relative flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${toast.avatarColor}`}>
              {toast.contactName.substring(0, 2).replace(/[^a-zA-Z]/g, '') || toast.contactName.substring(0, 1)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-slate-950">
              <MessageSquare size={10} />
            </div>
          </div>

          {/* Toast Message Body Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <BellRing size={11} className="text-indigo-400" />
                <span>New Message</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Just now</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mt-1 truncate">
              {toast.contactName}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {toast.text}
            </p>
          </div>

          {/* Manual Toast Dismiss/Dismissal Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 self-start p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            id="toast-close-btn"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
