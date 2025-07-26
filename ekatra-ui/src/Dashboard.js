import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "./components/ThemeContext";
import { NotificationBell, useNotifications } from "./components/NotificationSystem";
import Settings from "./Settings";
import LessonPlan from "./LessonPlan";
import QuizGenerator from "./QuizGenerator";
import TimeSplitter from "./TimeSplitter";
import StudentManager from "./StudentManager";
import Alfred from "./Alfred";
import ParentCommunicator from "./ParentCommunicator";
import DoubtScheduler from "./DoubtScheduler";
import Integrations from "./Integrations";
import Translator from "./Translator";
import AskAgent from "./AskAgent";
import ParticleBackground from "./components/ParticleBackground";
import FloatingElements from "./components/FloatingElements";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import AnimatedCounter from "./components/AnimatedCounter";
import LoadingSkeleton from "./components/LoadingSkeleton";

// Enhanced Feature Card Component with advanced interactions
const FeatureCard = ({ icon, title, description, onClick, color = "blue", stats }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <InteractiveCard
        className="p-6 cursor-pointer h-full"
        glowColor={color}
        hoverable={true}
      >
        <div className="flex items-center justify-between mb-4">
          <AnimatedIcon
            icon={icon}
            size={32}
            animation="float"
            hover={true}
          />
          {stats && (
            <div className="text-right">
              <motion.div 
                className="text-2xl font-bold text-gray-900 dark:text-white"
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              >
                <AnimatedCounter end={stats.value} />
              </motion.div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{stats.label}</div>
            </div>
          )}
        </div>
        
        <motion.h3 
          className="text-lg font-semibold mb-2 text-gray-900 dark:text-white"
          animate={isHovered ? { x: 5 } : { x: 0 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {description}
        </motion.p>
        
        {/* Animated arrow */}
        <motion.div
          className="absolute bottom-4 right-4 text-gray-400"
          animate={isHovered ? { x: 5, opacity: 1 } : { x: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedIcon icon="→" size={16} animation="bounce" />
        </motion.div>
      </InteractiveCard>
    </motion.div>
  );
};

// Enhanced Stats Card Component with animations
const StatsCard = ({ title, value, subtitle, icon, trend }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <InteractiveCard className="p-6" glowColor="blue">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <AnimatedIcon
              icon={icon}
              size={20}
              animation="bounce"
              color="#3b82f6"
            />
          </motion.div>
          {trend && (
            <motion.div 
              className={`flex items-center text-sm ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ y: trend > 0 ? [0, -2, 0] : [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AnimatedIcon 
                  icon={trend > 0 ? "📈" : "📉"} 
                  size={16} 
                  animation="float" 
                />
              </motion.div>
              <span className="ml-1">
                <AnimatedCounter end={Math.abs(trend)} suffix="%" />
              </span>
            </motion.div>
          )}
        </div>
        
        <motion.h3 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {typeof value === 'number' ? (
            <AnimatedCounter end={value} />
          ) : (
            value
          )}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {title}
        </motion.p>
        
        {subtitle && (
          <motion.p 
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}
      </InteractiveCard>
    </motion.div>
  );
};

const Dashboard = ({ user }) => {
  const [screen, setScreen] = useState("home");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollectionRef = collection(db, "students");
        const data = await getDocs(studentsCollectionRef);
        const studentsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setStudents(studentsData);
        
        // Welcome notification
        if (studentsData.length > 0) {
          addNotification({
            type: 'info',
            title: 'Welcome back!',
            message: `You have ${studentsData.length} students in your classes.`,
            duration: 4000
          });
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load student data.',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [addNotification]);

  const features = [
    {
      id: "lesson-plan",
      icon: "📚",
      title: "Lesson Plan Generator",
      description: "Create engaging, curriculum-aligned lesson plans with AI assistance.",
      color: "purple",
      component: <LessonPlan />,
    },
    {
      id: "quiz",
      icon: "🎯",
      title: "Assessment & Quiz Generator",
      description: "Design personalized quizzes and assessments for your students.",
      color: "amber",
      component: <QuizGenerator />,
    },
    {
      id: "schedule",
      icon: "⏰",
      title: "Smart Time Splitter",
      description: "AI-powered schedule optimization for multigrade classrooms.",
      color: "pink",
      component: <TimeSplitter />,
    },
    {
      id: "students",
      icon: "👥",
      title: "Student Management",
      description: "Comprehensive student profiles, progress tracking, and analytics.",
      color: "green",
      component: <StudentManager />,
      stats: { value: students.length, label: "Students" }
    },
    {
      id: "alfred",
      icon: "🤖",
      title: "Alfred AI Assistant",
      description: "Your intelligent teaching companion for instant help and guidance.",
      color: "blue",
      component: <Alfred />,
    },
    {
      id: "parent-comm",
      icon: "💬",
      title: "Parent Communication",
      description: "Streamlined messaging and updates for parent engagement.",
      color: "orange",
      component: <ParentCommunicator />,
    },
    {
      id: "doubt-scheduler",
      icon: "📅",
      title: "Doubt Sessions",
      description: "Schedule and manage personalized student doubt-clearing sessions.",
      color: "indigo",
      component: <DoubtScheduler />,
    },
    {
      id: "integrations",
      icon: "🔗",
      title: "Integrations",
      description: "Connect with Google Workspace, LMS, and other educational tools.",
      color: "gray",
      component: <Integrations />,
    },
    {
      id: "translator",
      icon: "🌐",
      title: "Multi-language Support",
      description: "Translate content and communicate in multiple languages.",
      color: "cyan",
      component: <Translator />,
    },
    {
      id: "ask-agent",
      icon: "🤔",
      title: "Ask Agent",
      description: "Get instant answers to your teaching questions from AI.",
      color: "red",
      component: <AskAgent />,
    },
    {
      id: "settings",
      icon: "⚙️",
      title: "Settings & Profile",
      description: "Manage your account, preferences, and teaching profile.",
      color: "teal",
      component: <Settings user={user} />,
    },
  ];

  const renderNavBar = () => (
    <motion.header 
      className="glass sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 30px rgba(139, 92, 246, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AnimatedIcon
                icon="E"
                size={20}
                animation="glow"
                color="white"
              />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold gradient-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {user?.displayName?.split(' ')[0] || "Teacher"}! 
                <AnimatedIcon icon="👋" size={20} animation="bounce" />
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Ready to inspire minds today?
              </motion.p>
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <motion.div 
            className="hidden md:flex items-center space-x-2 glass rounded-xl px-3 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">All systems operational</span>
          </motion.div>
          
          {/* Notification Bell */}
          <NotificationBell />
          
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 glass rounded-xl hover:bg-white/10 dark:hover:bg-black/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8 }}
          >
            <AnimatedIcon
              icon={theme === 'dark' ? '☀️' : '🌙'}
              size={20}
              animation="rotate"
            />
          </motion.button>
          
          {/* Profile */}
          <motion.button 
            onClick={() => setScreen("settings")}
            className="flex items-center space-x-2 glass rounded-xl px-4 py-2 hover:bg-white/10 dark:hover:bg-black/10 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-medium">
              {user?.displayName?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || "User"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Teacher</div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <AnimatedIcon icon="⚙️" size={16} animation="rotate" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );

  const renderHome = () => {
    const avgRating = students.length > 0 
      ? (students.reduce((acc, s) => acc + (parseInt(s.rating) || 0), 0) / students.length).toFixed(1)
      : "0.0";

    if (loading) {
      return (
        <div className="space-y-8">
          <div className="text-center py-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="stats" count={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Welcome Section */}
        <motion.div 
          className="text-center py-8 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Background floating elements */}
          <FloatingElements theme={theme} />
          
          <motion.h2 
            className="text-4xl font-bold gradient-text mb-4"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Your Teaching Dashboard
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Streamline your teaching workflow with AI-powered tools designed for modern educators.
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <StatsCard
            title="Total Students"
            value={students.length}
            subtitle="Active in your classes"
            icon="👥"
            trend={5}
          />
          <StatsCard
            title="Class Average"
            value={`${avgRating}/5`}
            subtitle="Student performance rating"
            icon="⭐"
            trend={2}
          />
          <StatsCard
            title="Lessons Created"
            value={24}
            subtitle="This month"
            icon="📚"
            trend={12}
          />
          <StatsCard
            title="Time Saved"
            value="15h"
            subtitle="With AI assistance"
            icon="⏱️"
            trend={8}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <InteractiveCard className="p-8" glowColor="blue">
            <motion.h3 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <AnimatedIcon icon="⚡" animation="glow" size={28} />
              Quick Actions
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "lesson-plan", icon: "📚", title: "Create Lesson Plan", desc: "Generate AI-powered lessons", color: "purple" },
                { id: "students", icon: "👥", title: "Manage Students", desc: "View and update profiles", color: "green" },
                { id: "alfred", icon: "🤖", title: "Ask Alfred", desc: "Get AI assistance", color: "blue" }
              ].map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <MorphingButton
                    onClick={() => setScreen(action.id)}
                    variant="secondary"
                    className="w-full h-auto p-4 flex flex-col items-center text-center space-y-2"
                  >
                    <AnimatedIcon icon={action.icon} size={32} animation="bounce" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{action.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{action.desc}</div>
                    </div>
                  </MorphingButton>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <AnimatedIcon icon="🚀" animation="float" size={28} />
            All Features
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.05, duration: 0.5 }}
                  layout
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    stats={feature.stats}
                    onClick={() => setScreen(feature.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderBackButton = () => (
    <motion.button
      onClick={() => setScreen("home")}
      className="inline-flex items-center mb-6 px-6 py-3 glass rounded-2xl text-gray-700 dark:text-gray-300 font-medium shadow-soft hover:shadow-medium border border-white/20 dark:border-gray-700/20 group"
      whileHover={{ x: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ x: [-2, 0, -2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatedIcon icon="←" size={20} animation="bounce" />
      </motion.div>
      <span className="ml-2">Back to Dashboard</span>
    </motion.button>
  );

  const renderScreen = () => {
    if (screen === "home") {
      return renderHome();
    }

    const activeFeature = features.find((f) => f.id === screen);
    if (activeFeature && activeFeature.component) {
      return (
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {renderBackButton()}
          <InteractiveCard className="shadow-large border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {activeFeature.component}
            </motion.div>
          </InteractiveCard>
        </motion.div>
      );
    }

    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleBackground type="floating" theme={theme} />
      <FloatingElements theme={theme} />
      
      {/* Morphing background shapes */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 morphing-shape opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 morphing-shape opacity-50"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <div className="relative z-10">
        {renderNavBar()}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;