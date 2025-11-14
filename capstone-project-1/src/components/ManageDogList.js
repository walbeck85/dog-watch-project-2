import React from 'react';
import {
  Typography, Box, List, ListItem, ListItemText,
  IconButton, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// This is a "dumb" component. It just receives the list of dogs
// and a function to call when the delete button is clicked.
function ManageDogsList({ dogs, onDeleteDog }) {

  const handleDeleteClick = (dog) => {
    // Show a confirmation before deleting
    if (window.confirm(`Are you sure you want to delete ${dog.name}?`)) {
      // Call the parent's delete function
      onDeleteDog(dog.id);
    }
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
                  <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
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