import React, { useState, useEffect } from "react";
import BreedCard from "./BreedCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TemperamentFilter from "./TemperamentFilter";

import { Box, Button } from '@mui/material';

function BreedList() {
  // --- STATE MANAGEMENT ---
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [allTemperaments, setAllTemperaments] = useState([]);
  const [selectedTemperaments, setSelectedTemperaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // This state now controls the Dialog

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await fetch("https://api.thedogapi.com/v1/breeds", {
          headers: {
            "x-api-key": process.env.REACT_APP_DOG_API_KEY,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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

  // --- HELPER FUNCTIONS ---
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

  // --- FILTERING & SORTING LOGIC ---
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
  if (isLoading) return <h2>Loading breeds...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <Box sx={{ p: 2 }}>
      
      {/* Controls Area */}
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

      {/*
        Removed the <Modal> wrapper and are just rendering
        our new <TemperamentFilter> component, which IS the modal.
      */}
      <TemperamentFilter
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allTemperaments={allTemperaments}
        selectedTemperaments={selectedTemperaments}
        onTemperamentChange={setSelectedTemperaments}
      />

      {/* Grid Display Area (No Changes) */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
        justifyItems: "center",
        maxWidth: "1400px",
        margin: "1.5rem auto"
      }}>
        {processedBreeds.map((breed) => (
          <BreedCard key={breed.id} breed={breed} />
        ))}
      </Box>
    </Box>
  );
}

export default BreedList;