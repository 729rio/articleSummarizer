const express = require("express");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: "your-openai-api-key", // Replace with your actual API key
});
const openai = new OpenAIApi(configuration);

app.post("/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    // Fetch article content (simulated here for brevity)
    const articleContent = await axios.get(url).then((res) => res.data);

    // Generate summary using GPT
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a news summarizer." },
        {
          role: "user",
          content: `Summarize the following article: ${articleContent}`,
        },
      ],
    });

    const summary = completion.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
