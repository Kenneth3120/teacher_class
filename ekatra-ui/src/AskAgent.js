import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import MarkdownRenderer from "./components/MarkdownRenderer";

const AskAgent = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const askAgent = async () => {
    if (!query.trim()) return;
    
    const userQuery = { type: "question", content: query, timestamp: new Date() };
    setHistory(prev => [...prev, userQuery]);
    setIsLoading(true);
    
    try {
      const result = await getGenerativeContent(
        `You are an intelligent teaching assistant. Please provide a helpful and detailed answer to this educational question: ${query}. Format your response using proper markdown with headers, bullet points, and clear sections where appropriate.`
      );
      
      const agentResponse = { type: "answer", content: result, timestamp: new Date() };
      setHistory(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorResponse = { 
        type: "answer", 
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const suggestedQuestions = [
    "How can I improve student engagement?",
    "What are effective classroom management strategies?",
    "How do I create differentiated learning activities?",
    "What are some creative ways to assess student progress?",
    "How can I support struggling students?",
    "What technologies can enhance my teaching?"
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
          <AnimatedIcon icon="🤔" animation="bounce" size={32} />
          Ask Agent
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get instant answers to your teaching questions from our AI assistant
        </p>
      </motion.div>

      {/* Query Input */}
      <InteractiveCard className="p-6" glowColor="blue">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <AnimatedIcon icon="❓" animation="float" />
            What would you like to know?
          </h3>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any teaching-related question..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && askAgent()}
              disabled={isLoading}
            />
            <MorphingButton
              onClick={askAgent}
              disabled={!query.trim() || isLoading}
              loading={isLoading}
              variant="primary"
              size="md"
            >
              {!isLoading && (
                <AnimatedIcon icon="🚀" animation="glow" size={16} />
              )}
            </MorphingButton>
          </div>
        </div>
      </InteractiveCard>

      {/* Suggested Questions */}
      {history.length === 0 && (
        <InteractiveCard className="p-6" glowColor="purple">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AnimatedIcon icon="💡" animation="glow" />
            Suggested Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((question, index) => (
              <motion.button
                key={index}
                onClick={() => setQuery(question)}
                className="text-left p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-700 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <AnimatedIcon icon="🎯" animation="float" size={16} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {question}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </InteractiveCard>
      )}

      {/* Conversation History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AnimatedIcon icon="💬" animation="float" />
              Conversation
            </h3>
            <MorphingButton
              onClick={clearHistory}
              variant="secondary"
              size="sm"
            >
              <AnimatedIcon icon="🗑️" animation="shake" size={16} />
              Clear
            </MorphingButton>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex ${item.type === 'question' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-full max-w-4xl ${item.type === 'question' ? 'ml-auto' : 'mr-auto'}`}>
                    <InteractiveCard
                      className={`p-4 ${
                        item.type === 'question'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          : ''
                      }`}
                      glowColor={item.type === 'question' ? 'blue' : 'green'}
                      hoverable={false}
                    >
                      <div className="flex items-start gap-3">
                        <AnimatedIcon
                          icon={item.type === 'question' ? '👤' : '🤖'}
                          animation="float"
                          size={24}
                          color={item.type === 'question' ? 'white' : 'currentColor'}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs mb-1 ${
                            item.type === 'question' 
                              ? 'text-white/80' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {item.type === 'question' ? 'You' : 'Teaching Assistant'}
                          </p>
                          <div className={`${
                            item.type === 'question' 
                              ? 'text-white' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {item.type === 'question' ? (
                              <p style={{ whiteSpace: 'pre-wrap' }}>
                                {item.content}
                              </p>
                            ) : (
                              <MarkdownRenderer 
                                content={item.content}
                                className="prose-sm"
                              />
                            )}
                          </div>
                          <p className={`text-xs mt-2 ${
                            item.type === 'question' 
                              ? 'text-white/60' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </InteractiveCard>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-full max-w-4xl mr-auto">
                  <InteractiveCard className="p-4" glowColor="green" hoverable={false}>
                    <div className="flex items-center gap-3">
                      <AnimatedIcon icon="🤖" animation="pulse" size={24} />
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600 dark:text-gray-300">Thinking</span>
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
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAgent;