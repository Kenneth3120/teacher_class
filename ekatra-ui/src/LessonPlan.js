import React, { useState } from "react";
import { motion } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import MarkdownRenderer from "./components/MarkdownRenderer";

const LessonPlan = () => {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [language, setLanguage] = useState("English");
  const [lessonPlan, setLessonPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async (e) => {
    e.preventDefault();
    if (!topic || !grade) {
      setError("Please fill in both Topic and Grade fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLessonPlan("");

    try {
      const prompt = `Generate a detailed lesson plan for a grade ${grade} class on the topic of "${topic}". The lesson plan should be in ${language}. Include learning objectives, materials needed, step-by-step activities, and an assessment method. Format your response using proper markdown with headers, bullet points, and sections.`;
      const result = await getGenerativeContent(prompt);
      setLessonPlan(result);
    } catch (err) {
      console.error("Error generating lesson plan:", err);
      setError("Failed to generate the lesson plan. Please try again.");
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
        <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
          <AnimatedIcon icon="📚" animation="bounce" size={32} />
          Lesson Plan Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create engaging, curriculum-aligned lesson plans with AI assistance
        </p>
      </motion.div>

      <InteractiveCard className="p-6" glowColor="purple">
        <form onSubmit={generatePlan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Photosynthesis"
              />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Level
              </label>
              <input
                type="text"
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 5th Grade"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Bengali</option>
              <option>Marathi</option>
              <option>Gujarati</option>
              <option>Kannada</option>
              <option>Malayalam</option>
              <option>Punjabi</option>
              <option>Urdu</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          
          <MorphingButton
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            className="w-full"
          >
            {!isLoading && (
              <AnimatedIcon icon="✨" animation="glow" size={16} />
            )}
            Generate Lesson Plan
          </MorphingButton>
        </form>
      </InteractiveCard>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <InteractiveCard className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" glowColor="red">
            <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AnimatedIcon icon="⚠️" animation="shake" size={16} />
              {error}
            </p>
          </InteractiveCard>
        </motion.div>
      )}

      {lessonPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InteractiveCard className="p-6" glowColor="green">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AnimatedIcon icon="📋" animation="bounce" />
                Generated Lesson Plan
              </h3>
              <MorphingButton
                onClick={() => navigator.clipboard.writeText(lessonPlan)}
                variant="secondary"
                size="sm"
              >
                <AnimatedIcon icon="📋" animation="bounce" size={16} />
                Copy
              </MorphingButton>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 overflow-auto max-h-96">
              <MarkdownRenderer content={lessonPlan} />
            </div>
          </InteractiveCard>
        </motion.div>
      )}
    </div>
  );
};

export default LessonPlan;