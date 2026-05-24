import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

function DoctorQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorId = user.id;

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/appointments/doctor/${doctorId}/queue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueue(response.data.queue);
      setStats({
        totalInQueue: response.data.totalInQueue,
        urgent: response.data.queue.filter(a => a.priority === 'urgent').length,
        high: response.data.queue.filter(a => a.priority === 'high').length
      });
    } catch (err) {
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'default'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'primary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">👥 My Queue</Typography>
        <Button variant="contained" color="primary" onClick={fetchQueue} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Refresh'}
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Patients</Typography>
              <Typography variant="h5">{stats.totalInQueue || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Urgent</Typography>
              <Typography variant="h5" color="error">{stats.urgent || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">High Priority</Typography>
              <Typography variant="h5" color="warning">{stats.high || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading && queue.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell>#</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Appointment Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((apt, index) => (
                <TableRow key={apt.id}>
                  <TableCell><strong>{index + 1}</strong></TableCell>
                  <TableCell>{apt.patient?.firstName} {apt.patient?.lastName}</TableCell>
                  <TableCell>{moment(apt.appointmentDate).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell>{apt.duration} min</TableCell>
                  <TableCell>
                    <Chip label={apt.priority} color={getPriorityColor(apt.priority)} />
                  </TableCell>
                  <TableCell>
                    <Chip label={apt.status} color={getStatusColor(apt.status)} />
                  </TableCell>
                  <TableCell>{apt.patient?.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default DoctorQueuePage;
