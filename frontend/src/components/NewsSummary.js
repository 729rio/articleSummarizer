import React, { useState } from "react";

function NewsSummary() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [summaryLength, setSummaryLength] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    setLoading(true); // Set loading state to true when starting summarization
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
      setLoading(false); // Reset loading state when done
    }
  };

  return (
    <div className="container">
      <h1>News Summary</h1>
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
