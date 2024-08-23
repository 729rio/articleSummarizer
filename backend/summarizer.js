const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const OpenAI = require("openai");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
  try {
    const { url, summaryLength } = req.body;

    if (!url) {
      throw new Error("No URL provided");
    }

    if (summaryLength === "") {
      throw new Error("Please choose your summary length!");
    }

    console.log("Received URL:", url);

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

    // Function to extract text from tags and class names
    const extractText = () => {
      let extractedText = "";

      // Iterate over all tags
      $("*").each((index, element) => {
        const tagName = $(element).prop("tagName").toLowerCase();
        const className = $(element).attr("class") || "";

        // Heuristic: if the tag name or class name is related to articles, content, or stories, prioritize it
        if (
          tagName.includes("article") ||
          tagName.includes("section") ||
          tagName.includes("div") ||
          className.includes("content") ||
          className.includes("story") ||
          className.includes("text") ||
          className.includes("body")
        ) {
          const text = $(element).text().trim();
          if (text.length > extractedText.length) {
            extractedText = text;
          }
        }
      });

      return extractedText;
    };

    // Extract the text
    let articleText = extractText();

    // Further clean up the text
    const cleanedText = articleText
      .replace(/\s+/g, " ")
      .replace(
        /(Read Next|Sponsored|Advertisement|Contact|Share this|Comments|Related Articles|Back to top).*/gi,
        ""
      )
      .trim();

    console.log("Extracted and cleaned article text:", cleanedText);

    if (!cleanedText) {
      throw new Error("Failed to extract meaningful content from the article");
    }

    const summaryPrompt = `Give me a ${summaryLength} sized summary of this article: ${cleanedText}`;

    // Refine the prompt to produce a more specific summary
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: summaryPrompt,
          },
        ],
      });

      const summary = completion.choices[0].message.content.trim();
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
