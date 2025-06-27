import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Alert, 
  Collapse, 
  IconButton,
  AlertColor
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

interface UserData {
  email: string;
  isVerified: boolean;
  name: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  user?: UserData;
  message?: string;
}

interface VerificationStatus {
  message: string;
  severity: AlertColor;
}

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, { withCredentials: true });
      //await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
      //await axios.get('https://auth-backend-zqbv.onrender.com/api/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const { data } = await axios.get<ApiResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/status`, 
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (data.user) {
          setIsVerified(data.user.isVerified);
          if (!data.user.isVerified) {
            setVerificationStatus({
              message: 'Please check your email to verify your account.',
              severity: 'warning'
            });
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        console.log('Falling back to test mode for verification banner');
        setIsVerified(false);
        setVerificationStatus({
          message: 'Please check your email to verify your account. [TEST MODE]',
          severity: 'warning'
        });
      }
    };
    
    checkVerification();
  }, []);

  const handleResendVerification = async () => {
    try {
      setVerificationStatus({
        message: 'Please check your email for the verification link. If you didn\'t receive it, please try registering again.',
        severity: 'info'
      });
      
    } catch (error) {
      console.error('Error handling verification resend:', error);
      setVerificationStatus({
        message: 'An error occurred. Please try again later.',
        severity: 'error'
      });
    }
  };

  const handleAuthCheck = async () => {
    try {
      //await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true })
      //await axios.get('http://localhost:5000/auth/status', { withCredentials: true })
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true })
      .then(res =>{console.log(`authenticated status = ${res.data.authenticated}`)})
    } catch (err) {
      console.error('Auth check error:', err);
    }
  }



  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Customer Dashboard</Typography>
        
        {/* Verification Banner */}
        {!isVerified && showBanner && (
          <Alert 
            severity="warning" 
            action={
              <>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleResendVerification}
                  disabled={verificationStatus?.severity === 'success'}
                >
                  Resend Verification
                </Button>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowBanner(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </>
            }
            sx={{ mb: 2 }}
          >
            {verificationStatus?.message || 'Please verify your email address to access all features.'}
          </Alert>
        )}

        {/* Verification Status Message */}
        {verificationStatus && (
          <Collapse in={!!verificationStatus}>
            <Alert 
              severity={verificationStatus.severity}
              sx={{ mb: 2 }}
              onClose={() => setVerificationStatus(null)}
            >
              {verificationStatus.message}
            </Alert>
          </Collapse>
        )}

        <Box sx={{ mt: 2 }}>
          <Button onClick={handleLogout} variant="outlined" sx={{ mr: 1 }}>Logout</Button>
          <Button onClick={handleAuthCheck} variant="outlined">Check auth status</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerDashboard; 