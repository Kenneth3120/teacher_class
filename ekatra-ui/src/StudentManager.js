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
        alert('Invalid Google Sheets URL. Please provide a valid URL.\n\nExample: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit');
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
      if (!apiKey) {
        alert('Google Sheets API key is not configured. Please contact the administrator to set up the API key.');
        return;
      }
      
      console.log('Using API Key:', apiKey.substring(0, 20) + '...');
      const range = 'Sheet1!A:H'; // Adjust range as needed
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      console.log('Requesting URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Google Sheets API Response:', data);
      
      if (!response.ok) {
        console.error('Google Sheets API Error:', data);
        if (data.error) {
          let errorMessage = `Google Sheets API Error: ${data.error.message}\n\n`;
          
          if (data.error.code === 403) {
            errorMessage += `❌ API Access Issue:\n`;
            errorMessage += `The Google Sheets API is not enabled for this project.\n\n`;
            errorMessage += `📋 To fix this:\n`;
            errorMessage += `1. Go to Google Cloud Console\n`;
            errorMessage += `2. Navigate to APIs & Services > Library\n`;
            errorMessage += `3. Search for "Google Sheets API"\n`;
            errorMessage += `4. Click "Enable" for your project\n\n`;
            errorMessage += `🔄 Alternative: Make your Google Sheet publicly accessible (Anyone with the link can view)\n`;
            errorMessage += `Then try the import again.`;
          } else if (data.error.code === 400) {
            errorMessage += `❌ Bad Request:\n`;
            errorMessage += `Please check:\n`;
            errorMessage += `1. The sheet URL is correct\n`;
            errorMessage += `2. The sheet exists and has data\n`;
            errorMessage += `3. The range 'Sheet1!A:H' is valid`;
          } else {
            errorMessage += `Possible solutions:\n`;
            errorMessage += `1. Make sure the sheet is publicly accessible\n`;
            errorMessage += `2. Check if the API key has Google Sheets API enabled\n`;
            errorMessage += `3. Verify the sheet URL is correct`;
          }
          
          alert(errorMessage);
        } else {
          alert(`Failed to access Google Sheets. Status: ${response.status}\n\nPlease ensure:\n1. The sheet is shared publicly (Anyone with the link can view)\n2. The Google Sheets API is enabled for this project`);
        }
        return;
      }
      
      if (!data.values || data.values.length === 0) {
        alert('No data found in the sheet.\n\nPlease ensure:\n1. The sheet contains data\n2. The sheet is not empty\n3. Data is in the expected range (Sheet1!A:H)\n4. The first row contains headers: Name, Grade, Email, Subjects, etc.');
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
            Comprehensive student profiles with performance-based ratings and analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <MorphingButton
            onClick={() => setShowImportForm(!showImportForm)}
            variant="secondary"
          >
            <AnimatedIcon icon="📊" animation="bounce" size={16} />
            Import from Sheets
          </MorphingButton>
          
          <MorphingButton
            onClick={() => setShowAddForm(!showAddForm)}
            variant="primary"
          >
            <AnimatedIcon icon="➕" animation="rotate" size={16} />
            Add Student
          </MorphingButton>
        </div>
      </motion.div>

      {/* Performance Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <InteractiveCard className="p-4" glowColor="blue">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4 py-2">
              Filter by Performance:
            </span>
            {[
              { key: 'all', label: 'All Students', count: students.length },
              { key: 'excellent', label: 'Excellent', count: students.filter(s => getPerformanceBand(calculatePerformanceRating(s)).band === 'Excellent').length },
              { key: 'above-average', label: 'Above Average', count: students.filter(s => getPerformanceBand(calculatePerformanceRating(s)).band === 'Above Average').length },
              { key: 'average', label: 'Average', count: students.filter(s => getPerformanceBand(calculatePerformanceRating(s)).band === 'Average').length },
              { key: 'below-average', label: 'Below Average', count: students.filter(s => getPerformanceBand(calculatePerformanceRating(s)).band === 'Below Average').length },
              { key: 'needs-improvement', label: 'Needs Improvement', count: students.filter(s => getPerformanceBand(calculatePerformanceRating(s)).band === 'Needs Improvement').length }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
                <span className="ml-2 px-2 py-1 bg-black/10 rounded-full text-xs">
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
        </InteractiveCard>
      </motion.div>

      {/* Google Sheets Import Form */}
      <AnimatePresence>
        {showImportForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="purple">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AnimatedIcon icon="📊" animation="bounce" />
                  Import Students from Google Sheets
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                    📋 Required Sheet Format:
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Column A: Name | Column B: Grade | Column C: Email | Column D: Subjects<br/>
                    Column E: Average Score (0-100) | Column F: Completion Rate (0-100) | Column G: Participation (0-100)
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                    ⚠️ Important Setup Requirements:
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    1. Make your Google Sheet publicly accessible (Share > Anyone with the link can view)<br/>
                    2. Ensure Google Sheets API is enabled in your Google Cloud Console<br/>
                    3. First row should contain headers as specified above
                  </p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <MorphingButton
                    onClick={importFromGoogleSheets}
                    disabled={!sheetUrl || importLoading}
                    loading={importLoading}
                    variant="success"
                  >
                    {!importLoading && (
                      <AnimatedIcon icon="📥" animation="bounce" size={16} />
                    )}
                    Import
                  </MorphingButton>
                  <MorphingButton
                    onClick={() => setShowImportForm(false)}
                    variant="secondary"
                  >
                    Cancel
                  </MorphingButton>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Add Student Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="green">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name *
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
                    Grade *
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="student@email.com"
                  />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudent.averageScore}
                    onChange={(e) => setNewStudent({...newStudent, averageScore: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Completion Rate (0-100%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudent.completionRate}
                    onChange={(e) => setNewStudent({...newStudent, completionRate: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Participation (0-100%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudent.participation}
                    onChange={(e) => setNewStudent({...newStudent, participation: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignments Completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStudent.assignmentsCompleted}
                    onChange={(e) => setNewStudent({...newStudent, assignmentsCompleted: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-1">
                  <div className="pt-8 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Calculated Rating:
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      {calculatePerformanceRating(newStudent)}/5 ⭐
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getPerformanceBand(calculatePerformanceRating(newStudent)).band}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
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

      {/* Enhanced Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {getFilteredStudents().map((student, index) => {
            const rating = calculatePerformanceRating(student);
            const performanceBand = getPerformanceBand(rating);
            
            return (
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
                  glowColor={performanceBand.color}
                >
                  {/* Performance Band Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${performanceBand.bgColor} text-${performanceBand.color}-600`}>
                    {performanceBand.band}
                  </div>

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
                        {student.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.email}
                          </p>
                        )}
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
                  
                  {/* Enhanced Performance Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.span
                              key={i}
                              className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              animate={{ 
                                scale: i < rating ? [1, 1.2, 1] : 1,
                                rotate: i < rating ? [0, 10, -10, 0] : 0
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
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {rating}/5
                        </span>
                      </div>
                    </div>
                    
                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                        <div className="text-blue-600 dark:text-blue-400 font-medium">Average Score</div>
                        <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                          {student.averageScore || 75}%
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                        <div className="text-green-600 dark:text-green-400 font-medium">Completion</div>
                        <div className="text-lg font-bold text-green-800 dark:text-green-200">
                          {student.completionRate || 85}%
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                        <div className="text-purple-600 dark:text-purple-400 font-medium">Participation</div>
                        <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                          {student.participation || 80}%
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                        <div className="text-amber-600 dark:text-amber-400 font-medium">Assignments</div>
                        <div className="text-lg font-bold text-amber-800 dark:text-amber-200">
                          {student.assignmentsCompleted || 12}/{student.totalAssignments || 15}
                        </div>
                      </div>
                    </div>
                    
                    {student.subjects && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Subjects: </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.subjects}
                        </span>
                      </div>
                    )}

                    {student.importedFromSheets && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                        <AnimatedIcon icon="📊" size={12} />
                        <span>Imported from Google Sheets</span>
                      </div>
                    )}
                  </div>
                </InteractiveCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Enhanced Empty State */}
      {getFilteredStudents().length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedIcon 
            icon={selectedFilter === 'all' ? '👥' : '🔍'} 
            animation="float" 
            size={64} 
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            {selectedFilter === 'all' ? 'No students yet' : `No students in "${selectedFilter.replace('-', ' ')}" category`}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedFilter === 'all' 
              ? 'Add your first student to get started with management and tracking.'
              : 'Try a different filter or add more students to see data here.'
            }
          </p>
          {selectedFilter === 'all' && (
            <MorphingButton
              onClick={() => setShowAddForm(true)}
              variant="primary"
            >
              <AnimatedIcon icon="➕" animation="bounce" size={16} />
              Add Your First Student
            </MorphingButton>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StudentManager;