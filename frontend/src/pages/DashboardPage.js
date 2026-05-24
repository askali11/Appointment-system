import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DashboardPage({ userRole }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      let statsData = {
        total: response.data.length,
        scheduled: response.data.filter(a => a.status === 'scheduled').length,
        completed: response.data.filter(a => a.status === 'completed').length
      };

      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">
          Welcome, {user.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          {userRole === 'patient'
            ? 'Manage your healthcare appointments efficiently'
            : 'Manage your patient queue and appointments'}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Appointments</Typography>
                  <Typography variant="h5">{stats.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Scheduled</Typography>
                  <Typography variant="h5" color="primary">{stats.scheduled}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Completed</Typography>
                  <Typography variant="h5" color="success">{stats.completed}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Typography variant="h6">📅 My Appointments</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
                    View and manage all your appointments
                  </Typography>
                  <Link to="/appointments" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small">View</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>

            {userRole === 'patient' && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Typography variant="h6">🔖 Book Appointment</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
                      Schedule a new appointment with a doctor
                    </Typography>
                    <Link to="/book-appointment" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" size="small">Book</Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {userRole === 'doctor' && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Typography variant="h6">👥 Patient Queue</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
                      View your patient queue and manage priorities
                    </Typography>
                    <Link to="/queue" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" size="small">View Queue</Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Typography variant="h6">💬 AI Chatbot</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
                    Chat with our AI assistant for help
                  </Typography>
                  <Link to="/chatbot" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small">Chat</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default DashboardPage;
