import React, { useState } from "react";
import { getGenerativeContent } from "./gemini";

const TimeSplitter = () => {
  const [grades, setGrades] = useState("");
  const [subjects, setSubjects] = useState("");
  const [totalTime, setTotalTime] = useState(60);
  const [schedule, setSchedule] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSchedule = async (e) => {
    e.preventDefault();
    if (!grades || !subjects) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSchedule("");

    try {
      const prompt = `Create a daily schedule to efficiently teach multiple grades (${grades}) the following subjects: ${subjects}. The total available time is ${totalTime} minutes. The schedule should allocate time for each subject and grade, suggesting activities that can be done simultaneously or in rotation. Provide a clear, table-like schedule.`;
      const result = await getGenerativeContent(prompt);
      setSchedule(result);
    } catch (err) {
      console.error("Error generating schedule:", err);
      setError("Failed to generate the schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Multigrade Time Splitter</h2>
      <form onSubmit={generateSchedule} className="space-y-4 mb-8">
        <div>
          <label htmlFor="grades" className="block text-sm font-medium text-gray-700 mb-1">Grades to Teach</label>
          <input
            type="text"
            id="grades"
            value={grades}
            onChange={(e) => setGrades(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 1st, 2nd, 3rd"
          />
        </div>
        <div>
          <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
          <input
            type="text"
            id="subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Math, Reading, Science"
          />
        </div>
        <div>
          <label htmlFor="total-time" className="block text-sm font-medium text-gray-700 mb-1">Total Time (minutes)</label>
          <input
            type="number"
            id="total-time"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 disabled:bg-pink-300">
          {isLoading ? "Generating..." : "Generate Schedule"}
        </button>
      </form>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {schedule && (
        <div className="prose max-w-none bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-4">Generated Schedule</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{schedule}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSplitter;