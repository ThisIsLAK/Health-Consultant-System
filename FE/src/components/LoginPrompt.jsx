import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

/**
 * A reusable component to display when authentication is required
 * @param {Object} props Component props
 * @param {string} props.message Custom message to display (optional)
 * @param {string} props.title Custom title to display (optional)
 * @param {string} props.buttonText Custom button text (optional)
 * @param {function} props.onButtonClick Custom button click handler (optional)
 */
const LoginPrompt = ({ 
  message = "You need to be logged in to access this feature.",
  title = "Authentication Required",
  buttonText = "Go to Login",
  onButtonClick
}) => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate('/login');
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <LockOutlined sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleButtonClick}
          sx={{ 
            px: 4, 
            py: 1.5,
            fontSize: '1rem'
          }}
        >
          {buttonText}
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPrompt;
