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
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sheetUrl, setSheetUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    email: "",
    subjects: "",
    averageScore: 75,
    completionRate: 85,
    participation: 80,
    assignmentsCompleted: 12,
    totalAssignments: 15
  });

  // Enhanced rating calculation based on performance metrics
  const calculatePerformanceRating = (student) => {
    const scores = {
      averageScore: (student.averageScore || 75) / 20, // Convert to 0-5 scale
      completionRate: (student.completionRate || 85) / 20,
      participation: (student.participation || 80) / 20
    };
    
    // Weighted calculation
    const weights = { averageScore: 0.4, completionRate: 0.35, participation: 0.25 };
    const totalScore = 
      scores.averageScore * weights.averageScore +
      scores.completionRate * weights.completionRate +
      scores.participation * weights.participation;
    
    return Math.round(Math.min(5, Math.max(1, totalScore)));
  };

  // Get performance band based on rating
  const getPerformanceBand = (rating) => {
    if (rating >= 4.5) return { band: 'Excellent', color: 'green', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    if (rating >= 3.5) return { band: 'Above Average', color: 'blue', bgColor: 'bg-blue-100 dark:bg-blue-900/20' };
    if (rating >= 2.5) return { band: 'Average', color: 'yellow', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    if (rating >= 1.5) return { band: 'Below Average', color: 'orange', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
    return { band: 'Needs Improvement', color: 'red', bgColor: 'bg-red-100 dark:bg-red-900/20' };
  };

  // Filter students by performance band
  const getFilteredStudents = () => {
    if (selectedFilter === 'all') return students;
    
    return students.filter(student => {
      const rating = calculatePerformanceRating(student);
      const band = getPerformanceBand(rating).band;
      
      switch (selectedFilter) {
        case 'excellent': return band === 'Excellent';
        case 'above-average': return band === 'Above Average';
        case 'average': return band === 'Average';
        case 'below-average': return band === 'Below Average';
        case 'needs-improvement': return band === 'Needs Improvement';
        default: return true;
      }
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsCollectionRef = collection(db, "students");
      const data = await getDocs(studentsCollectionRef);
      const studentsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStudents(studentsData);
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
      const studentData = {
        ...newStudent,
        rating: calculatePerformanceRating(newStudent),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      await addDoc(studentsCollectionRef, studentData);
      
      setNewStudent({
        name: "",
        grade: "",
        email: "",
        subjects: "",
        averageScore: 75,
        completionRate: 85,
        participation: 80,
        assignmentsCompleted: 12,
        totalAssignments: 15
      });
      setShowAddForm(false);
      fetchStudents(); // Real-time update
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      fetchStudents(); // Real-time update
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Google Sheets import functionality
  const importFromGoogleSheets = async () => {
    if (!sheetUrl) return;
    
    setImportLoading(true);
    try {
      // Extract the sheet ID from the URL
      const sheetId = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (!sheetId) {
        alert('Invalid Google Sheets URL. Please provide a valid URL.');
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
      const range = 'Sheet1!A:H'; // Adjust range as needed
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.values) {
        alert('No data found in the sheet or sheet is private.');
        return;
      }

      // Assume first row is headers: Name, Grade, Email, Subjects, Average Score, Completion Rate, Participation
      const rows = data.values.slice(1); // Skip header row
      const studentsCollectionRef = collection(db, "students");
      
      for (const row of rows) {
        if (row[0] && row[1]) { // At least name and grade required
          const studentData = {
            name: row[0] || '',
            grade: row[1] || '',
            email: row[2] || '',
            subjects: row[3] || '',
            averageScore: parseInt(row[4]) || 75,
            completionRate: parseInt(row[5]) || 85,
            participation: parseInt(row[6]) || 80,
            assignmentsCompleted: parseInt(row[7]) || 12,
            totalAssignments: 15,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            importedFromSheets: true
          };
          studentData.rating = calculatePerformanceRating(studentData);
          
          await addDoc(studentsCollectionRef, studentData);
        }
      }
      
      fetchStudents(); // Real-time update
      setSheetUrl('');
      setShowImportForm(false);
      alert(`Successfully imported ${rows.length} students from Google Sheets!`);
    } catch (error) {
      console.error("Error importing from Google Sheets:", error);
      alert('Failed to import from Google Sheets. Please check the URL and try again.');
    } finally {
      setImportLoading(false);
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