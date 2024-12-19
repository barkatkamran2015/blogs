import React, { useState } from 'react';
import { auth } from "../Admin/firebaseConfig";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admindashboard'); // Redirect to home page after successful login
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
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
      style={{ minHeight: '80vh', padding: '16px' }} // Full height with padding for mobile
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
            backgroundColor: '#ffffff' // Optional for better contrast
          }}
        >
          <Typography variant="h4" gutterBottom>Sign In</Typography>
          {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
          
          <form onSubmit={handleSignIn} style={{ width: '100%' }}>
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
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2">
              Don't have an account? 
              <Button onClick={() => navigate('/signup')} variant="text" color="#0b9299">
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignIn;
