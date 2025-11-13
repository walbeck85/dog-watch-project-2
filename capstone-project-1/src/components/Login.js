import React, { useState } from 'react';
// --- NEW IMPORTS ---
import { useNavigate } from 'react-router-dom'; 
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';

// --- NEW PROP ---
// I accept setCurrentUser from App.js
function Login({ setCurrentUser }) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // --- NEW STATE ---
  const [error, setError] = useState(null);
  
  // --- NEW HOOK ---
  const navigate = useNavigate(); // For redirecting

  // --- UPDATED SUBMIT FUNCTION ---
  function handleSubmit(e) {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Fetch request to our Flask server's /login route
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then(r => {
      if (r.ok) {
        // If login is successful:
        r.json().then(user => {
          setCurrentUser(user); // 1. Set the user in App.js state
          navigate('/admin');   // 2. Redirect to the admin dashboard
        });
      } else {
        // If login fails (401 Unauthorized):
        r.json().then(err => setError(err.error)); // Show the error
      }
    });
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
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* --- NEW ERROR DISPLAY --- */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 1 }}>
              {error}
            </Alert>
          )}
          {/* --- END NEW ERROR DISPLAY --- */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;