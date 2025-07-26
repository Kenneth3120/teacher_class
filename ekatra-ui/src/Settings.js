import React from "react";
import { motion } from "framer-motion";
import { auth } from "./firebase";
import { useTheme } from "./components/ThemeContext";
import MorphingButton from "./components/MorphingButton";
import InteractiveCard from "./components/InteractiveCard";
import AnimatedIcon from "./components/AnimatedIcon";

const Settings = ({ user }) => {
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Settings & Profile</h2>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <InteractiveCard className="p-6" glowColor="blue">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AnimatedIcon icon="👤" animation="float" />
              Profile Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-medium">
                  {user?.displayName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Teacher</p>
                </div>
              </div>
            </div>
          </motion.div>
        </InteractiveCard>

        {/* Preferences Section */}
        <InteractiveCard className="p-6" glowColor="purple">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AnimatedIcon icon="⚙️" animation="rotate" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Toggle between light and dark themes</p>
                </div>
                <motion.button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    animate={{ x: theme === 'dark' ? 6 : 1 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </InteractiveCard>
      </div>

      {/* Account Actions */}
      <InteractiveCard className="p-6" glowColor="red">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="🔐" animation="shake" />
            Account Actions
          </h3>
          <div className="flex gap-4">
            <MorphingButton
              onClick={handleSignOut}
              variant="danger"
              size="md"
            >
              <AnimatedIcon icon="🚪" animation="bounce" size={16} />
              Sign Out
            </MorphingButton>
          </div>
        </motion.div>
      </InteractiveCard>
    </div>
  );
};

export default Settings;