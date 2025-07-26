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
      name: "Google Classroom",
      description: "Sync students and assignments from Google Classroom",
      icon: "🎓",
      status: "available",
      color: "green"
    },
    {
      id: 3,
      name: "Google Meet",
      description: "Schedule and manage video conferences",
      icon: "🎥",
      status: "available",
      color: "indigo"
    },
    {
      id: 4,
      name: "Microsoft Teams",
      description: "Integrate with Teams for virtual classrooms",
      icon: "💻",
      status: "available",
      color: "purple"
    },
    {
      id: 5,
      name: "Zoom",
      description: "Schedule and manage video conferences",
      icon: "🎥",
      status: "available",
      color: "indigo"
    },
    {
      id: 6,
      name: "Slack",
      description: "Communication with staff and administrators",
      icon: "💬",
      status: "connected",
      color: "green"
    },
    {
      id: 7,
      name: "Canvas LMS",
      description: "Sync with your learning management system",
      icon: "🎓",
      status: "available",
      color: "amber"
    },
    {
      id: 8,
      name: "Khan Academy",
      description: "Access educational resources and exercises",
      icon: "📚",
      status: "available",
      color: "teal"
    }
  ]);
  
  const [classroomData, setClassroomData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const toggleIntegration = async (integrationId) => {
    const integration = integrations.find(int => int.id === integrationId);
    
    if (integration.name === "Google Classroom") {
      await connectGoogleClassroom();
    } else if (integration.name === "Google Meet") {
      await testGoogleMeet();
    } else {
      // For other integrations, just show a placeholder
      addNotification({
        type: 'info',
        title: 'Coming Soon',
        message: `${integration.name} integration is coming soon!`
      });
    }
  };

  const connectGoogleClassroom = async () => {
    setIsLoading(true);
    try {
      addNotification({
        type: 'info',
        title: 'Connecting to Google Classroom',
        message: 'Fetching your courses...'
      });

      const courses = await GoogleClassroomService.getCourses();
      
      if (courses.courses && courses.courses.length > 0) {
        const firstCourse = courses.courses[0];
        const students = await GoogleClassroomService.syncStudentsFromClassroom(firstCourse.id);
        
        setClassroomData({
          courses: courses.courses,
          students: students,
          connectedAt: new Date().toISOString()
        });

        addNotification({
          type: 'success',
          title: 'Google Classroom Connected',
          message: `Successfully connected to ${courses.courses.length} course(s) and synced ${students.length} student(s)`
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'No Courses Found',
          message: 'No active courses found in your Google Classroom account'
        });
      }
    } catch (error) {
      console.error('Error connecting to Google Classroom:', error);
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error.message.includes('authentication') 
          ? 'Please sign in to Google and grant necessary permissions.'
          : 'Failed to connect to Google Classroom. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleMeet = async () => {
    setIsLoading(true);
    try {
      addNotification({
        type: 'info',
        title: 'Testing Google Meet',
        message: 'Creating a test meeting...'
      });

      const meetingDetails = {
        title: 'Test Meeting - Ekatra AI',
        description: 'This is a test meeting created by Ekatra AI',
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        attendees: []
      };

      const meeting = await GoogleMeetService.createMeeting(meetingDetails);
      const meetLink = GoogleMeetService.extractMeetLink(meeting);

      addNotification({
        type: 'success',
        title: 'Google Meet Connected',
        message: `Test meeting created successfully! ${meetLink ? 'Meet link generated.' : ''}`,
        duration: 7000
      });
      
      if (meetLink) {
        console.log('Meet Link:', meetLink);
      }
    } catch (error) {
      console.error('Error testing Google Meet:', error);
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error.message.includes('authentication') 
          ? 'Please sign in to Google and grant calendar permissions.'
          : 'Failed to connect to Google Meet. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
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

      {/* Google Classroom Data */}
      {classroomData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <InteractiveCard className="p-6" glowColor="green">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AnimatedIcon icon="🎓" animation="bounce" />
              Google Classroom Data
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Courses ({classroomData.courses.length})</h4>
                <div className="space-y-2">
                  {classroomData.courses.slice(0, 3).map(course => (
                    <div key={course.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white">{course.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.section}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Students ({classroomData.students.length})</h4>
                <div className="space-y-2">
                  {classroomData.students.slice(0, 3).map(student => (
                    <div key={student.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white">{student.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{student.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      )}

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