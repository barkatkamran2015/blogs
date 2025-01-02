import React, { useState, useRef, useEffect } from "react";
import "../StyleAdvisor.css"; // Assuming your CSS file is named StyleAdvisor.css

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]); // Chat messages
  const [userQuery, setUserQuery] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Loading state
  const chatContentRef = useRef(null); // Ref for chat content

  // Expanded keyword validation for relevant queries
  const relevantTopics = [
    "fashion", "style", "gift", "outfit", "clothes", "shopping", "wardrobe",
    "wedding", "birthday", "anniversary", "special occasion",
    "dress", "suit", "formal", "casual", "women", "men", "girls", "boys",
    "boots", "shoes", "heels", "accessories", "coordinate", "match", "pair"
  ];

  const handleSendMessage = async () => {
    if (!userQuery.trim()) {
      alert("Please enter your question.");
      return;
    }
  
    // Add the user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userQuery }];
    setMessages(newMessages);
    setUserQuery(""); // Clear the input field
    setLoading(true);
  
    try {
      // Prepare conversation history for the backend
      const conversationHistory = newMessages.map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));
  
      console.log("Sending to backend:", {
        query: userQuery,
        conversation_history: conversationHistory,
      }); // Debugging
  
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response || "Unable to process your request." },
        ]);
      } else {
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
    // Send message on pressing Enter
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  // Automatically scroll to the latest message
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-wrapper">
      {/* Chat Header */}
      <div className="chat-header">
        <h1>Fashion & Gift Advisor</h1>
        <p className="chat-description">
          Your go-to advisor for fashion tips and personalized gift recommendations. Start a chat to get tailored suggestions!
        </p>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Chat Content */}
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

        {/* Chat Input */}
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
