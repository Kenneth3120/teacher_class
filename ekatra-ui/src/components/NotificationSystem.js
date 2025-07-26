import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // 'success', 'error', 'warning', 'info'
      title: '',
      message: '',
      duration: 5000, // Default 5 seconds, 0 for persistent
      persistent: false, // Whether to store in persistent storage
      ...notification
    };

    setNotifications(prev => {
      // Prevent duplicate notifications with same message
      const isDuplicate = prev.some(n => n.message === newNotification.message && n.title === newNotification.title);
      if (isDuplicate) return prev;
      
      // Keep only last 10 notifications
      const updatedNotifications = [...prev, newNotification];
      return updatedNotifications.slice(-10);
    });

    // Store persistent notifications in localStorage
    if (newNotification.persistent || newNotification.duration === 0) {
      const persistentNotifications = JSON.parse(localStorage.getItem('ekatra_notifications') || '[]');
      persistentNotifications.push({
        ...newNotification,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ekatra_notifications', JSON.stringify(persistentNotifications.slice(-50))); // Keep last 50
    }

    // Auto remove after duration (only if duration > 0)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    // Also clear persistent notifications
    localStorage.removeItem('ekatra_notifications');
  };

  const loadPersistentNotifications = () => {
    const persistentNotifications = JSON.parse(localStorage.getItem('ekatra_notifications') || '[]');
    return persistentNotifications.map(notif => ({
      ...notif,
      id: Date.now() + Math.random(), // Generate new ID
      isPersistent: true
    }));
  };

  const clearPersistentNotifications = () => {
    localStorage.removeItem('ekatra_notifications');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      loadPersistentNotifications,
      clearPersistentNotifications
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success': return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        accent: 'text-green-600 dark:text-green-400'
      };
      case 'error': return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        accent: 'text-red-600 dark:text-red-400'
      };
      case 'warning': return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-200',
        accent: 'text-yellow-600 dark:text-yellow-400'
      };
      default: return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        accent: 'text-blue-600 dark:text-blue-400'
      };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        max-w-sm w-full ${colors.bg} ${colors.border} border rounded-xl shadow-lg 
        backdrop-blur-sm overflow-hidden cursor-pointer group
      `}
      onClick={() => onRemove(notification.id)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AnimatedIcon 
              icon={getIcon()} 
              size={20} 
              animation="bounce"
            />
          </div>
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className={`text-sm font-semibold ${colors.text} mb-1`}>
                {notification.title}
              </h4>
            )}
            <p className={`text-sm ${colors.accent} leading-relaxed`}>
              {notification.message}
            </p>
            {notification.action && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  notification.action.onClick();
                }}
                className={`mt-2 text-xs font-medium ${colors.accent} hover:underline`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {notification.action.label}
              </motion.button>
            )}
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(notification.id);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatedIcon icon="✕" size={16} animation="pulse" />
          </motion.button>
        </div>
      </div>

      {/* Progress bar for timed notifications */}
      {notification.duration > 0 && (
        <motion.div
          className={`h-1 ${colors.accent.replace('text-', 'bg-')} opacity-30`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notification.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Notification Bell Component for UI
export const NotificationBell = () => {
  const { notifications, clearAll, loadPersistentNotifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  
  useEffect(() => {
    // Combine current and persistent notifications
    const persistentNotifications = loadPersistentNotifications();
    const combined = [...persistentNotifications, ...notifications];
    setAllNotifications(combined);
  }, [notifications, loadPersistentNotifications]);
  
  const unreadCount = allNotifications.length;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 glass rounded-xl hover:bg-white/10 dark:hover:bg-black/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatedIcon
          icon="🔔"
          size={20}
          animation={unreadCount > 0 ? "shake" : "float"}
        />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications ({unreadCount})
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <AnimatedIcon icon="📭" size={48} animation="float" />
                  <p className="mt-2">No notifications</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {allNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer ${
                        notification.isPersistent ? 'border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AnimatedIcon 
                          icon={notification.type === 'success' ? '✅' : 
                                notification.type === 'error' ? '❌' : 
                                notification.type === 'warning' ? '⚠️' : 'ℹ️'} 
                          size={16} 
                        />
                        <div className="flex-1 min-w-0">
                          {notification.title && (
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                          {notification.isPersistent && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default { NotificationProvider, NotificationBell, useNotifications };