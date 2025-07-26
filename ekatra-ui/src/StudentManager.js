import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import LoadingSkeleton from "./components/LoadingSkeleton";

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    rating: "3",
    subjects: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsCollectionRef = collection(db, "students");
      const data = await getDocs(studentsCollectionRef);
      setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async () => {
    if (!newStudent.name || !newStudent.grade) return;
    
    try {
      const studentsCollectionRef = collection(db, "students");
      await addDoc(studentsCollectionRef, {
        ...newStudent,
        createdAt: new Date().toISOString()
      });
      
      setNewStudent({ name: "", grade: "", rating: "3", subjects: "" });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Student Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive student profiles and progress tracking
          </p>
        </div>
        
        <MorphingButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
        >
          <AnimatedIcon icon="➕" animation="rotate" size={16} />
          Add Student
        </MorphingButton>
      </motion.div>

      {/* Add Student Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 5th Grade"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Performance Rating
                  </label>
                  <select
                    value={newStudent.rating}
                    onChange={(e) => setNewStudent({...newStudent, rating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="1">1 - Needs Improvement</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Above Average</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjects
                  </label>
                  <input
                    type="text"
                    value={newStudent.subjects}
                    onChange={(e) => setNewStudent({...newStudent, subjects: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Math, Science, English..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <MorphingButton
                  onClick={addStudent}
                  variant="success"
                >
                  <AnimatedIcon icon="✅" animation="bounce" size={16} />
                  Add Student
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

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              layout
            >
              <InteractiveCard 
                className="p-6" 
                glowColor={
                  student.rating >= 4 ? "green" :
                  student.rating >= 3 ? "blue" : "amber"
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {student.grade}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => deleteStudent(student.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatedIcon icon="🗑️" animation="shake" size={16} />
                  </motion.button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Performance</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className={`text-lg ${i < student.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          animate={{ 
                            scale: i < student.rating ? [1, 1.2, 1] : 1,
                            rotate: i < student.rating ? [0, 10, -10, 0] : 0
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.1 
                          }}
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {student.subjects && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Subjects: </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.subjects}
                      </span>
                    </div>
                  )}
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {students.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedIcon icon="👥" animation="float" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            No students yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Add your first student to get started with management and tracking.
          </p>
          <MorphingButton
            onClick={() => setShowAddForm(true)}
            variant="primary"
          >
            <AnimatedIcon icon="➕" animation="bounce" size={16} />
            Add Your First Student
          </MorphingButton>
        </motion.div>
      )}
    </div>
  );
};

export default StudentManager;