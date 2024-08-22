const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 5001;

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch the content from the URL
    const response = await axios.get(url);
    const text = response.data;

    // Ensure text isn't too long to avoid token limits
    const maxTextLength = 15000; // Adjust this value based on your needs
    const trimmedText = text.slice(0, maxTextLength);

    // Summarize the text using OpenAI API
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please summarize the following text: ${trimmedText}`,
        },
      ],
      max_tokens: 2000, // Adjust based on your needs
    });

    const summary = summaryResponse.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);

    // Specific handling for rate limit or token errors
    if (error.code === "rate_limit_exceeded") {
      res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    } else if (error.code === "tokens") {
      res
        .status(400)
        .json({ error: "Input text is too long. Please reduce its size." });
    } else {
      res
        .status(500)
        .json({ error: "Failed to fetch summary. Please try again later." });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
