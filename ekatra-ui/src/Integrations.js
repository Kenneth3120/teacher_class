import React, { useState } from "react";
import { motion } from "framer-motion";
import GoogleClassroomService from "./services/GoogleClassroomService";
import GoogleMeetService from "./services/GoogleMeetService";
import { useNotifications } from "./components/NotificationSystem";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const Integrations = () => {
  const [integrations] = useState([
    {
      id: 1,
      name: "Google Workspace",
      description: "Connect with Google Drive, Docs, and Sheets",
      icon: "📊",
      status: "connected",
      color: "blue"
    },
    {
      id: 2,
      name: "Microsoft Teams",
      description: "Integrate with Teams for virtual classrooms",
      icon: "💻",
      status: "available",
      color: "purple"
    },
    {
      id: 3,
      name: "Zoom",
      description: "Schedule and manage video conferences",
      icon: "🎥",
      status: "available",
      color: "indigo"
    },
    {
      id: 4,
      name: "Slack",
      description: "Communication with staff and administrators",
      icon: "💬",
      status: "connected",
      color: "green"
    },
    {
      id: 5,
      name: "Canvas LMS",
      description: "Sync with your learning management system",
      icon: "🎓",
      status: "available",
      color: "amber"
    },
    {
      id: 6,
      name: "Khan Academy",
      description: "Access educational resources and exercises",
      icon: "📚",
      status: "available",
      color: "teal"
    }
  ]);

  const toggleIntegration = (integrationId) => {
    // In a real app, this would handle the actual integration
    console.log("Toggling integration:", integrationId);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Integrations</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with Google Workspace, LMS, and other educational tools
        </p>
      </motion.div>

      {/* Connected Integrations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AnimatedIcon icon="🔗" animation="float" />
          Connected Services
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.filter(int => int.status === 'connected').map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <InteractiveCard 
                className="p-6"
                glowColor={integration.color}
              >
                <div className="text-center space-y-4">
                  <AnimatedIcon
                    icon={integration.icon}
                    animation="bounce"
                    size={48}
                  />
                  
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {integration.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Connected
                    </span>
                  </div>
                  
                  <MorphingButton
                    onClick={() => toggleIntegration(integration.id)}
                    variant="danger"
                    size="sm"
                    className="w-full"
                  >
                    Disconnect
                  </MorphingButton>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AnimatedIcon icon="🔌" animation="glow" />
          Available Integrations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.filter(int => int.status === 'available').map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1, duration: 0.5 }}
            >
              <InteractiveCard 
                className="p-6"
                glowColor={integration.color}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ 
                      filter: [
                        "grayscale(1) brightness(0.7)",
                        "grayscale(0.5) brightness(0.85)",
                        "grayscale(1) brightness(0.7)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <AnimatedIcon
                      icon={integration.icon}
                      animation="float"
                      size={48}
                    />
                  </motion.div>
                  
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {integration.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Not Connected
                    </span>
                  </div>
                  
                  <MorphingButton
                    onClick={() => toggleIntegration(integration.id)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <AnimatedIcon icon="🔗" animation="bounce" size={16} />
                    Connect
                  </MorphingButton>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integration Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <InteractiveCard className="p-8" glowColor="purple">
          <div className="text-center space-y-4">
            <AnimatedIcon icon="⚡" animation="glow" size={64} />
            <h3 className="text-2xl font-bold gradient-text">
              Supercharge Your Teaching
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connect your favorite tools and platforms to create a seamless teaching experience. 
              Save time, reduce manual work, and focus on what matters most - your students.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: "⏱️", title: "Save Time", desc: "Automatic sync and data transfer" },
                { icon: "🔄", title: "Stay Synced", desc: "Real-time updates across platforms" },
                { icon: "📈", title: "Boost Productivity", desc: "Streamlined workflows and processes" }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  <AnimatedIcon
                    icon={benefit.icon}
                    animation="bounce"
                    size={32}
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-2 mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {benefit.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveCard>
      </motion.div>
    </div>
  );
};

export default Integrations;