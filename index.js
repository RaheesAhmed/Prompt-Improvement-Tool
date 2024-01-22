import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

const app = express();
app.use(express.json());
app.use(express.static("public"));
const responseCache = {};

async function getResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting response:", error);
    throw new Error("Error in OpenAI Completion");
  }
}

async function getImprovedPrompt(originalPrompt, systemMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Improve this prompt: ${originalPrompt}` },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error improving prompt:", error);
    throw new Error("Error in OpenAI Completion");
  }
}

app.post("/improve-prompt", async (req, res) => {
  const originalPrompt = req.body.originalPrompt;
  console.log("Original Prompt:", originalPrompt);
  // Check cache
  if (responseCache[originalPrompt]) {
    return res.json(responseCache[originalPrompt]);
  }
  if (!originalPrompt) {
    return res.status(400).send("Invalid request. Please provide a prompt.");
  }

  try {
    const systemMessages = [
      // Version 1: Detailed and Specific
      "You are a detailed-oriented assistant. Your task is to improve this prompt by adding depth and specificity. Focus on providing comprehensive and precise information, ensuring thoroughness and factual accuracy. Enhance the prompt with relevant details, examples, and explanations that deepen understanding of the topic.",
      // Version 2: Engaging and Detailed
      "You are a versatile and skilled assistant, adept at refining and enhancing prompts. Your objective is to take the provided prompt and elevate it to its fullest potential. Focus on making the prompt clearer, more informative, and engaging. Ensure that the improved prompt provides a comprehensive and precise query or instruction, encouraging detailed and thoughtful responses. While maintaining factual accuracy and relevance, inject a degree of creativity or intrigue where appropriate to make the prompt not only informative but also captivating. Adapt your approach based on the nature of the prompt, whether it requires technical detail, narrative depth, or creative flair, and tailor it to evoke rich and insightful responses.",
    ];

    const originalResponse = await getResponse(originalPrompt); // Get response for the original prompt

    const improvedPrompts = await Promise.all(
      systemMessages.map((message) =>
        getImprovedPrompt(originalPrompt, message)
      )
    );

    const improvedResponses = await Promise.all(
      improvedPrompts.map(
        (improvedPrompt) => getResponse(improvedPrompt) // Get responses for the improved prompts
      )
    );

    // Cache the response
    responseCache[originalPrompt] = {
      originalPrompt,
      originalResponse,
      improvedPrompts,
      improvedResponses,
    };

    res.json(responseCache[originalPrompt]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
