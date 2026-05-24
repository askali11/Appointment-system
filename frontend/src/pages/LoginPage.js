import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUserRole(response.data.user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '50px' }}>
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h3" sx={{ mb: 1, textAlign: 'center' }}>
          🏥
        </Typography>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Healthcare Appointments
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
          <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>
            Demo Credentials:
          </Typography>
          <Typography variant="caption" display="block">
            Patient: patient@test.com / password123
          </Typography>
          <Typography variant="caption" display="block">
            Doctor: doctor@test.com / password123
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
