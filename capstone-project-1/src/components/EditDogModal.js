import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Grid, TextField, Button,
  Autocomplete, Alert
} from '@mui/material';

// --- Style for the Modal Box ---
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: 700 }, // Responsive width
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh', // Make modal scrollable
  overflowY: 'auto' // Make modal scrollable
};

// This modal receives the dog to edit, all breeds,
// and functions to close it and handle the update
function EditDogModal({ dog, breeds, open, onClose, onUpdateDog }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // --- Pre-populate the form when the 'dog' prop changes ---
  useEffect(() => {
    if (dog) {
      setFormData({
        ...dog,
        // Ensure breed_id is just the ID, not the whole object
        breed_id: dog.breed.id 
      });
    } else {
      // Clear form if no dog is selected
      setFormData({});
    }
  }, [dog]); // This effect re-runs when 'dog' changes

  // --- Handlers for form fields ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBreedChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, breed_id: newValue ? newValue.id : null }));
  };

  // --- Handle the PATCH request ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const updatedData = {
      ...formData,
      age: parseInt(formData.age) || null
    };

    fetch(`/dogs/${dog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
    .then(r => {
      if (r.ok) {
        r.json().then(updatedDog => {
          onUpdateDog(updatedDog); // Pass the updated dog back to the parent
          onClose(); // Close the modal
        });
      } else {
        r.json().then(err => setError(err.error));
      }
    });
  };

  // Find the full breed object for the Autocomplete's 'value' prop
  const selectedBreedObject = breeds.find(b => b.id === formData.breed_id) || null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-dog-modal-title"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography id="edit-dog-modal-title" variant="h6" component="h2">
          Edit {dog ? dog.name : 'Dog'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dog's Name"
              name="name"
              value={formData.name || ''}
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
              value={selectedBreedObject}
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
              value={formData.age || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight (e.g., 50-70 lbs)"
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <TextField
              label="Temperament (e.g., Playful, Loyal)"
              name="temperament"
              value={formData.temperament || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL (http://...)"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description || ''}
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
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default EditDogModal;