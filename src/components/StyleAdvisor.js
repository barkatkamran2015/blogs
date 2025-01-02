import React, { useState, useRef, useEffect } from "react";
import "../StyleAdvisor.css";

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContentRef = useRef(null);

  const handleSendMessage = async () => {
    if (!userQuery.trim()) {
      alert("Please enter your question.");
      return;
    }

    // Add user message to the chat
    const newMessages = [
      ...messages,
      { sender: "user", text: userQuery },
    ];
    setMessages(newMessages);
    setUserQuery("");
    setLoading(true);

    try {
      // Prepare conversation history for the backend
      const conversationHistory = newMessages.map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));

      // Send the query and conversation history to the backend
      const response = await fetch(
        "https://barkatkamran.com/openai_recommendations.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: userQuery,
            conversation_history: conversationHistory,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        // Handle error response from backend
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response },
        ]);
      } else {
        // Add AI's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response },
        ]);
      }
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
      <div className="chat-header">
        <h1>Fashion & Gift Advisor</h1>
        <p className="chat-description">
          Your go-to advisor for fashion tips and personalized gift recommendations.
        </p>
      </div>
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
