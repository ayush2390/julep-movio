import React, { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendQuery = async () => {
    if (!query) return;

    // Append user message to conversation
    setConversation((prev) => [...prev, { role: "user", message: query }]);
    setQuery("");

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        query,
      });

      const agentResponse = response.data.response;

      // Append agent response to conversation
      setConversation((prev) => [
        ...prev,
        { role: "agent", message: agentResponse },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="container">
      <h1>Hi, I'm Movio</h1>
      <h4>Your Ultimate Movie Companion</h4>
      <div id="conversation">
        {conversation.map((item, index) => (
          <p key={index} className={item.role}>
            {item.message}
            {item.role}
          </p>
        ))}
      </div>
      <input
        type="text"
        id="queryInput"
        placeholder="Ask me anything about Movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={sendQuery}>Submit</button>
    </div>
  );
}

export default App;
