import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import GmailService from "./services/GmailService";
import { useNotifications } from "./components/NotificationSystem";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const ParentCommunicator = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      parentName: "Sarah Johnson",
      studentName: "Emma Johnson", 
      parentEmail: "sarah.johnson@email.com",
      message: "How is Emma doing in Math this week?",
      timestamp: "2 hours ago",
      status: "unread",
      type: "inquiry"
    },
    {
      id: 2,
      parentName: "Mike Chen",
      studentName: "Alex Chen",
      parentEmail: "mike.chen@email.com", 
      message: "Thank you for the progress report. Alex has improved significantly!",
      timestamp: "1 day ago",
      status: "read",
      type: "feedback"
    }
  ]);
  
  const [students, setStudents] = useState([]);
  const [newMessage, setNewMessage] = useState({
    parentEmail: "",
    studentName: "",
    subject: "",
    content: "",
    priority: "normal"
  });
  
  const [showCompose, setShowCompose] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const { addNotification } = useNotifications();

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
    }
  };

  // Send email using Gmail API
  const sendEmailViaGmail = async () => {
    if (!newMessage.parentEmail || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all required fields.');
      return;
    }

    setSendingEmail(true);
    setEmailStatus(null);

    try {
      // Create the email message
      const emailMessage = `From: teacher@ekatra-ai.com
To: ${newMessage.parentEmail}
Subject: ${newMessage.subject}

Dear Parent,

${newMessage.content}

Best regards,
${newMessage.studentName ? `${newMessage.studentName}'s Teacher` : 'Your Teacher'}
Ekatra AI Teaching Assistant

---
This message was sent via Ekatra AI Teaching Assistant.`;

      // Encode the message in base64url format
      const encodedMessage = btoa(emailMessage)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send via Gmail API
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedMessage
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Store message in Firebase for tracking
        await addDoc(collection(db, "parent_messages"), {
          parentEmail: newMessage.parentEmail,
          studentName: newMessage.studentName,
          subject: newMessage.subject,
          content: newMessage.content,
          priority: newMessage.priority,
          timestamp: new Date().toISOString(),
          gmailMessageId: result.id,
          status: 'sent',
          deliveryStatus: 'delivered'
        });

        setEmailStatus({
          type: 'success',
          message: 'Email sent successfully to parent!'
        });

        // Reset form
        setNewMessage({
          parentEmail: "",
          studentName: "",
          subject: "",
          content: "",
          priority: "normal"
        });
        
        setTimeout(() => {
          setShowCompose(false);
          setEmailStatus(null);
        }, 3000);

      } else {
        throw new Error(`Gmail API error: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus({
        type: 'error',
        message: `Failed to send email: ${error.message}. This feature requires OAuth authentication.`
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: "read" } : msg
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Parent Communication</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Streamlined messaging and updates for parent engagement
          </p>
        </div>
        
        <MorphingButton
          onClick={() => setShowCompose(!showCompose)}
          variant="primary"
        >
          <AnimatedIcon icon="✉️" animation="bounce" size={16} />
          Compose Message
        </MorphingButton>
      </motion.div>

      {/* Compose Message Form */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6" glowColor="green">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AnimatedIcon icon="📝" animation="float" />
                New Message
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient (Parent Email)
                  </label>
                  <input
                    type="email"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="parent@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Weekly Progress Update"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Write your message here..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <MorphingButton
                  onClick={sendEmailViaGmail}
                  variant="success"
                >
                  <AnimatedIcon icon="📤" animation="bounce" size={16} />
                  Send Message
                </MorphingButton>
                
                <MorphingButton
                  onClick={() => setShowCompose(false)}
                  variant="secondary"
                >
                  Cancel
                </MorphingButton>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AnimatedIcon icon="📬" animation="float" />
          Recent Messages
        </h3>
        
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <InteractiveCard 
              className={`p-6 cursor-pointer ${
                message.status === 'unread' 
                  ? 'ring-2 ring-blue-200 dark:ring-blue-800' 
                  : ''
              }`}
              glowColor={message.status === 'unread' ? 'blue' : 'gray'}
              onClick={() => markAsRead(message.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-medium">
                      {message.parentName.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {message.parentName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Parent of {message.studentName}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white mb-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.type === 'inquiry' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {message.type === 'inquiry' ? 'Question' : 'Feedback'}
                    </span>
                    {message.status === 'unread' && (
                      <motion.span
                        className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        New
                      </motion.span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <AnimatedIcon
                    icon={message.status === 'unread' ? '📩' : '📧'}
                    animation={message.status === 'unread' ? 'bounce' : 'float'}
                    size={24}
                  />
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      {messages.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedIcon icon="📬" animation="float" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start communicating with parents to keep them engaged and informed.
          </p>
          <MorphingButton
            onClick={() => setShowCompose(true)}
            variant="primary"
          >
            <AnimatedIcon icon="✉️" animation="bounce" size={16} />
            Send Your First Message
          </MorphingButton>
        </motion.div>
      )}
    </div>
  );
};

export default ParentCommunicator;