import React, { useState } from "react";
import { getGenerativeContent } from "./gemini";

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
      const prompt = `Create a quiz with ${numQuestions} multiple-choice questions for a grade ${grade} class on the topic of "${topic}". For each question, provide 4 answer options (A, B, C, D) and indicate the correct answer.`;
      const result = await getGenerativeContent(prompt);
      // Basic parsing, assuming the model returns a structured text.
      // A more robust solution would parse a JSON response.
      const questions = result.split("\n\n").map((q, index) => {
        const lines = q.split("\n");
        const questionText = lines[0];
        const options = lines.slice(1, 5);
        const answer = lines.find(line => line.startsWith("Answer:"));
        return { id: index, question: questionText, options, answer };
      });
      setQuiz(questions);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate the quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessment & Quiz Generator</h2>
      <form onSubmit={generateQuiz} className="space-y-4 mb-8">
        {/* Form fields for Topic, Grade, and Number of Questions */}
        <div>
          <label htmlFor="quiz-topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            id="quiz-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., The Solar System"
          />
        </div>
        <div>
          <label htmlFor="quiz-grade" className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <input
            type="text"
            id="quiz-grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 3rd Grade"
          />
        </div>
        <div>
          <label htmlFor="num-questions" className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
          <select
            id="num-questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-amber-300">
          {isLoading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {quiz && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Generated Quiz</h3>
          {quiz.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold">{item.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {item.options.map((opt, i) => (
                  <p key={i} className="p-2 bg-white border rounded">{opt}</p>
                ))}
              </div>
              <p className="mt-3 font-bold text-green-600">{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;