import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from './api';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
} from '@mui/material';
import axios from 'axios';

type UserRole = 'admin' | 'manager' | 'worker' | 'customer';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    // Use session-based signup (implement if backend supports, otherwise remove localStorage logic)
    try{  
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, 
        {
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          role: formData.role
        },
        {withCredentials: true}
      );

      setSuccess('Account created successfully!');
      setTimeout(() => {
        navigate(`/${formData.role}`);
      }, 2000);
      
    }catch(error){
      setError('There was a problem creating account');
      console.log("error in SignUp.tsx", error);
      return;
    }
  };

  const handleGoogleLogin = async () => {
    // Redirect to backend for Google OAuth
    console.log(`backend url: ${process.env.REACT_APP_BACKEND_URL}`)
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google?role=admin`;
    };

  /**
   * Function: handleGoogleSignUpSuccess
   * Parameters:
   *   credentialResponse (CredentialResponse): The response object returned by Google after successful login
   * Returns:
   *   void
   * Description:
   * Handles successful Google signup, sends the credential to the backend for verification, and navigates the user.
   */
  const handleGoogleSignUpSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google signup success:', credentialResponse);
    if (credentialResponse.credential) {
      try {
        // Send Google token to backend for verification and user creation
        const response = await api.post('/auth/google-signup', {
          token: credentialResponse.credential
        });

        // No localStorage usage, just show success and redirect
        setSuccess('Google account linked successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError('Failed to create account with backend. Please try again.');
      }
    }
  };

  /**
   * Function: handleGoogleSignUpError
   * Parameters: none
   * Returns: void
   * Description:
   * Handles errors during Google signup.
   */
  const handleGoogleSignUpError = () => {
    setError('Google signup failed. Please try again.');
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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="worker">Worker</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
          
          <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={handleGoogleLogin}>
              Sign up with Google
            </button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp; 