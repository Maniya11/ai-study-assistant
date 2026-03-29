const Conversation = require("../models/Conversation");
const { generateResponse } = require("../utils/llmService");

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let conversation;

    // If conversation exists
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Add user message
      conversation.messages.push({ role: "user", content: message });

      // 🔥 Send full conversation to AI
      const aiReply = await generateResponse(conversation.messages);

      // Save AI response
      conversation.messages.push({
        role: "assistant",
        content: aiReply,
      });

      await conversation.save();

      return res.status(200).json({
        reply: aiReply,
        conversationId: conversation._id,
      });
    }

    // If new conversation
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI study assistant. Explain concepts clearly with examples.",
      },
      { role: "user", content: message },
    ];

    const aiReply = await generateResponse(messages);

    const newConversation = new Conversation({
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: aiReply },
      ],
    });

    await newConversation.save();

    res.status(200).json({
      reply: aiReply,
      conversationId: newConversation._id,
    });

  }catch (error) {
  console.error("FULL ERROR:", error);
  res.status(500).json({ error: error.message });
  }
};