import React, { useState, useEffect } from "react";
import "../App.css";

function NewsSummary() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [summaryLength, setSummaryLength] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const summarize = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, summaryLength }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
        setError("");
      } else {
        setSummary("");
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setSummary("");
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button onClick={toggleDarkMode} className="dark-mode-button">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div className="header">
        <h1>News Cruncher</h1>
      </div>
      <div className="input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter news URL"
        />
        <select
          value={summaryLength}
          onChange={(e) => setSummaryLength(e.target.value)}
        >
          <option value="" disabled>
            Choose Length
          </option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
      <button
        onClick={summarize}
        className={loading ? "button-summarizing" : ""}
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div id="summary">
          <h3>Summary:</h3>
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
}

export default NewsSummary;
