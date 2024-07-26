import React, { useState } from "react";

const NewsSummary = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");

  const summarize = async () => {
    const response = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const result = await response.json();
    setSummary(result.summary);
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
      <div id="summary">{summary && <p>{summary}</p>}</div>
    </div>
  );
};

export default NewsSummary;
