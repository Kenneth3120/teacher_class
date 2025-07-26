import React, { useState } from "react";
import { getGenerativeContent } from "./gemini";

const Alfred = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setHistory([...history, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await getGenerativeContent(input, history);
      const modelMessage = { role: "model", text: result };
      setHistory([...history, userMessage, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { role: "model", text: "Sorry, I'm having trouble connecting. Please try again." };
      setHistory([...history, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 flex flex-col h-[70vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Alfred - Your AI Assistant</h2>
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg">
        {history.map((msg, index) => (
          <div key={index} className={`my-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-200 ml-auto' : 'bg-gray-200 mr-auto'}`} style={{maxWidth: '80%'}}>
            <p style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg"
          placeholder="Ask Alfred anything..."
        />
        <button onClick={sendMessage} disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg">
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Alfred;