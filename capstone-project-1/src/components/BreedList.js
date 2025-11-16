import React, { useState, useEffect, useContext } from "react"; // 1. Import useContext
import { CompareContext } from "../context/CompareContext"; // 2. Import CompareContext
import DogCard from "./DogCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TemperamentFilter from "./TemperamentFilter";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Switch,
  FormControlLabel 
} from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll'; // 3. Import the icon

function BreedList() {
  // --- STATE MANAGEMENT ---
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // (Filter/sort states)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [allTemperaments, setAllTemperaments] = useState([]);
  const [selectedTemperaments, setSelectedTemperaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // --- 4. CONSUME COMPARE CONTEXT ---
  const { compareCount, clearCompare } = useContext(CompareContext);

  // --- DATA FETCHING (HYBRID MODEL) ---
  useEffect(() => {
    async function fetchHybridData() {
      try {
        const [breedsResponse, dogsResponse] = await Promise.all([
          fetch("https://api.thedogapi.com/v1/breeds", {
            headers: { "x-api-key": process.env.REACT_APP_DOG_API_KEY },
          }),
          fetch("/dogs") 
        ]);

        if (!breedsResponse.ok) throw new Error("Failed to fetch breeds from TheDogAPI");
        if (!dogsResponse.ok) throw new Error("Failed to fetch local dog inventory");

        const breedsData = await breedsResponse.json();
        const localDogsData = await dogsResponse.json();
        
        const localDogMap = {};
        localDogsData.forEach(dog => {
          const apiId = dog.breed.api_id; 
          if (!localDogMap[apiId]) {
            localDogMap[apiId] = [];
          }
          localDogMap[apiId].push(dog);
        });

        const augmentedBreeds = breedsData.map(breed => ({
          ...breed,
          available_dogs: localDogMap[breed.id] || []
        }));
        
        setBreeds(augmentedBreeds);

        // Calculate all temperaments
        const temperamentsSet = new Set();
        breedsData.forEach(breed => {
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
    fetchHybridData();
  }, []); 

  // --- FILTERING & SORTING ---
  // (All helper functions and .filter/.sort logic remain exactly the same)
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
    .filter((breed) => {
      if (!showAvailableOnly) return true;
      return breed.available_dogs && breed.available_dogs.length > 0;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "weight-asc": return getAverageWeight(a) - getAverageWeight(b);
        case "weight-desc": return getAverageWeight(b) - getAverageWeight(a);
        case "height-asc": return getAverageHeight(a) - getAverageHeight(a);
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

        <FormControlLabel
          control={
            <Switch
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              color="primary"
            />
          }
          label="Show Available Only"
          sx={{ m: "1rem 0", ml: 2 }} 
        />

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

        {/* --- 5. ADD "CLEAR COMPARISON" BUTTON --- */}
        {compareCount > 0 && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={clearCompare} // Use the function from context
            startIcon={<ClearAllIcon />}
            sx={{ m: "1rem 0" }}
          >
            Clear Comparison
          </Button>
        )}
        {/* --- END NEW BUTTON --- */}
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
        {processedBreeds.map((breed) => (
          <DogCard key={breed.id} breed={breed} />
        ))}
      </Box>
    </Box>
  );
}

export default BreedList;