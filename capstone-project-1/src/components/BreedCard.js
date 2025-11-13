import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Chip } from '@mui/material';
import './BreedCard.css';

// We now accept a 'dog' prop instead of 'breed'
function BreedCard({ dog }) {
  
  // Safely handle cases where dog or breed might be missing
  if (!dog) return null;

  return (
    <Card sx={{ maxWidth: 345, width: '100%', boxShadow: 3 }}>
      {/* NOTE: We don't have images in our local DB yet!
        We could add a placeholder image here if we wanted.
      */}
      <div style={{ height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          No Image Available
        </Typography>
      </div>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {dog.name}
        </Typography>
        
        <Typography variant="subtitle1" color="primary" gutterBottom>
          {dog.breed ? dog.breed.name : "Unknown Breed"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>Age:</strong> {dog.age} years old
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Status:</strong>
        </Typography>
        <Chip 
          label={dog.status} 
          color={dog.status === 'Available' ? "success" : "default"} 
          size="small" 
          sx={{ mt: 0.5 }}
        />
      </CardContent>

      <CardActions>
        <Button size="small">Learn More</Button>
        {/* In the future, we could link this to a contact form
           or adoption application.
        */}
      </CardActions>
    </Card>
  );
}

export default BreedCard;