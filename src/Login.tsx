import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import api from './api';

type UserRole = 'admin' | 'manager' | 'worker' | 'customer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as UserRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Use session-based login
      await api.post('/auth/login', {
        email,
        password,
        role
      });
      // Navigate to the appropriate dashboard
      navigate(`/${role}`);
    } catch (err: any) {
      setError('Invalid credentials for the selected role');
    }
  };

  /**
   * Function: handleGoogleLoginSuccess
   * Parameters:
   *   credentialResponse (CredentialResponse): The response object returned by Google after successful login
   * Returns:
   *   void
   * Description:
   * Handles successful Google login, sends the credential to the backend for verification, and navigates the user.
   */
  const handleGoogleLogin = async () => {
    // Redirect to backend for Google OAuth
    window.location.href = 'http://localhost:5000/auth/google?role=admin';
  };

  /**
   * Function: handleGoogleLoginError
   * Parameters: none
   * Returns: void
   * Description:
   * Handles errors during Google login.
   */
  const handleGoogleLoginError = () => {
    setError('Google login failed. Please try again.');
  };

    const handleAuthCheck = async () => {
    try {
      await axios.get('http://localhost:5000/auth/status', { withCredentials: true })
      .then(res =>{console.log(`authenticated status = ${res.data.authenticated}`)})
    } catch (err) {
      console.error('Auth check error:', err);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="worker">Worker</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Don't have an account?
              </Typography>
              <Link 
                to="/signup" 
                style={{ 
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  display: 'block',
                  marginTop: '8px'
                }}
              >
                Sign Up Now
              </Link>
            </Box>
          </Box>
          <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width="100%"
            /> */}
            <button onClick={handleGoogleLogin}>
              google login
            </button>
            {/* <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2, mb: 2, textTransform: 'none' }}
              onClick={handleGoogleLogin}/> */}
          </Box>
          <Button onClick={handleAuthCheck}>Check auth status</Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 