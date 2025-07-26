import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useTheme } from "./components/ThemeContext";
import ParticleBackground from "./components/ParticleBackground";
import FloatingElements from "./components/FloatingElements";
import AnimatedIcon from "./components/AnimatedIcon";
import MorphingButton from "./components/MorphingButton";

export default function SignIn() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign‑in error:", err);
      alert("Failed to sign in: " + err.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleBackground type="network" theme={theme} />
      <FloatingElements theme={theme} />
      
      {/* Morphing background shape */}
      <motion.div
        className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-600/20 morphing-shape"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Another morphing shape */}
      <motion.div
        className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-600/20 morphing-shape"
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-full border border-white/20 z-50 hover:bg-white/20 dark:hover:bg-black/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedIcon
          icon={theme === 'dark' ? '☀️' : '🌙'}
          size={20}
          animation="rotate"
        />
      </motion.button>
      
      <div className="relative max-w-md w-full z-10">
        {/* Logo/Brand Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-glow-lg relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)"
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.span 
              className="text-white font-bold text-3xl relative z-10"
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
            
            {/* Animated particles inside logo */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold gradient-text mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to Ekatra
          </motion.h1>
          
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your AI-powered teaching assistant
          </motion.p>
        </motion.div>

        {/* Enhanced Sign In Card */}
        <motion.div
          className="glass rounded-4xl shadow-large p-8 border border-white/30 dark:border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: 0.4, 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -5
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))",
                "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))",
                "linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(59, 130, 246, 0.05))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="space-y-6 relative z-10">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign in to continue
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Access your personalized teaching dashboard
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <MorphingButton
                onClick={handleSignIn}
                variant="secondary"
                size="lg"
                className="w-full"
                loading={isSigningIn}
                disabled={isSigningIn}
              >
                {!isSigningIn && (
                  <>
                    <motion.svg 
                      className="w-5 h-5" 
                      viewBox="0 0 24 24"
                      whileHover={{ rotate: 5 }}
                    >
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </motion.svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </MorphingButton>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <motion.a 
                  href="#" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms of Service
                </motion.a>
                {' '}and{' '}
                <motion.a 
                  href="#" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Features Preview */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.p 
            className="text-sm text-gray-600 dark:text-gray-300 mb-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Trusted by educators worldwide
          </motion.p>
          <div className="flex justify-center space-x-8 text-xs text-gray-500 dark:text-gray-400">
            {[
              { icon: '🤖', text: 'AI Lesson Plans', color: 'green' },
              { icon: '⏰', text: 'Smart Scheduling', color: 'blue' },
              { icon: '👥', text: 'Student Management', color: 'purple' }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full flex items-center justify-center text-xs`}
                  style={{
                    backgroundColor: 
                      feature.color === 'green' ? '#10b981' :
                      feature.color === 'blue' ? '#3b82f6' : '#8b5cf6'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      `0 0 0 ${feature.color === 'green' ? '#10b981' : feature.color === 'blue' ? '#3b82f6' : '#8b5cf6'}`,
                      `0 0 10px ${feature.color === 'green' ? '#10b981' : feature.color === 'blue' ? '#3b82f6' : '#8b5cf6'}`,
                      `0 0 0 ${feature.color === 'green' ? '#10b981' : feature.color === 'blue' ? '#3b82f6' : '#8b5cf6'}`
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.5,
                    ease: "easeInOut" 
                  }}
                >
                  <AnimatedIcon
                    icon={feature.icon}
                    size={10}
                    animation="float"
                    color="white"
                  />
                </motion.div>
                <motion.span
                  whileHover={{ color: '#3b82f6' }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.text}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}