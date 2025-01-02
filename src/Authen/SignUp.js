import React, { useState } from 'react';
import { auth } from "../Admin/firebaseConfig";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login'); // Redirect to sign-in page after successful sign-up
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      style={{ minHeight: '80vh', padding: '16px' }} // Full height with padding
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: 3, 
            boxShadow: 3, 
            borderRadius: 2, 
            backgroundColor: '#ffffff' // Optional background for contrast
          }}
        >
          <Typography variant="h4" gutterBottom>Sign Up</Typography>
          {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
          
          <form onSubmit={handleSignUp} style={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button 
            type="submit"
            variant="contained"
            fullWidth
            sx={{
            marginTop: 2,
            backgroundColor: '#0b9299',
            '&:hover': {
            backgroundColor: '#08777d' // Optional hover effect for a darker shade
              }
            }}
            disabled={loading}
              >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'} 
            </Button>
          </form>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2">
              Already have an account? 
              <Button onClick={() => navigate('/login')} variant="text" color="primary">
                Sign In
              </Button>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;
