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
      // Get stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching email, password, and role
      const user = users.find((u: any) => 
        u.email === email && 
        u.password === password && 
        u.role === role
      );

      if (user) {
        // Store role in localStorage
        localStorage.setItem('userRole', role);
        // Navigate to the appropriate dashboard
        navigate(`/${role}`);
      } else {
        setError('Invalid credentials for the selected role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  /**
   * Function: decodeJwt
   * Parameters:
   *   token (string): The JWT token to decode
   * Returns:
   *   object: The decoded payload of the JWT
   * Description:
   * Decodes a JWT token and returns its payload as a JavaScript object.
   */
  function decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  /**
   * Function: handleGoogleLoginSuccess
   * Parameters:
   *   credentialResponse (CredentialResponse): The response object returned by Google after successful login
   * Returns:
   *   void
   * Description:
   * Handles successful Google login, sends the credential to the backend for verification, and navigates the user.
   */
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google login success:', credentialResponse);
    if (credentialResponse.credential) {
      try {
        // Send Google token to backend for verification
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/google`, {
          token: credentialResponse.credential
        });

        const { role, user } = response.data;
        
        // Store user info and role from backend
        localStorage.setItem('userRole', role);
        localStorage.setItem('googleUser', JSON.stringify(user));
        
        // Navigate to appropriate dashboard
        navigate(`/${role}`);
        
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError('Failed to authenticate with backend. Please try again.');
      }
    }
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
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width="100%"
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 