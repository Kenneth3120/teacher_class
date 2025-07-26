import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className={`relative group ${className}`}>
      <motion.button
        className="flex items-center gap-2 px-3 py-2 glass rounded-xl hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatedIcon 
          icon={currentLanguage.flag} 
          animation="float" 
          size={16} 
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage.name}
        </span>
        <AnimatedIcon 
          icon="▼" 
          animation="bounce" 
          size={12} 
        />
      </motion.button>
      
      {/* Dropdown */}
      <motion.div
        className="absolute top-full left-0 mt-2 glass rounded-xl shadow-large border border-white/20 dark:border-gray-700/20 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        {languages.map((language, index) => (
          <motion.button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 dark:hover:bg-black/10 transition-colors ${
              language.code === i18n.language 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AnimatedIcon 
              icon={language.flag} 
              animation="float" 
              size={16} 
            />
            <span className="text-sm font-medium whitespace-nowrap">
              {language.name}
            </span>
            {language.code === i18n.language && (
              <AnimatedIcon 
                icon="✓" 
                animation="bounce" 
                size={12} 
                color="currentColor"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default LanguageSwitcher;