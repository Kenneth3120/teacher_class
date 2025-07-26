import React, { useState } from "react";
import { getGenerativeContent } from "./gemini";

const Translator = () => {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!text) {
      setError("Please enter text to translate.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedText("");

    try {
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${text}"`;
      const result = await getGenerativeContent(prompt);
      setTranslatedText(result);
    } catch (err) {
      console.error("Error translating text:", err);
      setError("Failed to translate the text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Multilingual & Translation Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="source-lang" className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select
            id="source-lang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Hindi</option>
          </select>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
            rows="5"
            placeholder="Enter text to translate..."
          />
        </div>
        <div>
          <label htmlFor="target-lang" className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select
            id="target-lang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Hindi</option>
          </select>
          <textarea
            readOnly
            value={translatedText}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            rows="5"
            placeholder="Translation will appear here..."
          />
        </div>
      </div>
      <button onClick={handleTranslate} disabled={isLoading} className="w-full mt-4 bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600">
        {isLoading ? "Translating..." : "Translate"}
      </button>
      {error && <p className="mt-4 text-center p-2 bg-red-100 text-red-800 rounded-lg">{error}</p>}
    </div>
  );
};

export default Translator;