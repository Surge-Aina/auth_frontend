import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
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

type UserRole = 'admin' | 'manager' | 'worker' | 'customer';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    // Store user credentials in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message and redirect
    setSuccess('Account created successfully!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  /**
   * Function: handleGoogleSignUpSuccess
   * Parameters:
   *   credentialResponse (CredentialResponse): The response object returned by Google after successful login
   * Returns:
   *   void
   * Description:
   * Handles successful Google signup, decodes the credential to get user info, and stores it in localStorage.
   */
  const handleGoogleSignUpSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google signup success:', credentialResponse);
    if (credentialResponse.credential) {
      // Decode the Google ID token to get user info
      const userInfo = decodeJwt(credentialResponse.credential);
      if (userInfo) {
        // Store Google user info
        localStorage.setItem('googleUser', JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        }));
        
        // For Google signup, you might want to prompt for role selection
        // For now, default to customer role
        localStorage.setItem('userRole', 'customer');
        
        setSuccess('Google account linked successfully!');
        setTimeout(() => {
          navigate('/customer');
        }, 2000);
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
            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={handleGoogleSignUpError}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp; 