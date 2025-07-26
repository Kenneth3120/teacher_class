import React, { useState } from "react";
import { motion } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import InteractiveCard from "./components/InteractiveCard";
import MorphingButton from "./components/MorphingButton";
import AnimatedIcon from "./components/AnimatedIcon";
import MarkdownRenderer from "./components/MarkdownRenderer";

const QuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic || !grade) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuiz(null);

    try {
      const prompt = `Create a quiz with ${numQuestions} multiple-choice questions for a grade ${grade} class on the topic of "${topic}". 

Format your response using markdown with the following structure:
- Use proper headers for each question (## Question 1, ## Question 2, etc.)
- List the 4 answer options (A, B, C, D) as bullet points
- Clearly indicate the correct answer at the end of each question
- Include a brief explanation for each correct answer

Make sure the questions are age-appropriate and educational.`;

      const result = await getGenerativeContent(prompt);
      setQuiz(result);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate the quiz. Please try again.");
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
          <AnimatedIcon icon="🎯" animation="bounce" size={32} />
          Assessment & Quiz Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Design personalized quizzes and assessments for your students
        </p>
      </motion.div>

      <InteractiveCard className="p-6" glowColor="amber">
        <form onSubmit={generateQuiz} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quiz-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>
              <input
                type="text"
                id="quiz-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., The Solar System"
              />
            </div>
            <div>
              <label htmlFor="quiz-grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Level
              </label>
              <input
                type="text"
                id="quiz-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., 3rd Grade"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="num-questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Questions
            </label>
            <select
              id="num-questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
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
              <AnimatedIcon icon="🎯" animation="glow" size={16} />
            )}
            Generate Quiz
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

      {quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InteractiveCard className="p-6" glowColor="green">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AnimatedIcon icon="📝" animation="bounce" />
                Generated Quiz
              </h3>
              <MorphingButton
                onClick={() => navigator.clipboard.writeText(quiz)}
                variant="secondary"
                size="sm"
              >
                <AnimatedIcon icon="📋" animation="bounce" size={16} />
                Copy
              </MorphingButton>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 overflow-auto max-h-96">
              <MarkdownRenderer content={quiz} />
            </div>
          </InteractiveCard>
        </motion.div>
      )}
    </div>
  );
};

export default QuizGenerator;