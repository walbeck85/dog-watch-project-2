import React, { useState, useEffect } from "react";
import BreedCard from "./BreedCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TemperamentFilter from "./TemperamentFilter";
import { Box, Button, Typography, CircularProgress } from '@mui/material';

function BreedList() {
  // --- STATE MANAGEMENT ---
  const [breeds, setBreeds] = useState([]); // This will hold breeds from TheDogAPI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [allTemperaments, setAllTemperaments] = useState([]);
  const [selectedTemperaments, setSelectedTemperaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchBreeds() {
      try {
        // We are back to fetching from the external API
        const response = await fetch("https://api.thedogapi.com/v1/breeds", {
          headers: {
            "x-api-key": process.env.REACT_APP_DOG_API_KEY, // Make sure your .env file has this!
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // This is where we will "augment" the data
        // For now, just set the breeds
        setBreeds(data);

        // Calculate all temperaments
        const temperamentsSet = new Set();
        data.forEach(breed => {
          if (breed.temperament) {
            breed.temperament.split(', ').forEach(temp => temperamentsSet.add(temp.trim()));
          }
        });
        setAllTemperaments([...temperamentsSet].sort()); 

      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBreeds();
  }, []); 

  // --- HELPER FUNCTIONS (Back to original P1 logic) ---
  const getAverageFromRange = (rangeString) => {
    if (!rangeString) return 0;
    const numbers = rangeString.match(/\d+/g);
    if (!numbers) return 0;
    const sum = numbers.reduce((sum, val) => sum + parseInt(val, 10), 0);
    return sum / (numbers.length || 1);
  }
  const getAverageWeight = (breed) => getAverageFromRange(breed.weight?.imperial);
  const getAverageHeight = (breed) => getAverageFromRange(breed.height?.imperial);
  const getAverageLifespan = (breed) => getAverageFromRange(breed.life_span);

  // --- FILTERING & SORTING LOGIC (Back to original P1 logic) ---
  const processedBreeds = breeds
    .filter((breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((breed) => {
      if (selectedTemperaments.length === 0) return true;
      if (!breed.temperament) return false;
      return selectedTemperaments.every(temp => 
        breed.temperament.includes(temp)
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "weight-asc": return getAverageWeight(a) - getAverageWeight(b);
        case "weight-desc": return getAverageWeight(b) - getAverageWeight(a);
        case "height-asc": return getAverageHeight(a) - getAverageHeight(b);
        case "height-desc": return getAverageHeight(b) - getAverageHeight(a);
        case "lifespan-asc": return getAverageLifespan(a) - getAverageLifespan(b);
        case "lifespan-desc": return getAverageLifespan(b) - getAverageLifespan(a);
        default: return 0;
      }
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
      
      {/* Controls Area (Back to original P1 logic) */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem', 
        maxWidth: '1000px', 
        margin: 'auto',
        mb: 2
      }}>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <SortDropdown sortOrder={sortOrder} onSortChange={setSortOrder} />
        
        <Button 
          variant="contained" 
          onClick={() => setIsModalOpen(true)}
          sx={{ m: "1rem 0" }} 
        >
          Filter Temperaments ({selectedTemperaments.length})
        </Button>

        {selectedTemperaments.length > 0 && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => setSelectedTemperaments([])}
            sx={{ m: "1rem 0" }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <TemperamentFilter
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allTemperaments={allTemperaments}
        selectedTemperaments={selectedTemperaments}
        onTemperamentChange={setSelectedTemperaments}
      />

      {/* Grid Display Area */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
        justifyItems: "center",
        maxWidth: "1400px",
        margin: "1.5rem auto"
      }}>
        {/* We are back to passing 'breed' as the prop */}
        {processedBreeds.map((breed) => (
          <BreedCard key={breed.id} breed={breed} />
        ))}
      </Box>
    </Box>
  );
}

export default BreedList;