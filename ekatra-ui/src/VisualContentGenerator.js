import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VertexAIService from "./services/VertexAIService";
import { useNotifications } from "./components/NotificationSystem";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";

const VisualContentGenerator = () => {
  const [contentType, setContentType] = useState("educational");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("elementary");
  const [style, setStyle] = useState("cartoon");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addNotification } = useNotifications();

  const contentTypes = [
    { value: "educational", label: "Educational Illustration", icon: "📚" },
    { value: "infographic", label: "Infographic", icon: "📊" },
    { value: "diagram", label: "Diagram", icon: "🔄" },
    { value: "worksheet", label: "Worksheet Illustration", icon: "📝" },
    { value: "presentation", label: "Presentation Background", icon: "🎨" },
    { value: "custom", label: "Custom Prompt", icon: "✨" }
  ];

  const subjects = [
    "Mathematics", "Science", "English", "History", "Geography", 
    "Biology", "Chemistry", "Physics", "Literature", "Art", "Music"
  ];

  const gradeLevels = [
    { value: "elementary", label: "Elementary (K-5)" },
    { value: "middle", label: "Middle School (6-8)" },
    { value: "high", label: "High School (9-12)" }
  ];

  const styles = [
    { value: "cartoon", label: "Cartoon/Animated" },
    { value: "realistic", label: "Realistic" },
    { value: "minimalist", label: "Minimalist" },
    { value: "vintage", label: "Vintage/Classic" },
    { value: "modern", label: "Modern/Contemporary" }
  ];

  const generateContent = async () => {
    if (contentType === "custom" && !customPrompt.trim()) {
      addNotification({
        type: 'error',
        title: 'Missing Prompt',
        message: 'Please enter a custom prompt for image generation.'
      });
      return;
    }

    if (contentType !== "custom" && (!subject || !topic)) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      addNotification({
        type: 'info',
        title: 'Generating Content',
        message: 'Creating visual content with AI...'
      });

      let predictions = [];

      switch (contentType) {
        case "educational":
          predictions = await VertexAIService.generateEducationalContent(
            subject, topic, gradeLevel, style
          );
          break;
        case "infographic":
          const keyPoints = topic.split(',').map(p => p.trim());
          predictions = await VertexAIService.generateInfographic(
            subject, keyPoints, style
          );
          break;
        case "diagram":
          predictions = await VertexAIService.generateDiagram(
            topic, 'flowchart', 'simple'
          );
          break;
        case "worksheet":
          predictions = await VertexAIService.generateWorksheetIllustration(
            subject, topic, gradeLevel
          );
          break;
        case "presentation":
          predictions = await VertexAIService.generateSlideBackground(
            topic, style, 'blue and white'
          );
          break;
        case "custom":
          predictions = await VertexAIService.generateImage(customPrompt, {
            aspectRatio: "16:9",
            parameters: {
              guidanceScale: 12,
              seed: Math.floor(Math.random() * 1000000)
            }
          });
          break;
        default:
          throw new Error('Invalid content type');
      }

      const processedImages = predictions.map((prediction, index) => ({
        id: Date.now() + index,
        ...VertexAIService.processGeneratedImage(prediction),
        contentType,
        subject,
        topic,
        gradeLevel,
        style,
        prompt: contentType === "custom" ? customPrompt : `${subject} - ${topic}`,
        createdAt: new Date().toISOString()
      })).filter(img => img.base64); // Filter out failed generations

      setGeneratedImages(prev => [...processedImages, ...prev]);

      addNotification({
        type: 'success',
        title: 'Content Generated',
        message: `Successfully generated ${processedImages.length} image(s)!`,
        duration: 5000
      });

    } catch (error) {
      console.error('Error generating content:', error);
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: error.message.includes('authentication') 
          ? 'Please sign in to Google Cloud and grant necessary permissions.'
          : 'Failed to generate content. Please try again.',
        duration: 7000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (image) => {
    const filename = `${image.subject || 'visual'}-${image.topic || 'content'}-${Date.now()}.png`;
    VertexAIService.downloadImage(image, filename);
    
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: 'Image download has begun!'
    });
  };

  const saveToGoogleDrive = async (image) => {
    try {
      const filename = `${image.subject || 'visual'}-${image.topic || 'content'}-${Date.now()}.png`;
      await VertexAIService.saveToGoogleDrive(image, filename);
      
      addNotification({
        type: 'success',
        title: 'Saved to Drive',
        message: 'Image saved to Google Drive successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save image to Google Drive.'
      });
    }
  };

  const getSubjectSuggestions = () => {
    const prompts = VertexAIService.getSubjectPrompts();
    return prompts[subject.toLowerCase()] || [];
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Visual Content Generator</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create engaging visual content for your lessons using AI-powered image generation
        </p>
      </motion.div>

      {/* Content Type Selection */}
      <InteractiveCard className="p-6" glowColor="purple">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AnimatedIcon icon="🎨" animation="bounce" />
          Content Type
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {contentTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => setContentType(type.value)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                contentType === type.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </motion.button>
          ))}
        </div>
      </InteractiveCard>

      {/* Content Configuration */}
      <InteractiveCard className="p-6" glowColor="blue">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AnimatedIcon icon="⚙️" animation="rotate" />
          Configuration
        </h3>

        {contentType === "custom" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the image you want to generate..."
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Subject</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter topic or concept"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {gradeLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {styles.map(styleOption => (
                  <option key={styleOption.value} value={styleOption.value}>{styleOption.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Topic Suggestions */}
        {subject && contentType !== "custom" && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic Suggestions:
            </h4>
            <div className="flex flex-wrap gap-2">
              {getSubjectSuggestions().slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(suggestion)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <MorphingButton
            onClick={generateContent}
            disabled={isGenerating}
            loading={isGenerating}
            variant="primary"
            size="lg"
          >
            {!isGenerating && (
              <AnimatedIcon icon="🎨" animation="bounce" size={20} />
            )}
            {isGenerating ? 'Generating...' : 'Generate Visual Content'}
          </MorphingButton>
        </div>
      </InteractiveCard>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <InteractiveCard className="p-6" glowColor="green">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AnimatedIcon icon="🖼️" animation="float" />
            Generated Content ({generatedImages.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <img
                    src={image.downloadUrl}
                    alt={image.prompt}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs bg-black/50 text-white rounded-full">
                      {image.contentType}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {image.subject || 'Custom'} - {image.topic || 'Generated'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {image.prompt}
                  </p>
                  
                  <div className="flex gap-2">
                    <MorphingButton
                      onClick={() => downloadImage(image)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      <AnimatedIcon icon="⬇️" size={14} />
                      Download
                    </MorphingButton>
                    
                    <MorphingButton
                      onClick={() => saveToGoogleDrive(image)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      <AnimatedIcon icon="☁️" size={14} />
                      Save to Drive
                    </MorphingButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </InteractiveCard>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedImage.subject} - {selectedImage.topic}
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <AnimatedIcon icon="✕" size={20} />
                </button>
              </div>
              
              <img
                src={selectedImage.downloadUrl}
                alt={selectedImage.prompt}
                className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
              />
              
              <div className="flex gap-3">
                <MorphingButton
                  onClick={() => downloadImage(selectedImage)}
                  variant="primary"
                >
                  <AnimatedIcon icon="⬇️" size={16} />
                  Download
                </MorphingButton>
                
                <MorphingButton
                  onClick={() => saveToGoogleDrive(selectedImage)}
                  variant="secondary"
                >
                  <AnimatedIcon icon="☁️" size={16} />
                  Save to Drive
                </MorphingButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualContentGenerator;