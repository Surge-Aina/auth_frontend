import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Customer Dashboard</Typography>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Container>
  );
};

export default CustomerDashboard; 