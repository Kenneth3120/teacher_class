import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "./firebase";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import { ThemeProvider } from "./components/ThemeContext";
import { NotificationProvider } from "./components/NotificationSystem";
import ParticleBackground from "./components/ParticleBackground";
import FloatingElements from "./components/FloatingElements";
import "./i18n"; // Initialize i18n

// Enhanced loading component
const EnhancedLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center relative overflow-hidden">
    <ParticleBackground type="floating" />
    <FloatingElements />
    
    <motion.div
      className="relative z-10 flex flex-col items-center space-y-6"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated logo */}
      <motion.div
        className="relative"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-glow relative overflow-hidden">
          <motion.span 
            className="text-white font-bold text-3xl"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.8)",
                "0 0 10px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            E
          </motion.span>
          
          {/* Rotating border */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            style={{ 
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude" 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
      
      {/* Loading text with typewriter effect */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold gradient-text">
          Ekatra
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Loading your AI teaching assistant...
        </p>
      </motion.div>
      
      {/* Animated loading bar */}
      <motion.div
        className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      {/* Floating dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  </div>
);

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthChecked(true);
      
      // Add a minimum loading time for better UX
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
    
    return unsubscribe;
  }, []);

  if (loading || !authChecked) {
    return <EnhancedLoader />;
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="relative min-h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="relative z-10"
              >
                <Dashboard user={user} />
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="relative z-10"
              >
                <SignIn />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
}
