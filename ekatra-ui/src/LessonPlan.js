import React, { useState } from "react";
import { getGenerativeContent } from "./gemini"; // Assuming gemini.js handles the API call

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
      const prompt = `Generate a detailed lesson plan for a grade ${grade} class on the topic of "${topic}". The lesson plan should be in ${language}. Include learning objectives, materials needed, step-by-step activities, and an assessment method.`;
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
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Lesson Plan Generator</h2>
      <form onSubmit={generatePlan} className="space-y-4 mb-8">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Photosynthesis"
          />
        </div>
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level
          </label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5th Grade"
          />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Hindi</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          {isLoading ? "Generating..." : "Generate Lesson Plan"}
        </button>
      </form>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {lessonPlan && (
        <div className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-4">Generated Lesson Plan</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{lessonPlan}</p>
        </div>
      )}
    </div>
  );
};

export default LessonPlan;