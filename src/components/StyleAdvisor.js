import React, { useState } from "react";
import "../StyleAdvisor.css"; // Add the new CSS here!

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userQuery.trim()) {
      alert("Please enter your question.");
      return;
    }

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userQuery },
    ]);
    setUserQuery("");
    setLoading(true);

    try {
      // Send query to backend API
      const response = await fetch("https://barkatkamran.com/openai_recommendations.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "Error occurred.");
      }

      // Add AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.response || "I don't have an answer right now." },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: `An error occurred: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Header Section */}
      <div className="chat-header">
        <h1>💖 Fashion & Gift Advisor 💝</h1>
        <p className="chat-description">
          Your personalized assistant for fashion tips and gift ideas. Ask anything, from outfit recommendations to the perfect gift for any occasion!
        </p>
      </div>

      {/* Chatbox Section */}
      <div className="chat-container">
        <div className="chat-content">
          {messages.length === 0 && (
            <p className="chat-placeholder">Ask me anything, I'm here to help! 💌</p>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask your fashion or gift question... 💕"
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleAdvisor;
