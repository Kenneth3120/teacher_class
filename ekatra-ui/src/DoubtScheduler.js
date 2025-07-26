import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "./components/NotificationSystem";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const DoubtScheduler = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      studentName: "Emma Johnson",
      subject: "Mathematics",
      topic: "Algebra - Quadratic Equations",
      date: "2025-03-15",
      time: "10:00 AM",
      status: "scheduled"
    },
    {
      id: 2,
      studentName: "Alex Chen", 
      subject: "Physics",
      topic: "Newton's Laws of Motion",
      date: "2025-03-14",
      time: "2:00 PM",
      status: "completed"
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({
    studentName: "",
    subject: "",
    topic: "",
    date: "",
    time: ""
  });
  const { addNotification } = useNotifications();

  // Setup meeting notifications
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const now = new Date();
      const currentTime = now.getTime();

      sessions.forEach(session => {
        if (session.status === 'scheduled') {
          const sessionDateTime = new Date(`${session.date} ${session.time}`);
          const timeDiff = sessionDateTime.getTime() - currentTime;
          const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

          // Notify 10 minutes before the meeting
          if (minutesUntilMeeting === 10) {
            addNotification({
              type: 'warning',
              title: 'Meeting Reminder',
              message: `Meeting with ${session.studentName} at ${session.time}`,
              duration: 0 // Persistent until cleared
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkUpcomingMeetings, 60000);
    checkUpcomingMeetings(); // Check immediately

    return () => clearInterval(interval);
  }, [sessions, addNotification]);

  const addSession = () => {
    if (!newSession.studentName || !newSession.subject || !newSession.date || !newSession.time) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields.'
      });
      return;
    }
    
    const session = {
      ...newSession,
      id: Date.now(),
      status: "scheduled"
    };
    
    setSessions([...sessions, session]);
    setNewSession({ studentName: "", subject: "", topic: "", date: "", time: "" });
    setShowAddForm(false);
    
    addNotification({
      type: 'success',
      title: 'Session Scheduled',
      message: `Doubt session with ${session.studentName} scheduled for ${session.date} at ${session.time}`
    });
  };

  const updateSessionStatus = (sessionId, status) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, status } : session
    ));
  };

  const deleteSession = (sessionId) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Doubt Sessions</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Schedule and manage personalized student doubt-clearing sessions
          </p>
        </div>
        
        <MorphingButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
        >
          <AnimatedIcon icon="📅" animation="bounce" size={16} />
          Schedule Session
        </MorphingButton>
      </motion.div>

      {/* Add Session Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="indigo">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AnimatedIcon icon="➕" animation="rotate" />
                Schedule New Session
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={newSession.studentName}
                    onChange={(e) => setNewSession({...newSession, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newSession.subject}
                    onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mathematics, Physics, etc."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic/Doubt Area
                  </label>
                  <input
                    type="text"
                    value={newSession.topic}
                    onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Specific topic or area of confusion"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <MorphingButton
                  onClick={addSession}
                  variant="success"
                >
                  <AnimatedIcon icon="✅" animation="bounce" size={16} />
                  Schedule Session
                </MorphingButton>
                
                <MorphingButton
                  onClick={() => setShowAddForm(false)}
                  variant="secondary"
                >
                  Cancel
                </MorphingButton>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AnimatedIcon icon="📋" animation="float" />
          Scheduled Sessions
        </h3>
        
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <InteractiveCard 
                  className="p-6"
                  glowColor={
                    session.status === 'completed' ? 'green' :
                    session.status === 'scheduled' ? 'blue' : 'amber'
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-medium">
                        {session.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {session.studentName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {session.subject}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => deleteSession(session.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatedIcon icon="🗑️" animation="shake" size={16} />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    {session.topic && (
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">TOPIC</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.topic}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">DATE & TIME</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </p>
                      </div>
                      
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : session.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    {session.status === 'scheduled' && (
                      <div className="flex gap-2 pt-2">
                        <MorphingButton
                          onClick={() => updateSessionStatus(session.id, 'completed')}
                          variant="success"
                          size="sm"
                        >
                          <AnimatedIcon icon="✅" size={12} />
                          Complete
                        </MorphingButton>
                        
                        <MorphingButton
                          onClick={() => updateSessionStatus(session.id, 'cancelled')}
                          variant="danger"
                          size="sm"
                        >
                          <AnimatedIcon icon="❌" size={12} />
                          Cancel
                        </MorphingButton>
                      </div>
                    )}
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedIcon icon="📅" animation="float" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              No sessions scheduled
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start scheduling doubt-clearing sessions to help your students succeed.
            </p>
            <MorphingButton
              onClick={() => setShowAddForm(true)}
              variant="primary"
            >
              <AnimatedIcon icon="📅" animation="bounce" size={16} />
              Schedule Your First Session
            </MorphingButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoubtScheduler;