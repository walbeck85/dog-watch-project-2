import React, { useState, useEffect } from "react";
import BreedCard from "./BreedCard";
import SearchBar from "./SearchBar";
import { Box, Typography, CircularProgress, Container, Alert } from '@mui/material';

function BreedList() {
  // --- STATE MANAGEMENT ---
  const [dogs, setDogs] = useState([]); // Renamed from 'breeds' to 'dogs' to be accurate
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchDogs() {
      try {
        // FETCH FROM OUR LOCAL API
        const response = await fetch("/dogs"); 
        
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
    fetchDogs();
  }, []); 

  // --- FILTERING LOGIC ---
  // We filter by Dog Name OR Breed Name
  const processedDogs = dogs.filter((dog) => {
    const searchLower = searchTerm.toLowerCase();
    const dogNameMatch = dog.name.toLowerCase().includes(searchLower);
    // We safely access breed.name because our Marshmallow schema guarantees it's there
    const breedNameMatch = dog.breed && dog.breed.name.toLowerCase().includes(searchLower);
    
    return dogNameMatch || breedNameMatch;
  });

  // --- RENDER LOGIC ---
  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <Box sx={{ p: 2 }}>
      
      {/* Title Area */}
      <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Dogs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse our current inventory of adoptable pets.
        </Typography>
      </Box>

      {/* Controls Area */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 4 
      }}>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </Box>

      {/* Empty State Handling */}
      {processedDogs.length === 0 ? (
        <Container maxWidth="sm">
          <Alert severity="info">
            No dogs found. Admin needs to add inventory via the Dashboard!
          </Alert>
        </Container>
      ) : (
        /* Grid Display Area */
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {/* We pass the 'dog' object to the card instead of 'breed' */}
          {processedDogs.map((dog) => (
            <BreedCard key={dog.id} dog={dog} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default BreedList;