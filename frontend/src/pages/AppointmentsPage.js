import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

function AppointmentsPage({ userRole }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      
      // Calculate stats
      setStats({
        total: response.data.length,
        scheduled: response.data.filter(a => a.status === 'scheduled').length,
        completed: response.data.filter(a => a.status === 'completed').length,
        cancelled: response.data.filter(a => a.status === 'cancelled').length
      });
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQueueInfo = async (appointmentId) => {
    try {
      const response = await axios.get(`/api/appointments/${appointmentId}/queue-position`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedApt({ ...selectedApt, queueInfo: response.data });
    } catch (err) {
      console.error('Error fetching queue info:', err);
    }
  };

  const openAppointmentDetails = (apt) => {
    setSelectedApt(apt);
    if (userRole === 'patient') {
      getQueueInfo(apt.id);
    }
    setOpenDialog(true);
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        📋 My Appointments
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total</Typography>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell>Date & Time</TableCell>
                <TableCell>{userRole === 'patient' ? 'Doctor' : 'Patient'}</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{moment(apt.appointmentDate).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell>
                    {userRole === 'patient'
                      ? `Dr. ${apt.doctor?.firstName} ${apt.doctor?.lastName}`
                      : `${apt.patient?.firstName} ${apt.patient?.lastName}`}
                  </TableCell>
                  <TableCell>{apt.reason}</TableCell>
                  <TableCell>{apt.duration} min</TableCell>
                  <TableCell>
                    <Chip label={apt.status} color={getStatusColor(apt.status)} />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => openAppointmentDetails(apt)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📋 Appointment Details</DialogTitle>
        <DialogContent>
          {selectedApt && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Date & Time:</strong> {moment(selectedApt.appointmentDate).format('DD/MM/YYYY HH:mm')}</Typography>
              <Typography><strong>Duration:</strong> {selectedApt.duration} minutes</Typography>
              <Typography><strong>Reason:</strong> {selectedApt.reason}</Typography>
              <Typography><strong>Status:</strong> {selectedApt.status}</Typography>
              
              {userRole === 'patient' && selectedApt.queueInfo && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="h6">👥 Queue Information</Typography>
                  <Typography>
                    <strong>Position in queue:</strong> {selectedApt.queueInfo.queuePosition}
                  </Typography>
                  <Typography>
                    <strong>Patients ahead:</strong> {selectedApt.queueInfo.patientsAhead}
                  </Typography>
                  <Typography>
                    <strong>Estimated wait time:</strong> {selectedApt.queueInfo.estimatedWaitTime} minutes
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AppointmentsPage;
