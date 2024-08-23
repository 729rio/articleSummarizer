const express = require("express");
const cors = require("cors"); // Import cors
const fetch = require("node-fetch");
const OpenAI = require("openai");
const cheerio = require("cheerio"); // Import cheerio
require("dotenv").config();

const app = express();
const port = 5001;

app.use(cors()); // Enable CORS
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new Error("No URL provided");
    }

    console.log("Received URL", url);

    // Fetch the article content from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch article content: ${response.statusText}`
      );
    }
    const html = await response.text();

    // Load HTML and try to extract the main content using a heuristic approach
    const $ = cheerio.load(html);

    // Attempt to find the main article text
    const possibleSelectors = [
      "article", // most articles use this tag
      'div[class*="content"]',
      'section[class*="content"]',
      'div[class*="article"]',
      'section[class*="article"]',
      'div[class*="story"]',
      'section[class*="story"]',
      'div[class*="post"]',
      'section[class*="post"]',
      'div[class*="article-texts"]',
      'div[class*="article-body"]',
      'div[class*="story-texts"]',
      'div[class*="story-body"]',
    ];

    let articleText = "";

    // Iterate through the possible selectors until we find a good match
    for (const selector of possibleSelectors) {
      const text = $(selector).text();
      if (text.length > articleText.length) {
        // Choose the longest content
        articleText = text;
      }
    }

    // Further clean up the text
    const cleanedText = articleText
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(
        /(Read Next|Sponsored|Advertisement|Contact|Share this|Comments|Related Articles|Back to top).*/gi,
        ""
      )
      .trim();

    console.log("Extracted and cleaned article text:", cleanedText);

    if (!cleanedText) {
      throw new Error("Failed to extract meaningful content from the article");
    }

    // Use OpenAI to summarize the cleaned text with a more specific prompt
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Provide a detailed summary of the following article, including specific details such as the identities of the people involved, the nature of the incident, and the context surrounding the event: ${cleanedText}`,
          },
        ],
      });

      const summary = completion.choices[0].message.content;
      res.json({ summary });
    } catch (error) {
      console.error("Error during OpenAI API call:", error.message);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
