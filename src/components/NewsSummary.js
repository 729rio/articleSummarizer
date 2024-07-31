import React, { useState } from "react";

const NewsSummary = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const summarize = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/summarize", {
        // API endpoint 로 바꾸셈
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSummary(result.summary);
    } catch (error) {
      setError("Failed to fetch summary. Please try again later.");
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <div className="container">
      <h1>News Summary</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter news URL"
      />
      <button onClick={summarize}>Summarize</button>
      {summary && (
        <div id="summary">
          <p>{summary}</p>
        </div>
      )}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default NewsSummary;
