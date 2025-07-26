import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import MarkdownRenderer from "./components/MarkdownRenderer";
import VoiceInterface from "./components/VoiceInterface";

const Alfred = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const speakResponseRef = useRef(null);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;
    
    const userMessage = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await getGenerativeContent(
        `You are Alfred, an AI teaching assistant. Help the teacher with their question: ${messageText}`
      );
      
      const aiMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if voice interface is active
      if (showVoiceInterface && speakResponseRef.current) {
        speakResponseRef.current(response);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble responding right now. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = (transcript) => {
    setInput(transcript);
    sendMessage(transcript);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
          <AnimatedIcon icon="🤖" animation="float" size={32} />
          Alfred AI Assistant
          <motion.button
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className={`ml-auto p-2 rounded-xl text-sm ${
              showVoiceInterface 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatedIcon 
              icon={showVoiceInterface ? "🎤" : "🔊"} 
              size={16} 
              animation={showVoiceInterface ? "pulse" : "float"}
            />
          </motion.button>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your intelligent teaching companion for instant help and guidance
          {showVoiceInterface && (
            <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-medium">
              🎤 Voice Mode Active
            </span>
          )}
        </p>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatedIcon icon="💬" animation="bounce" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                Hello! I'm Alfred
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask me anything about teaching, lesson planning, or student management!
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`w-full max-w-4xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  <InteractiveCard
                    className={`p-4 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                        : ''
                    }`}
                    glowColor={message.role === 'user' ? 'blue' : 'purple'}
                    hoverable={false}
                  >
                    <div className="flex items-start gap-3">
                      <AnimatedIcon
                        icon={message.role === 'user' ? '👤' : '🤖'}
                        animation="float"
                        size={24}
                        color={message.role === 'user' ? 'white' : 'currentColor'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          message.role === 'user' 
                            ? 'text-white/90' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {message.role === 'user' ? 'You' : 'Alfred'}
                        </p>
                        <div className={`mt-1 ${
                          message.role === 'user' 
                            ? 'text-white' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {message.role === 'user' ? (
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                              {message.content}
                            </p>
                          ) : (
                            <MarkdownRenderer 
                              content={message.content}
                              className="prose-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InteractiveCard className="p-4" glowColor="purple" hoverable={false}>
              <div className="flex items-center gap-3">
                <AnimatedIcon icon="🤖" animation="pulse" size={24} />
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600 dark:text-gray-300">Alfred is thinking</span>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1 h-1 bg-blue-500 rounded-full"
                      animate={{
                        y: [0, -5, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </div>

      {/* Voice Interface */}
      <AnimatePresence>
        {showVoiceInterface && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCard className="p-6 mb-6" glowColor="green">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  🎤 Voice Interaction
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Speak to Alfred in your preferred language
                </p>
              </div>
              <VoiceInterface
                onTranscriptionComplete={handleVoiceTranscription}
                onSpeakResponse={speakResponseRef}
              />
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <InteractiveCard className="p-4" glowColor="blue">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Alfred anything about teaching..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <MorphingButton
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              loading={isLoading}
              variant="primary"
              size="md"
            >
              {!isLoading && (
                <AnimatedIcon icon="📤" animation="bounce" size={16} />
              )}
            </MorphingButton>
          </div>
        </InteractiveCard>
      </motion.div>
    </div>
  );
};

export default Alfred;