import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Worker Dashboard</Typography>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Container>
  );
};

export default WorkerDashboard; 