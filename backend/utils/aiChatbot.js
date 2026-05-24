const axios = require('axios');
const User = require('../models/User');

const generateChatResponse = async (message, userId) => {
  try {
    const user = await User.findByPk(userId);

    const systemPrompt = `You are a helpful healthcare appointment assistant. 
User: ${user.firstName} ${user.lastName} (${user.role})
Provide helpful information about appointments, health tips, and general healthcare queries.
Be professional and empathetic.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const category = categorizeMessage(message);

    return {
      text: response.data.choices[0].message.content,
      category
    };
  } catch (err) {
    console.error('AI Chatbot Error:', err);
    return {
      text: 'I apologize, but I encountered an error processing your request. Please try again later.',
      category: 'error'
    };
  }
};

const categorizeMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('appointment') || lowerMessage.includes('booking')) {
    return 'appointment';
  } else if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
    return 'doctor';
  } else if (lowerMessage.includes('symptoms') || lowerMessage.includes('health')) {
    return 'health';
  } else if (lowerMessage.includes('payment') || lowerMessage.includes('cost')) {
    return 'billing';
  } else if (lowerMessage.includes('wait') || lowerMessage.includes('queue')) {
    return 'queue';
  }
  return 'general';
};

module.exports = { generateChatResponse, categorizeMessage };