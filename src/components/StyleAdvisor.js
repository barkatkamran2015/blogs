import React, { useState, useRef, useEffect } from "react";
import "../StyleAdvisor.css"; // Assuming your CSS file is named StyleAdvisor.css

const StyleAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContentRef = useRef(null);

  // Allowed keywords for relevant queries
  const allowedKeywords = [
    "fashion",
    "style",
    "gift",
    "outfit",
    "clothes",
    "accessories",
    "shopping",
    "wardrobe",
  ];

  const handleSendMessage = async () => {
    if (!userQuery.trim()) {
      alert("Please enter your question.");
      return;
    }

    // Check if the query is relevant to allowed topics
    const isRelevant = allowedKeywords.some((keyword) =>
      userQuery.toLowerCase().includes(keyword)
    );

    if (!isRelevant) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userQuery },
        {
          sender: "bot",
          text:
            "I'm sorry, I can only answer questions related to fashion, styling, or gift recommendations. Please ask a relevant question.",
        },
      ]);
      setUserQuery(""); // Clear the input field
      return;
    }

    // Add user's message to the chat
    const newMessages = [
      ...messages,
      { sender: "user", text: userQuery },
    ];
    setMessages(newMessages);
    setUserQuery(""); // Clear the input field
    setLoading(true);

    try {
      // Prepare conversation history for the backend
      const conversationHistory = newMessages.map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));

      // Make API call
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
        // Handle error from backend
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text:
              data.response ||
              "I'm sorry, something went wrong. Please try again later.",
          },
        ]);
      } else {
        // Add the bot's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response },
        ]);
      }
    } catch (error) {
      // Handle network or other errors
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: `An error occurred: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleKeyDown = (e) => {
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
      <div className="chat-header">
        <h1>Fashion & Gift Advisor</h1>
        <p className="chat-description">
          Your go-to advisor for fashion tips and personalized gift recommendations. Start a chat to get tailored suggestions!
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
