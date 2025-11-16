import React from 'react';
import {
  Typography, Box, List, ListItem, ListItemText,
  IconButton, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// This component now accepts 'onEditDog'
function ManageDogsList({ dogs, onDeleteDog, onEditDog }) {

  const handleDeleteClick = (dog) => {
    if (window.confirm(`Are you sure you want to delete ${dog.name}?`)) {
      onDeleteDog(dog.id);
    }
  };

  // --- NEW: Edit Handler ---
  // This calls the function in the parent (AdminDashboard)
  // to open the modal with this specific dog's data.
  const handleEditClick = (dog) => {
    onEditDog(dog);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: 'auto', mb: 8 }}>
      <Typography variant="h5" gutterBottom>Manage Inventory ({dogs.length})</Typography>
      <Paper elevation={3}>
        <List>
          {dogs.map((dog) => (
            <ListItem
              key={dog.id}
              divider
              secondaryAction={
                <>
                  {/* --- NEW: Edit button is now wired up --- */}
                  <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => handleEditClick(dog)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(dog)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={dog.name}
                secondary={`${dog.breed.name} | Status: ${dog.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default ManageDogsList;