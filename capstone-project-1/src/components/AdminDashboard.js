import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, TextField, Button, 
  Alert, Grid,
  Autocomplete,
  CircularProgress // <-- Import loading spinner
} from '@mui/material';
import ManageDogsList from './ManageDogList'; // <-- FIX: Changed to singular 'ManageDogList' to match your file

function AdminDashboard({ currentUser }) {
  // --- STATE FOR DATA ---
  const [breeds, setBreeds] = useState([]); // For the dropdown
  const [dogs, setDogs] = useState([]); // <-- NEW: Holds the list of all dogs
  const [isLoading, setIsLoading] = useState(true); // <-- NEW: Loading state

  // --- STATE FOR "ADD DOG" FORM ---
  const initialFormData = {
    name: '', age: '', status: 'Available', image_url: '',
    weight: '', temperament: '', description: '', breed_id: null
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // --- NEW: State for the Manage List (e.g., delete errors) ---
  const [listError, setListError] = useState(null);

  // --- FETCH BOTH BREEDS AND DOGS ON LOAD ---
  useEffect(() => {
    Promise.all([
      fetch("/breeds"),
      fetch("/dogs") // <-- Fetch all dogs
    ])
    .then(([breedsRes, dogsRes]) => {
      if (breedsRes.ok && dogsRes.ok) {
        return Promise.all([breedsRes.json(), dogsRes.json()]);
      } else {
        throw new Error('Failed to fetch initial data');
      }
    })
    .then(([breedsData, dogsData]) => {
      setBreeds(breedsData);
      setDogs(dogsData);
      setIsLoading(false);
    })
    .catch(err => {
      setFormError(err.message);
      setListError(err.message);
      setIsLoading(false);
    });
  }, []); // Runs once on component mount

  // --- FORM HANDLERS (for AddDogForm) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };
  
  const handleBreedChange = (event, newValue) => {
    setFormData(prevData => ({ ...prevData, breed_id: newValue ? newValue.id : null }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    const newDogData = { ...formData, age: parseInt(formData.age) || null };

    fetch("/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDogData),
    })
    .then(r => {
      if (r.ok) {
        r.json().then(newDog => {
          setFormSuccess(`Success! ${newDog.name} has been added.`);
          setFormData(initialFormData); // Clear the form
          // --- BUG FIX: Add new dog to the state ---
          setDogs(currentDogs => [...currentDogs, newDog]);
        });
      } else {
        r.json().then(err => setFormError(err.error));
      }
    });
  }

  // --- NEW: DELETE HANDLER (for ManageDogsList) ---
  function handleDeleteDog(id) {
    setListError(null);
    fetch(`/dogs/${id}`, {
      method: "DELETE",
    })
    .then(r => {
      if (r.ok) {
        // --- On success, remove dog from state ---
        setDogs(currentDogs => currentDogs.filter(dog => dog.id !== id));
      } else {
        r.json().then(err => setListError(err.error));
      }
    });
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6">
          Welcome, {currentUser ? currentUser.username : 'Admin'}!
        </Typography>
      </Box>

      {/* --- "ADD DOG" FORM --- */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ maxWidth: '800px', margin: 'auto', mb: 8 }} 
      >
        <Typography variant="h5" gutterBottom>Add a New Dog</Typography>
        
        {formSuccess && <Alert severity="success" sx={{ mb: 2 }}>{formSuccess}</Alert>}
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        {/* --- Correct MUI v5 Grid Syntax --- */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dog's Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={breeds}
              getOptionLabel={(option) => option.name}
              onChange={handleBreedChange}
              value={breeds.find(b => b.id === formData.breed_id) || null}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Breed" required />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight (e.g., 50-70 lbs)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <TextField
              label="Temperament (e.g., Playful, Loyal)"
              name="temperament"
              value={formData.temperament}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL (http://...)"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
            >
              Add Dog
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* --- RENDER THE "MANAGE DOGS" LIST --- */}
      <Box sx={{ maxWidth: '800px', margin: 'auto' }}>
        {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ManageDogsList dogs={dogs} onDeleteDog={handleDeleteDog} />
        )}
      </Box>

    </Container>
  );
}

export default AdminDashboard;