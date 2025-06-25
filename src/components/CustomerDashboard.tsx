import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      //await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, { withCredentials: true });
      //await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
      await axios.get('https://auth-backend-zqbv.onrender.com/auth/logout', { withCredentials: true });
      navigate('/');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAuthCheck = async () => {
    try {
      //await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true })
      //await axios.get('http://localhost:5000/auth/status', { withCredentials: true })
      await axios.get('https://auth-backend-zqbv.onrender.com/auth/status', { withCredentials: true })
      .then(res =>{console.log(`authenticated status = ${res.data.authenticated}`)})
    } catch (err) {
      console.error('Auth check error:', err);
    }
  }



  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Customer Dashboard</Typography>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={handleAuthCheck}>Check auth status</Button>
      </Box>
    </Container>
  );
};

export default CustomerDashboard; 