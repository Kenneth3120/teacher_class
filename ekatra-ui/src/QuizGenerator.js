import React, { useState } from "react";
import { motion } from "framer-motion";
import { getGenerativeContent } from "./gemini";
import GoogleFormsService from "./services/GoogleFormsService";
import { useNotifications } from "./components/NotificationSystem";
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
  const [creatingForm, setCreatingForm] = useState(false);
  const [formUrl, setFormUrl] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const { addNotification } = useNotifications();

  // Parse quiz content to extract questions and options
  const parseQuizContent = (content) => {
    const questions = [];
    const lines = content.split('\n');
    let currentQuestion = null;
    
    for (let line of lines) {
      line = line.trim();
      
      // Check for question header (## Question 1, ## Question 2, etc.)
      if (line.match(/^##\s*Question\s*\d+/i)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          title: line.replace(/^##\s*/i, ''),
          options: [],
          correctAnswer: null
        };
      }
      // Check for question content
      else if (currentQuestion && line && !line.match(/^[A-D]\)|Answer:|Correct Answer:|Explanation:/i) && currentQuestion.options.length === 0) {
        currentQuestion.title += ' ' + line;
      }
      // Check for options (A), B), C), D))
      else if (currentQuestion && line.match(/^[A-D]\)/i)) {
        currentQuestion.options.push(line.substring(2).trim());
      }
      // Check for correct answer
      else if (currentQuestion && line.match(/^(Answer|Correct Answer):\s*[A-D]/i)) {
        const match = line.match(/[A-D]/i);
        if (match) {
          const answerLetter = match[0].toUpperCase();
          const answerIndex = answerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
          currentQuestion.correctAnswer = answerIndex;
        }
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  };

  // Create Google Form using the new Google Forms service
  const createGoogleForm = async () => {
    if (!quiz || !quizData || quizData.length === 0) {
      addNotification({
        type: 'error',
        title: 'Quiz Required',
        message: 'Please generate a quiz first before creating a Google Form.'
      });
      return;
    }

    setCreatingForm(true);
    setError(null);

    try {
      addNotification({
        type: 'info',
        title: 'Creating Form',
        message: 'Setting up Google authentication...'
      });

      // Create the form
      const formData = await GoogleFormsService.createForm(
        `${topic} Quiz - Grade ${grade}`,
        `This quiz contains ${numQuestions} multiple choice questions about ${topic}. Please select the best answer for each question.`
      );

      const formId = formData.formId;

      addNotification({
        type: 'info',
        title: 'Adding Questions',
        message: 'Adding quiz questions to the form...'
      });

      // Prepare questions for Google Forms
      const formattedQuestions = quizData.map(question => ({
        title: question.title.replace(/^Question\s*\d+:?\s*/i, '').trim(),
        description: question.explanation || '',
        options: question.options
      }));

      // Add questions to the form
      await GoogleFormsService.addQuestionsToForm(formId, formattedQuestions);

      // Generate shareable and edit URLs
      const shareableUrl = GoogleFormsService.getShareableLink(formId);
      const editUrl = GoogleFormsService.getEditLink(formId);

      setFormUrl({
        shareable: shareableUrl,
        edit: editUrl
      });

      addNotification({
        type: 'success',
        title: 'Form Created Successfully',
        message: 'Your Google Form has been created and is ready to share!',
        duration: 5000
      });

    } catch (err) {
      console.error("Error creating Google Form:", err);
      setError(`Failed to create Google Form: ${err.message}`);
      
      addNotification({
        type: 'error',
        title: 'Form Creation Failed',
        message: err.message.includes('authentication') 
          ? 'Please sign in to your Google account and grant necessary permissions.'
          : 'Failed to create Google Form. Please try again.',
        duration: 7000
      });
    } finally {
      setCreatingForm(false);
    }
  };

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic || !grade) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setFormUrl(null);

    try {
      const prompt = `Create a quiz with ${numQuestions} multiple-choice questions for a grade ${grade} class on the topic of "${topic}". 

IMPORTANT: Format your response using this EXACT structure:

## Question 1: [Question text here]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Correct Answer: A
Explanation: [Brief explanation]

## Question 2: [Question text here]
A) [Option A]
B) [Option B]
C) [Option C] 
D) [Option D]
Correct Answer: B
Explanation: [Brief explanation]

Continue this pattern for all ${numQuestions} questions. Make sure each question has exactly 4 options (A, B, C, D) and clearly indicate the correct answer.`;

      const result = await getGenerativeContent(prompt);
      setQuiz(result);
      
      // Parse the quiz content to extract structured data
      const parsedQuizData = parseQuizContent(result);
      setQuizData(parsedQuizData);
      
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
              <div className="flex gap-2">
                <MorphingButton
                  onClick={() => navigator.clipboard.writeText(quiz)}
                  variant="secondary"
                  size="sm"
                >
                  <AnimatedIcon icon="📋" animation="bounce" size={16} />
                  Copy
                </MorphingButton>
                
                <MorphingButton
                  onClick={createGoogleForm}
                  disabled={creatingForm || !quizData || quizData.length === 0}
                  loading={creatingForm}
                  variant="primary"
                  size="sm"
                >
                  {!creatingForm && (
                    <AnimatedIcon icon="📄" animation="glow" size={16} />
                  )}
                  Create Google Form
                </MorphingButton>
              </div>
            </div>

            {/* Form URL Display */}
            {formUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <InteractiveCard className="p-6 mt-6" glowColor="green">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AnimatedIcon icon="✅" animation="bounce" size={48} />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Google Form Created Successfully!
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300">
                      Your quiz has been converted to a Google Form. You can now share it with your students.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <MorphingButton
                        onClick={() => window.open(formUrl.shareable, '_blank')}
                        variant="primary"
                        className="flex-1 sm:flex-none"
                      >
                        <AnimatedIcon icon="👀" animation="bounce" size={16} />
                        View Form
                      </MorphingButton>
                      
                      <MorphingButton
                        onClick={() => window.open(formUrl.edit, '_blank')}
                        variant="secondary"
                        className="flex-1 sm:flex-none"
                      >
                        <AnimatedIcon icon="✏️" animation="bounce" size={16} />
                        Edit Form
                      </MorphingButton>
                      
                      <MorphingButton
                        onClick={() => {
                          navigator.clipboard.writeText(formUrl.shareable);
                          addNotification({
                            type: 'success',
                            title: 'Link Copied',
                            message: 'Form link has been copied to clipboard!'
                          });
                        }}
                        variant="success"
                        className="flex-1 sm:flex-none"
                      >
                        <AnimatedIcon icon="📋" animation="bounce" size={16} />
                        Copy Link
                      </MorphingButton>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="font-medium mb-1">Share this link with your students:</p>
                      <p className="font-mono text-xs break-all">{formUrl.shareable}</p>
                    </div>
                  </div>
                </InteractiveCard>
              </motion.div>
            )}
            
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