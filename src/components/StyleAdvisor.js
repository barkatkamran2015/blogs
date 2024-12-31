import React, { useState } from "react";
import "../StyleAdvisor.css"; // Ensure styling matches your design preferences

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false); // Feedback toggle
  const [lastRecommendation, setLastRecommendation] = useState(null); // Save last recommendation for feedback

  const handleSendMessage = async () => {
    if (!userQuery.trim()) {
      alert("Please enter your query.");
      return;
    }

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userQuery },
    ]);
    setUserQuery("");
    setLoading(true);
    setFeedbackEnabled(false); // Disable feedback during the query process

    try {
      const response = await fetch("https://barkatkamran.com/recommendations_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend Error: ${errorData.message}`);
      }

      const data = await response.json();

      if (data.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "No advice available for your query." },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: data.outfit_description || data.gift_suggestion || "No advice available.",
          },
        ]);
        setLastRecommendation(data); // Save the last recommendation for feedback
        setFeedbackEnabled(true); // Enable feedback
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: `An error occurred: ${error.message}` },
      ]);
    }

    setLoading(false);
  };

  const handleFeedback = async (feedbackScore) => {
    if (!lastRecommendation) {
      alert("No recommendation to provide feedback on.");
      return;
    }

    try {
      const response = await fetch(
        "https://barkatkamran.com/recommendations_api.php?action=feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendation_id: lastRecommendation.id,
            query: lastRecommendation.query,
            feedback_score: feedbackScore,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Feedback Error:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">Style Advisor</div>
        <div className="chat-content">
          {messages.length === 0 && (
            <p className="chat-placeholder">What can I help with?</p>
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
            placeholder="Message Style Advisor"
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
        {feedbackEnabled && (
          <div className="feedback-container">
            <p>Was this helpful?</p>
            <button onClick={() => handleFeedback(1)} className="feedback-button">
              👍
            </button>
            <button onClick={() => handleFeedback(-1)} className="feedback-button">
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleAdvisor;
