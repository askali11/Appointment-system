import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Paper, TextField, Button, Typography, CircularProgress, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import axios from 'axios';

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('/api/chatbot/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/chatbot/message',
        { message: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: response.data.response,
        category: response.data.category,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        💬 AI Health Assistant
      </Typography>

      <Paper sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
        <List>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <Typography color="textSecondary">
                👋 Welcome! Ask me about appointments, health tips, or general queries.
              </Typography>
            </Box>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id}>
                <ListItem sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
                      color: msg.sender === 'user' ? 'white' : 'black'
                    }}
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                  </Box>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </div>
            ))
          )}
          {loading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Ask me anything about your health or appointments..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Container>
  );
}

export default ChatbotPage;
