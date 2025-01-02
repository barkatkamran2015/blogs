import React, { useState, useEffect, useRef } from "react";
import "../StyleAdvisor.css"; // Use updated CSS

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Reference to the chat content container for scrolling
  const chatContentRef = useRef(null);

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
      const response = await fetch(
        "https://barkatkamran.com/openai_recommendations.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userQuery }),
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "Error occurred.");
      }

      // Add AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: data.response || "I don't have an answer right now.",
        },
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  // Scroll to the latest message whenever the messages array changes
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-wrapper">
      {/* Header Section */}
      <div className="chat-header">
        <h1>Fashion & Gift Advisor</h1>
        <p className="chat-description">
          Your go-to advisor for fashion tips and perfect gift recommendations.
          Start a chat to get personalized suggestions tailored to your needs!
        </p>
      </div>

      {/* Chatbox Section */}
      <div className="chat-container">
        <div className="chat-content" ref={chatContentRef}>
          {messages.length === 0 && (
            <p className="chat-placeholder">Start by asking a question...</p>
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
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
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
