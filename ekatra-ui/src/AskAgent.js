// src/AskAgent.js
import React, { useState } from "react";
import { getGenerativeContent } from "./gemini";

const AskAgent = () => {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    setAnswer("Thinking...");
    const result = await getGenerativeContent(input);
    setAnswer(result);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ask the Teaching Assistant</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your teaching question..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        rows="4"
      />
      <button
        onClick={handleAsk}
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ask
      </button>
      {answer && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <strong className="font-bold text-gray-800">AI Response:</strong>
          <p className="mt-2 text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AskAgent;
