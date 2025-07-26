import React, { useState } from "react";
import { motion } from "framer-motion";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const TimeSplitter = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [totalMinutes, setTotalMinutes] = useState(240);
  const [schedule, setSchedule] = useState([]);

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { name: newSubject.trim(), priority: 1 }]);
      setNewSubject("");
    }
  };

  const generateSchedule = () => {
    if (subjects.length === 0) return;
    
    const totalPriority = subjects.reduce((sum, s) => sum + s.priority, 0);
    const generatedSchedule = subjects.map(subject => ({
      ...subject,
      duration: Math.round((subject.priority / totalPriority) * totalMinutes),
    }));
    
    setSchedule(generatedSchedule);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Smart Time Splitter</h2>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered schedule optimization for multigrade classrooms
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <InteractiveCard className="p-6" glowColor="pink">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="📚" animation="bounce" />
            Add Subjects
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Time (minutes)
              </label>
              <input
                type="number"
                value={totalMinutes}
                onChange={(e) => setTotalMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter subject name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              />
              <MorphingButton onClick={addSubject} size="sm">
                Add
              </MorphingButton>
            </div>
            
            {subjects.length > 0 && (
              <div className="space-y-2">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Priority:</span>
                      <select
                        value={subject.priority}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[index].priority = parseInt(e.target.value);
                          setSubjects(updated);
                        }}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600"
                      >
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <MorphingButton 
              onClick={generateSchedule}
              disabled={subjects.length === 0}
              variant="primary"
              className="w-full"
            >
              <AnimatedIcon icon="⚡" animation="glow" size={16} />
              Generate Schedule
            </MorphingButton>
          </div>
        </InteractiveCard>

        {/* Schedule Display */}
        <InteractiveCard className="p-6" glowColor="amber">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="⏰" animation="float" />
            Generated Schedule
          </h3>
          
          {schedule.length > 0 ? (
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Priority: {item.priority === 1 ? 'Low' : item.priority === 2 ? 'Medium' : 'High'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {item.duration}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">minutes</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-center font-semibold text-green-800 dark:text-green-200">
                  Total: {schedule.reduce((sum, item) => sum + item.duration, 0)} minutes
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AnimatedIcon icon="📅" animation="float" size={48} />
              <p className="mt-2">Add subjects and generate your schedule</p>
            </div>
          )}
        </InteractiveCard>
      </div>
    </div>
  );
};

export default TimeSplitter;