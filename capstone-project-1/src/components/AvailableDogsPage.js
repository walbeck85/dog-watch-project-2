import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import DogCard from './DogCard'; // It correctly imports our new DogCard

function AvailableDogsPage() {
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This hook gets the ':api_id' from the URL
  const { api_id } = useParams();

  useEffect(() => {
    async function fetchAvailableDogs() {
      try {
        // Fetch from our new endpoint
        const response = await fetch(`/breeds/api/${api_id}/dogs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDogs(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAvailableDogs();
  }, [api_id]); // Re-run if the api_id in the URL changes

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error">Error: {error}</Alert>;

  // Get the breed name from the first dog for the title
  const breedName = dogs.length > 0 ? dogs[0].breed.name : "Dogs";

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available {breedName}s
      </Typography>
      
      {dogs.length === 0 ? (
        <Alert severity="info">No dogs of this breed are currently available at our shelter.</Alert>
      ) : (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
          mt: 4
        }}>
          {/* We pass the 'dog' prop to our universal card */}
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default AvailableDogsPage;