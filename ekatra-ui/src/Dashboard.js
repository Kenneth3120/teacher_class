import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
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

// Enhanced Feature Card Component
const FeatureCard = ({ icon, title, description, onClick, color = "blue", stats }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25",
    teal: "from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-teal-500/25",
    purple: "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/25",
    amber: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25",
    pink: "from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/25",
    green: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25",
    orange: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/25",
    indigo: "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/25",
    gray: "from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 shadow-gray-500/25",
    cyan: "from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/25",
  };

  return (
    <button
      className={`group relative bg-gradient-to-br ${colorClasses[color]} text-white rounded-2xl shadow-large hover:shadow-xl p-6 flex flex-col items-start transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className="text-3xl opacity-90 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.value}</div>
            <div className="text-xs opacity-75">{stats.label}</div>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-white/95">{title}</h3>
      <p className="text-sm opacity-90 group-hover:opacity-100 leading-relaxed">{description}</p>
      
      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, trend }) => (
  <div className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
        <div className="text-blue-600 text-xl">{icon}</div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <svg className={`w-4 h-4 mr-1 ${trend > 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10H7" />
          </svg>
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 font-medium">{title}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    }
  </div>
);

const Dashboard = ({ user }) => {
  const [screen, setScreen] = useState("home");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStudents();
  }, []);

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
      id: "settings",
      icon: "⚙️",
      title: "Settings & Profile",
      description: "Manage your account, preferences, and teaching profile.",
      color: "teal",
      component: <Settings user={user} />,
    },
  ];

  const renderNavBar = () => (
    <header className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.displayName?.split(' ')[0] || "Teacher"}! 👋
              </h1>
              <p className="text-sm text-gray-600">Ready to inspire minds today?</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
          
          <button 
            onClick={() => setScreen("settings")}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl px-4 py-2 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-medium">
              {user?.displayName?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">{user?.displayName || "User"}</div>
              <div className="text-xs text-gray-500">Teacher</div>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );

  const renderHome = () => {
    const avgRating = students.length > 0 
      ? (students.reduce((acc, s) => acc + (parseInt(s.rating) || 0), 0) / students.length).toFixed(1)
      : "0.0";

    return (
      <div className="space-y-8 fade-in">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Teaching Dashboard</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your teaching workflow with AI-powered tools designed for modern educators.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={loading ? "..." : students.length}
            subtitle="Active in your classes"
            icon="👥"
            trend={5}
          />
          <StatsCard
            title="Class Average"
            value={loading ? "..." : `${avgRating}/5`}
            subtitle="Student performance rating"
            icon="⭐"
            trend={2}
          />
          <StatsCard
            title="Lessons Created"
            value="24"
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
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setScreen("lesson-plan")}
              className="flex items-center space-x-3 bg-white hover:bg-gray-50 rounded-xl p-4 transition-all duration-200 group shadow-soft hover:shadow-medium"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-purple-600">📚</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Create Lesson Plan</div>
                <div className="text-sm text-gray-500">Generate AI-powered lessons</div>
              </div>
            </button>
            
            <button 
              onClick={() => setScreen("students")}
              className="flex items-center space-x-3 bg-white hover:bg-gray-50 rounded-xl p-4 transition-all duration-200 group shadow-soft hover:shadow-medium"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-green-600">👥</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Manage Students</div>
                <div className="text-sm text-gray-500">View and update profiles</div>
              </div>
            </button>
            
            <button 
              onClick={() => setScreen("alfred")}
              className="flex items-center space-x-3 bg-white hover:bg-gray-50 rounded-xl p-4 transition-all duration-200 group shadow-soft hover:shadow-medium"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-blue-600">🤖</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Ask Alfred</div>
                <div className="text-sm text-gray-500">Get AI assistance</div>
              </div>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">All Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                stats={feature.stats}
                onClick={() => setScreen(feature.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBackButton = () => (
    <button
      onClick={() => setScreen("home")}
      className="inline-flex items-center mb-6 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl text-gray-700 font-medium shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 group"
    >
      <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Dashboard
    </button>
  );

  const renderScreen = () => {
    if (screen === "home") {
      return renderHome();
    }

    const activeFeature = features.find((f) => f.id === screen);
    if (activeFeature && activeFeature.component) {
      return (
        <div className="fade-in">
          {renderBackButton()}
          <div className="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
            {activeFeature.component}
          </div>
        </div>
      );
    }

    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {renderNavBar()}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Dashboard;