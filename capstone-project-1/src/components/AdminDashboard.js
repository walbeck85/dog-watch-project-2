// --- NEW: Import useState and useEffect ---
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert 
} from '@mui/material';

// I accept currentUser as a prop to show their name
function AdminDashboard({ currentUser }) {
  // --- NEW: State for the list of breeds ---
  const [breeds, setBreeds] = useState([]);

  // --- NEW: State for the form fields ---
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedBreedId, setSelectedBreedId] = useState('');
  const [status, setStatus] = useState('Available');

  // --- NEW: State for messages ---
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- NEW: Fetch all breeds on component load ---
  useEffect(() => {
    // I don't need to be logged in to see breeds,
    // but I'll fetch them here anyway.
    fetch("/breeds")
      .then(r => r.json())
      .then(setBreeds);
  }, []);

  // --- NEW: Handle form submission ---
  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // POST request to our /dogs API
    fetch("/dogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age), // Make sure age is an integer
        status: status,
        breed_id: selectedBreedId,
        // user_id is handled by the server via the session!
      }),
    })
    .then(r => {
      if (r.ok) {
        r.json().then(newDog => {
          // Success!
          setSuccess(`Success! ${newDog.name} has been added to the database.`);
          // Clear the form
          setName('');
          setAge('');
          setSelectedBreedId('');
          setStatus('Available');
        });
      } else {
        // Handle errors (like validation errors from the model)
        r.json().then(err => setError(err.error));
      }
    });
  }

  // Helper to create the dropdown <MenuItem> components
  const breedOptions = breeds.map(breed => (
    <MenuItem key={breed.id} value={breed.id}>
      {breed.name}
    </MenuItem>
  ));

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        {/* I use the currentUser prop passed down from App.js */}
        <Typography variant="h6">
          Welcome, {currentUser ? currentUser.username : 'Admin'}!
        </Typography>
      </Box>

      {/* --- NEW FORM --- */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          maxWidth: '500px',
          margin: 'auto'
        }}
      >
        <Typography variant="h5">Add a New Dog</Typography>
        
        {/* Success/Error Alerts */}
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Dog's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        
        {/* Breed Dropdown */}
        <FormControl fullWidth required>
          <InputLabel id="breed-select-label">Breed</InputLabel>
          <Select
            labelId="breed-select-label"
            id="breed-select"
            value={selectedBreedId}
            label="Breed"
            onChange={(e) => setSelectedBreedId(e.target.value)}
          >
            {/* Render the breed <MenuItem> components here */}
            {breedOptions}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" size="large">
          Add Dog
        </Button>
      </Box>
    </Container>
  );
}

export default AdminDashboard;