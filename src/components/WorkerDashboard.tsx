import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useLogout } from '../utils/authUtils';

const WorkerDashboard: React.FC = () => {
  const logout = useLogout();

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Worker Dashboard</Typography>
        <Button onClick={logout}>Logout</Button>
      </Box>
    </Container>
  );
};

export default WorkerDashboard; 