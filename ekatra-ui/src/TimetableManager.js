import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useNotifications } from "./components/NotificationSystem";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const TimetableManager = () => {
  const [timetable, setTimetable] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    subject: "",
    className: "",
    day: "",
    startTime: "",
    endTime: "",
    duration: 45,
    location: "",
    description: "",
    color: "#3B82F6"
  });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const classColors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", 
    "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16"
  ];

  useEffect(() => {
    fetchTimetable();
    setupAlerts();
  }, []);

  const fetchTimetable = async () => {
    try {
      const timetableCollection = collection(db, "timetable");
      const snapshot = await getDocs(timetableCollection);
      const timetableData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimetable(timetableData);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load timetable data.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupAlerts = () => {
    const checkUpcomingClasses = () => {
      const now = new Date();
      const currentDay = daysOfWeek[now.getDay() - 1]; // Adjust for Monday start
      const currentTime = now.getHours() * 60 + now.getMinutes();

      timetable.forEach(classItem => {
        if (classItem.day === currentDay) {
          const [startHour, startMinute] = classItem.startTime.split(':').map(Number);
          const classStartTime = startHour * 60 + startMinute;
          const timeDiff = classStartTime - currentTime;

          // Alert 5 minutes before class
          if (timeDiff > 0 && timeDiff <= 5) {
            addNotification({
              type: 'warning',
              title: 'Class Starting Soon',
              message: `${classItem.subject} - ${classItem.className} starts in ${timeDiff} minute(s)`,
              duration: 0 // Persistent until cleared
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkUpcomingClasses, 60000);
    checkUpcomingClasses(); // Check immediately

    return () => clearInterval(interval);
  };

  const addClass = async () => {
    if (!newClass.subject || !newClass.day || !newClass.startTime || !newClass.endTime) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "timetable"), {
        ...newClass,
        createdAt: new Date().toISOString()
      });

      const newClassWithId = { id: docRef.id, ...newClass };
      setTimetable([...timetable, newClassWithId]);
      
      setNewClass({
        subject: "",
        className: "",
        day: "",
        startTime: "",
        endTime: "",
        duration: 45,
        location: "",
        description: "",
        color: "#3B82F6"
      });
      setShowAddForm(false);

      addNotification({
        type: 'success',
        title: 'Class Added',
        message: 'Class has been added to your timetable!'
      });
    } catch (error) {
      console.error("Error adding class:", error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add class to timetable.'
      });
    }
  };

  const updateClass = async (classId, updates) => {
    try {
      await updateDoc(doc(db, "timetable", classId), updates);
      setTimetable(timetable.map(cls => 
        cls.id === classId ? { ...cls, ...updates } : cls
      ));
      
      addNotification({
        type: 'success',
        title: 'Class Updated',
        message: 'Class has been updated successfully!'
      });
    } catch (error) {
      console.error("Error updating class:", error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update class.'
      });
    }
  };

  const deleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db, "timetable", classId));
      setTimetable(timetable.filter(cls => cls.id !== classId));
      
      addNotification({
        type: 'success',
        title: 'Class Removed',
        message: 'Class has been removed from your timetable!'
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove class.'
      });
    }
  };

  const getTimetableByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day] = timetable
        .filter(cls => cls.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentClass = () => {
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return timetable.find(classItem => {
      if (classItem.day !== currentDay) return false;
      
      const [startHour, startMinute] = classItem.startTime.split(':').map(Number);
      const [endHour, endMinute] = classItem.endTime.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  const getNextClass = () => {
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Find next class today
    const todayClasses = timetable
      .filter(cls => cls.day === currentDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let classItem of todayClasses) {
      const [startHour, startMinute] = classItem.startTime.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      
      if (startTime > currentTime) {
        return classItem;
      }
    }

    // If no class today, find next class this week
    const currentDayIndex = daysOfWeek.indexOf(currentDay);
    for (let i = 1; i < 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = daysOfWeek[nextDayIndex];
      const nextDayClasses = timetable
        .filter(cls => cls.day === nextDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      
      if (nextDayClasses.length > 0) {
        return nextDayClasses[0];
      }
    }

    return null;
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();
  const timetableByDay = getTimetableByDay();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Timetable Manager</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your class schedule and get alerts before each class
          </p>
        </div>
        
        <MorphingButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
        >
          <AnimatedIcon icon="➕" animation="bounce" size={16} />
          Add Class
        </MorphingButton>
      </motion.div>

      {/* Current & Next Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Class */}
        <InteractiveCard className="p-6" glowColor={currentClass ? "green" : "gray"}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="🕐" animation="pulse" />
            Current Class
          </h3>
          
          {currentClass ? (
            <div className="space-y-2">
              <h4 className="font-bold text-lg" style={{ color: currentClass.color }}>
                {currentClass.subject}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {currentClass.className} • {currentClass.location}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(currentClass.startTime)} - {formatTime(currentClass.endTime)}
              </p>
              {currentClass.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {currentClass.description}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AnimatedIcon icon="😴" animation="float" size={48} />
              <p className="mt-2">No class scheduled right now</p>
            </div>
          )}
        </InteractiveCard>

        {/* Next Class */}
        <InteractiveCard className="p-6" glowColor={nextClass ? "blue" : "gray"}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="⏰" animation="bounce" />
            Next Class
          </h3>
          
          {nextClass ? (
            <div className="space-y-2">
              <h4 className="font-bold text-lg" style={{ color: nextClass.color }}>
                {nextClass.subject}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {nextClass.className} • {nextClass.location}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nextClass.day} • {formatTime(nextClass.startTime)} - {formatTime(nextClass.endTime)}
              </p>
              {nextClass.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {nextClass.description}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AnimatedIcon icon="🎉" animation="bounce" size={48} />
              <p className="mt-2">No upcoming classes this week</p>
            </div>
          )}
        </InteractiveCard>
      </div>

      {/* Add Class Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="purple">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AnimatedIcon icon="📝" animation="bounce" />
                Add New Class
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={newClass.className}
                    onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Grade 5A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day
                  </label>
                  <select
                    value={newClass.day}
                    onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newClass.location}
                    onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Room 101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {classColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewClass({...newClass, color})}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newClass.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newClass.description}
                    onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Additional notes about this class..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <MorphingButton
                  onClick={addClass}
                  variant="success"
                >
                  <AnimatedIcon icon="✅" animation="bounce" size={16} />
                  Add Class
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

      {/* Weekly Timetable */}
      <InteractiveCard className="p-6" glowColor="blue">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AnimatedIcon icon="📅" animation="float" />
          Weekly Timetable
        </h3>

        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                {day}
              </h4>
              
              {timetableByDay[day].length > 0 ? (
                <div className="space-y-2">
                  {timetableByDay[day].map(classItem => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: classItem.color }}
                        />
                        <div>
                          <h5 className="font-medium">{classItem.subject}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {classItem.className} • {classItem.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                        </span>
                        <button
                          onClick={() => deleteClass(classItem.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <AnimatedIcon icon="🗑️" animation="shake" size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No classes scheduled for {day}
                </p>
              )}
            </div>
          ))}
        </div>
      </InteractiveCard>
    </div>
  );
};

export default TimetableManager;