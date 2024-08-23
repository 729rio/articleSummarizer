/*

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();
const port = 5001; // Ensure this matches what your frontend expects

app.use(express.json());

// Setup CORS to allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
  })
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is correct
});

app.post("/summarize", async (req, res) => {
  const { url } = req.body;

  try {
    console.log("Received URL:", url);

    // Fetch the content from the URL
    const response = await axios.get(url);
    const text = response.data;

    console.log("Fetched text length:", text.length);

    // Summarize the text using OpenAI API
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Summarize the following text: ${text}`,
        },
      ],
      max_tokens: 100,
    });

    const summary = summaryResponse.choices[0].message.content;
    console.log("Summary generated:", summary);
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error details:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch summary. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

*/
const express = require("express");
const fetch = require("node-fetch");
const OpenAI = require("openai");
const cors = require("cors"); // Import cors
require("dotenv").config();

const app = express();
const port = 5001;

app.use(cors()); // Enable CORS
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    // Fetch the article content from the URL
    const response = await fetch(url);
    const text = await response.text();

    // Use OpenAI to summarize the text
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Summarize the following text: ${text}` },
      ],
    });

    const summary = completion.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
