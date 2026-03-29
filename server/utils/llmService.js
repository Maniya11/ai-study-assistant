require("dotenv").config();
const knowledge = require("../data/knowledge");

let generator;

// Load model
const loadModel = async () => {
  if (!generator) {
    console.log("Loading AI model...");

    const { pipeline } = await import("@xenova/transformers");

    generator = await pipeline("text-generation", "Xenova/distilgpt2");

    console.log("Model loaded");
  }
};

const generateResponse = async (messages) => {
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  // 🔥 Check knowledge base
  for (let key in knowledge) {
    if (userMessage.includes(key)) {
      return knowledge[key];
    }
  }

  // 👉 fallback to AI
  try {
    await loadModel();

    const output = await generator(userMessage, {
      max_new_tokens: 60,
    });

    let text = output[0]?.generated_text || "";
    text = text.replace(userMessage, "").trim();

    if (text.length < 10) {
      return "I am still learning. Please try asking in a different way.";
    }

    return text;

  } catch (error) {
    console.error("HF ERROR:", error);
    throw error;
  }
};

module.exports = { generateResponse };