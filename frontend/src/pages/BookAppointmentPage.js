import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Paper, Typography, CircularProgress, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    reason: '',
    duration: 30
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Get unique doctors from appointments
      const uniqueDoctors = {};
      response.data.forEach(apt => {
        if (apt.doctor && !uniqueDoctors[apt.doctor.id]) {
          uniqueDoctors[apt.doctor.id] = apt.doctor;
        }
      });
      setDoctors(Object.values(uniqueDoctors));
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        '/api/appointments/book',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('✅ Appointment booked successfully!');
      setFormData({
        doctorId: '',
        appointmentDate: '',
        reason: '',
        duration: 30
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          📅 Book an Appointment
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Select Doctor"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            margin="normal"
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Appointment Date & Time"
            name="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Reason for Visit"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />

          <TextField
            select
            fullWidth
            label="Duration (minutes)"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={45}>45 minutes</MenuItem>
            <MenuItem value={60}>60 minutes</MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default BookAppointmentPage;
