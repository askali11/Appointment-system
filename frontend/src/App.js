import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import ChatbotPage from './pages/ChatbotPage';
import DoctorQueuePage from './pages/DoctorQueuePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <>
      <CssBaseline />
      {token && (
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              🏥 Healthcare Appointments
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/appointments')}>My Appointments</Button>
              {userRole === 'patient' && (
                <Button color="inherit" onClick={() => navigate('/book-appointment')}>Book</Button>
              )}
              {userRole === 'doctor' && (
                <Button color="inherit" onClick={() => navigate('/queue')}>My Queue</Button>
              )}
              <Button color="inherit" onClick={() => navigate('/chatbot')}>💬 Chat</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage setUserRole={setUserRole} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage userRole={userRole} /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointments"
          element={token ? <AppointmentsPage userRole={userRole} /> : <Navigate to="/login" />}
        />
        <Route
          path="/book-appointment"
          element={token && userRole === 'patient' ? <BookAppointmentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/queue"
          element={token && userRole === 'doctor' ? <DoctorQueuePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chatbot"
          element={token ? <ChatbotPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
