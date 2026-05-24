const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const auth = require('../middleware/auth');
const { generateChatResponse } = require('../utils/aiChatbot');
const router = express.Router();

/**
 * @route POST /api/chatbot/message
 * @desc Send message to AI chatbot
 * @access Private
 */
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;

    const userMessage = await ChatMessage.create({
      userId: req.user.id,
      message,
      sender: 'user'
    });

    const response = await generateChatResponse(message, req.user.id);

    await ChatMessage.create({
      userId: req.user.id,
      message: response.text,
      response: response.text,
      sender: 'ai',
      category: response.category
    });

    res.json({
      response: response.text,
      category: response.category
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing message' });
  }
});

/**
 * @route GET /api/chatbot/history
 * @desc Get chat history for user
 * @access Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']],
      limit: 50
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.module = router;