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

// --- Reusable Feature Card Component ---
const FeatureCard = ({ icon, title, description, onClick, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:ring-blue-300",
    teal: "from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 focus:ring-teal-200",
    purple: "from-purple-600 to-indigo-400 hover:from-purple-700 hover:to-indigo-500 focus:ring-purple-300",
    amber: "from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 focus:ring-amber-200",
    pink: "from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 focus:ring-pink-200",
    green: "from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 focus:ring-green-200",
    orange: "from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 focus:ring-orange-200",
    indigo: "from-indigo-500 to-violet-400 hover:from-indigo-600 hover:to-violet-500 focus:ring-indigo-200",
    gray: "from-gray-500 to-slate-400 hover:from-gray-600 hover:to-slate-500 focus:ring-gray-200",
    cyan: "from-cyan-500 to-sky-400 hover:from-cyan-600 hover:to-sky-500 focus:ring-cyan-200",
  };

  return (
    <button
      className={`relative group bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl shadow-lg p-7 flex flex-col items-start transition-all outline-none focus:ring-4`}
      onClick={onClick}
    >
      <span className="text-3xl mb-3">{icon}</span>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm opacity-90">{description}</p>
    </button>
  );
};

// --- Placeholder Screen Components ---
const PlaceholderScreen = ({ title }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="mt-2 text-gray-600">This feature is under construction.</p>
  </div>
);

const Dashboard = ({ user }) => {
  const [screen, setScreen] = useState("home");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollectionRef = collection(db, "students");
      const data = await getDocs(studentsCollectionRef);
      setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchStudents();
  }, []);

  const features = [
    {
      id: "lesson-plan",
      icon: "📝",
      title: "Lesson Plan Generator",
      description: "Create engaging lesson plans.",
      color: "purple",
      component: <LessonPlan />,
    },
    {
      id: "quiz",
      icon: "❓",
      title: "Assessment & Quiz Generator",
      description: "Design quizzes and assessments.",
      color: "amber",
      component: <QuizGenerator />,
    },
    {
      id: "schedule",
      icon: "⏰",
      title: "Multigrade Time Splitter",
      description: "AI-powered schedule management.",
      color: "pink",
      component: <TimeSplitter />,
    },
    {
      id: "students",
      icon: "🎓",
      title: "Student Management",
      description: "Manage student profiles and data.",
      color: "green",
      component: <StudentManager />,
    },
    {
      id: "alfred",
      icon: "🤖",
      title: "Alfred",
      description: "Your AI Assistant.",
      color: "blue",
      component: <Alfred />,
    },
    {
      id: "parent-comm",
      icon: "✉️",
      title: "Parent Communicator",
      description: "Send messages to parents.",
      color: "orange",
      component: <ParentCommunicator />,
    },
    {
      id: "doubt-scheduler",
      icon: "📅",
      title: "Doubt Scheduler",
      description: "Schedule personal doubt sessions.",
      color: "indigo",
      component: <DoubtScheduler />,
    },
    {
      id: "integrations",
      icon: "🔗",
      title: "Integrations",
      description: "Connect to Google & LMS.",
      color: "gray",
      component: <Integrations />,
    },
    {
      id: "translator",
      icon: "🌐",
      title: "Translator",
      description: "Translate text between languages.",
      color: "cyan",
      component: <Translator />,
    },
    {
      id: "settings",
      icon: "⚙️",
      title: "Settings",
      description: "Manage your profile & preferences.",
      color: "teal",
      component: <Settings user={user} />,
    },
  ];

  const renderNavBar = () => (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Hi, {user?.displayName || "User"}!</h1>
        <div className="flex items-center space-x-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-semibold">
            {user?.displayName?.charAt(0) || "U"}
          </span>
        </div>
      </div>
    </header>
  );

  const renderHome = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold">Student Overview</h3>
          <p>{students.length} students</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold">Upcoming Reminders</h3>
          <p>No reminders set.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold">Class Average Rating</h3>
          <p>
            {(
              students.reduce((acc, s) => acc + (parseInt(s.rating) || 0), 0) /
              students.length || 0
            ).toFixed(1)}
            / 5
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => (feature.component ? setScreen(feature.id) : feature.onClick())}
          />
        ))}
      </div>
    </div>
  );

  const renderBackButton = () => (
    <button
      onClick={() => setScreen("home")}
      className="inline-flex items-center mt-1 mb-6 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition ring-2 ring-transparent focus:ring-blue-300"
    >
      <span className="mr-2 text-lg">←</span>
      Back to Home
    </button>
  );

  const renderScreen = () => {
    if (screen === "home") {
      return renderHome();
    }

    const activeFeature = features.find((f) => f.id === screen);
    if (activeFeature && activeFeature.component) {
      return (
        <div>
          {renderBackButton()}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeFeature.component}
          </div>
        </div>
      );
    }

    // Fallback for any unknown screen state
    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50">
      {renderNavBar()}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Dashboard;
