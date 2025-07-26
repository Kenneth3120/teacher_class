import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';
import MorphingButton from './MorphingButton';

const VoiceInterface = ({ onTranscriptionComplete, onSpeakResponse, isListening: parentIsListening }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [supportedLanguages] = useState([
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' }
  ]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = selectedLanguage;

      // Add these properties to improve recognition
      if (recognitionRef.current.grammars) {
        recognitionRef.current.grammars.addFromString('#JSGF V1.0;', 1);
      }
      
      // Set audio settings if available
      if (recognitionRef.current.audioTrack) {
        recognitionRef.current.audioTrack.enabled = true;
      }

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        // Update transcript with both final and interim results
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Only process if we have a substantial transcript (more than 2 words)
        if (transcript.trim() && transcript.trim().split(' ').length >= 1) {
          onTranscriptionComplete?.(transcript.trim());
        }
        setTranscript('');
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedLanguage, transcript, onTranscriptionComplete]);

  // Google Cloud Speech-to-Text API fallback
  const cloudSpeechToText = async (audioBlob) => {
    try {
      setIsProcessing(true);
      
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          
          const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_STT_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: selectedLanguage
              },
              audio: {
                content: base64Audio
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
            resolve(transcript);
          } else {
            reject(new Error('Speech-to-text failed'));
          }
        };
      });
    } catch (error) {
      console.error('Cloud Speech-to-Text error:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  };

  // Google Cloud Text-to-Speech API
  const cloudTextToSpeech = async (text, languageCode = 'en-US') => {
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.REACT_APP_GOOGLE_TTS_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode,
            name: getVoiceName(languageCode),
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        
        setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      // Fallback to browser speech synthesis
      browserTextToSpeech(text);
    }
  };

  // Browser Speech Synthesis fallback
  const browserTextToSpeech = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const getVoiceName = (languageCode) => {
    const voiceNames = {
      'en-US': 'en-US-Wavenet-F',
      'en-GB': 'en-GB-Wavenet-F',
      'es-ES': 'es-ES-Wavenet-C',
      'fr-FR': 'fr-FR-Wavenet-C',
      'de-DE': 'de-DE-Wavenet-F',
      'it-IT': 'it-IT-Wavenet-A',
      'hi-IN': 'hi-IN-Wavenet-A',
      'zh-CN': 'cmn-CN-Wavenet-A',
      'ja-JP': 'ja-JP-Wavenet-A',
      'ko-KR': 'ko-KR-Wavenet-A'
    };
    return voiceNames[languageCode] || 'en-US-Wavenet-F';
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text) => {
    if (process.env.REACT_APP_GOOGLE_TTS_API_KEY) {
      cloudTextToSpeech(text, selectedLanguage);
    } else {
      browserTextToSpeech(text);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Expose speakResponse to parent component
  useEffect(() => {
    if (onSpeakResponse) {
      onSpeakResponse.current = speakResponse;
    }
  }, [onSpeakResponse, selectedLanguage]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Language Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {supportedLanguages.slice(0, 5).map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all
              ${selectedLanguage === lang.code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.name.split(' ')[0]}
          </motion.button>
        ))}
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-4">
        {/* Voice Input Button */}
        <motion.div className="relative">
          <MorphingButton
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            variant={isListening ? "danger" : "primary"}
            size="lg"
            className="relative overflow-hidden"
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <AnimatedIcon icon="🔄" size={24} />
              </motion.div>
            ) : (
              <AnimatedIcon 
                icon={isListening ? "🔴" : "🎤"} 
                size={24}
                animation={isListening ? "pulse" : "bounce"}
              />
            )}
          </MorphingButton>
          
          {/* Listening animation */}
          {isListening && (
            <motion.div
              className="absolute inset-0 border-2 border-red-500 rounded-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.3, 0.7] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Voice Output Button */}
        <MorphingButton
          onClick={isSpeaking ? stopSpeaking : () => {}}
          disabled={!isSpeaking}
          variant={isSpeaking ? "warning" : "secondary"}
          size="lg"
        >
          <AnimatedIcon 
            icon={isSpeaking ? "🔇" : "🔊"} 
            size={24}
            animation={isSpeaking ? "shake" : "float"}
          />
        </MorphingButton>
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <AnimatedIcon icon="🎤" size={16} animation="pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {isListening ? 'Listening...' : 'Transcribed:'}
              </span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 italic">
              "{transcript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <div className="text-center space-y-1">
        {isListening && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            Listening... Speak clearly
          </motion.p>
        )}
        
        {isSpeaking && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            Speaking response...
          </motion.p>
        )}
        
        {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠️ Voice recognition not supported in this browser
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;