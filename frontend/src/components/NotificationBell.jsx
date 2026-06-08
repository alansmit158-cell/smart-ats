import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Check, CheckCheck, BriefcaseBusiness, MessageSquare, Calendar, Star, UserPlus, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useTranslation } from 'react-i18next';

// Map notification types to icons and colors
const TYPE_CONFIG = {
  application: { icon: BriefcaseBusiness, color: 'text-blue-400',    bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  scoring:     { icon: Star,              color: 'text-amber-400',   bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  message:     { icon: MessageSquare,     color: 'text-emerald-400', bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  interview:   { icon: Calendar,          color: 'text-purple-400',  bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  status:      { icon: Zap,               color: 'text-cyan-400',    bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
  user:        { icon: UserPlus,          color: 'text-indigo-400',  bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  security:    { icon: ShieldAlert,       color: 'text-rose-400',    bg: 'bg-rose-500/10',   border: 'border-rose-500/20' },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'à l\'instant';
  if (mins  < 60) return `il y a ${mins}min`;
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days}j`;
}

const NotificationBell = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const [open, setOpen]                 = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [loading, setLoading]           = useState(false);
  const [markedRead, setMarkedRead]     = useState(false);
  const isRTL = i18n.language === 'ar';

  // Fetch notifications from the API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unread);
      }
    } catch (err) {
      console.warn('Notifications fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + polling every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read');
      setMarkedRead(true);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.warn('Mark read failed:', err.message);
    }
  };

  const handleClickNotification = (notif) => {
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="relative group p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell
          size={20}
          className={`transition-all duration-300 ${open ? 'text-white scale-110' : 'text-slate-400 group-hover:text-white'}`}
        />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center
                bg-rose-500 rounded-full text-white text-[10px] font-black
                border-2 border-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.6)]`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute top-[calc(100%+12px)] z-[999] w-[380px] max-w-[calc(100vw-2rem)]
              bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden
              ${isRTL ? 'left-0' : 'right-0'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
                  <Bell size={14} className="text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">Notifications</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout à jour'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && !markedRead && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck size={12} />
                    <span className="hidden sm:block">Tout lire</span>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[420px] custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center px-6">
                  <div className="w-16 h-16 bg-white/3 border border-white/5 rounded-3xl flex items-center justify-center">
                    <Bell size={24} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300">Aucune notification</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Les événements récents apparaîtront ici
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-white/[0.03]">
                  {notifications.map((notif, idx) => {
                    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.status;
                    const IconComponent = cfg.icon;
                    return (
                      <motion.li
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => handleClickNotification(notif)}
                        className={`flex gap-3 px-5 py-4 cursor-pointer transition-all duration-200
                          hover:bg-white/3 group
                          ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                      >
                        {/* Icon badge */}
                        <div className={`flex-shrink-0 w-9 h-9 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center mt-0.5`}>
                          <IconComponent size={15} className={cfg.color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-[12px] font-black leading-tight ${notif.read ? 'text-slate-400' : 'text-white'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_#3b82f6]" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed line-clamp-2">
                            {notif.body}
                          </p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1.5">
                            {timeAgo(notif.timestamp)}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                  7 derniers jours
                </p>
                <button
                  onClick={() => { setOpen(false); fetchNotifications(); }}
                  className="text-[10px] text-slate-500 hover:text-blue-400 font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <Check size={10} /> Actualiser
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
