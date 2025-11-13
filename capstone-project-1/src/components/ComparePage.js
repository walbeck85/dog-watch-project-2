import React, { useContext, useState, useEffect } from "react";
import { CompareContext } from "../context/CompareContext";

// --- Import all the new MUI components ---
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // This is the table's background
  Alert // For the error state
} from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Helper function to programmatically get data for each row
const getRowData = (breed, feature) => {
  switch (feature) {
    case 'Image':
      return (
        <img 
          src={`https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`} 
          alt={breed.name}
          style={{width: '200px', height: '150px', objectFit: 'cover', borderRadius: '4px'}}
        />
      );
    case 'Temperament':
      return breed.temperament;
    case 'Life Span':
      return breed.life_span;
    case 'Weight (imperial)':
      return `${breed.weight.imperial} lbs`;
    case 'Height (imperial)':
      return `${breed.height.imperial} in`;
    case 'Bred For':
      return breed.bred_for;
    case 'Origin':
      return breed.origin || 'N/A';
    case 'Breed Group':
      return breed.breed_group || 'N/A';
    default:
      return 'N/A';
  }
};

// Define the rows I want to show, in order
const features = [
  'Image', 
  'Temperament', 
  'Life Span', 
  'Weight (imperial)', 
  'Height (imperial)', 
  'Bred For', 
  'Origin', 
  'Breed Group'
];

function ComparePage() {
  // 1. Get the list of IDs from the global context
  const { compareIds, clearCompare } = useContext(CompareContext);

  // 2. State for the fetched breed data, loading, and errors
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Fetch details for ALL breeds in the compare list (No changes to this logic)
  useEffect(() => {
    if (compareIds.length === 0) {
      setIsLoading(false);
      setBreeds([]);
      return;
    }

    async function fetchCompareBreeds() {
      setIsLoading(true);
      try {
        const fetchPromises = compareIds.map(id =>
          fetch(`https://api.thedogapi.com/v1/breeds/${id}`, {
            headers: {
              "x-api-key": process.env.REACT_APP_DOG_API_KEY,
            },
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
        );
        const fetchedBreeds = await Promise.all(fetchPromises);
        setBreeds(fetchedBreeds);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompareBreeds();
  }, [compareIds]);

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ p: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}> {/* Page padding */}
      <Typography variant="h4" component="h1" gutterBottom>
        Compare Breeds
      </Typography>

      {breeds.length === 0 ? (
        <Typography>
          You haven't selected any breeds to compare. Add up to 3 from the home page!
        </Typography>
      ) : (
        <>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={clearCompare} 
            startIcon={<ClearAllIcon />}
            sx={{ mb: 2 }} // margin-bottom
          >
            Clear Comparison
          </Button>
          
          {/* <TableContainer> makes the table responsive (scroll horizontally) */}
          {/* component={Paper} gives it the themed background and shadow */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="compare breeds table">
              <TableHead>
                <TableRow>
                  {/* This is the sticky header cell for "Feature" */}
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '1rem',
                      position: 'sticky', 
                      left: 0, 
                      zIndex: 1,
                      // Use MUI's theme variable for the background
                      backgroundColor: 'background.paper' 
                    }}
                  >
                    Feature
                  </TableCell>
                  {/* Create a header cell for each breed */}
                  {breeds.map(breed => (
                    <TableCell key={breed.id} align="left" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {breed.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Map over the features array to build the rows */}
                {features.map((feature) => (
                  <TableRow key={feature}>
                    {/* This is the sticky row header cell */}
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 'bold',
                        position: 'sticky', 
                        left: 0, 
                        zIndex: 1,
                        backgroundColor: 'background.paper'
                      }}
                    >
                      {feature}
                    </TableCell>
                    {/* Retrieve the data for this feature for each breed */}
                    {breeds.map(breed => (
                      <TableCell key={breed.id} align="left" sx={{ verticalAlign: 'top' }}>
                        {getRowData(breed, feature)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}

export default ComparePage;