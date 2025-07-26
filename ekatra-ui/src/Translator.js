import React, { useState } from "react";
import { motion } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import MarkdownRenderer from "./components/MarkdownRenderer";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    "English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", 
    "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu",
    "Spanish", "French", "German", "Italian", "Portuguese",
    "Chinese", "Japanese", "Korean", "Arabic", "Russian",
    "Dutch", "Swedish", "Norwegian", "Danish", "Finnish"
  ];

  const translateText = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only provide the translation, no additional text or explanation: "${inputText}"`;
      const result = await getGenerativeContent(prompt);
      setTranslatedText(result.trim());
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const clearAll = () => {
    setInputText("");
    setTranslatedText("");
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
          <AnimatedIcon icon="🌐" animation="float" size={32} />
          Multi-language Support
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Translate content and communicate in multiple languages
        </p>
      </motion.div>

      {/* Language Selection */}
      <InteractiveCard className="p-6" glowColor="cyan">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-center">
            <MorphingButton
              onClick={swapLanguages}
              variant="secondary"
              size="sm"
            >
              <AnimatedIcon icon="🔄" animation="rotate" size={20} />
            </MorphingButton>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </InteractiveCard>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <InteractiveCard className="p-6" glowColor="blue">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AnimatedIcon icon="📝" animation="float" />
                {sourceLanguage}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputText.length}/1000
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
              placeholder="Enter text to translate..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex gap-3">
              <MorphingButton
                onClick={translateText}
                disabled={!inputText.trim() || isTranslating}
                loading={isTranslating}
                variant="primary"
                className="flex-1"
              >
                {!isTranslating && (
                  <AnimatedIcon icon="🌐" animation="glow" size={16} />
                )}
                Translate
              </MorphingButton>
              
              <MorphingButton
                onClick={clearAll}
                variant="secondary"
                size="md"
              >
                <AnimatedIcon icon="🗑️" animation="shake" size={16} />
              </MorphingButton>
            </div>
          </div>
        </InteractiveCard>

        {/* Output Section */}
        <InteractiveCard className="p-6" glowColor="green">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AnimatedIcon icon="✨" animation="glow" />
                {targetLanguage}
              </h3>
              {translatedText && (
                <MorphingButton
                  onClick={() => navigator.clipboard.writeText(translatedText)}
                  variant="secondary"
                  size="sm"
                >
                  <AnimatedIcon icon="📋" animation="bounce" size={16} />
                  Copy
                </MorphingButton>
              )}
            </div>
            
            <div
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white overflow-y-auto"
              style={{ minHeight: '200px' }}
            >
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <AnimatedIcon icon="🌐" animation="pulse" size={32} />
                    <p className="text-gray-600 dark:text-gray-300">Translating...</p>
                    <div className="flex justify-center space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{
                            y: [0, -10, 0],
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
                </div>
              ) : translatedText ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="leading-relaxed"
                >
                  <MarkdownRenderer 
                    content={translatedText}
                    className="prose-sm"
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center space-y-2">
                    <AnimatedIcon icon="🌍" animation="float" size={48} />
                    <p>Translation will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* Common Educational Phrases */}
      <InteractiveCard className="p-6" glowColor="purple">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AnimatedIcon icon="💡" animation="glow" />
          Common Educational Phrases
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Good morning, students!",
            "Please submit your homework",
            "Excellent work today",
            "Do you have any questions?",
            "Let's review the lesson",
            "Time for a break",
            "Great participation!",
            "See you tomorrow",
            "Please raise your hand"
          ].map((phrase, index) => (
            <motion.button
              key={index}
              onClick={() => setInputText(phrase)}
              className="text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <AnimatedIcon icon="💬" animation="float" size={14} />
              <span className="ml-2">{phrase}</span>
            </motion.button>
          ))}
        </div>
      </InteractiveCard>
    </div>
  );
};

export default Translator;