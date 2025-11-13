import React, { useState, useContext } from "react";
import { CompareContext } from "../context/CompareContext";
import "./BreedCard.css"; // We still need this for the flip animation!
import { useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate

// --- Import all the new MUI components ---
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

function BreedCard({ breed }) {
  // --- Context ---
  const { isInCompare, addCompare, removeCompare, compareCount } = useContext(CompareContext);
  const bIsInCompare = isInCompare(breed.id);

  // --- Local State ---
  const [isFlipped, setIsFlipped] = useState(false);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- Snackbar (Toast) State ---
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // --- NEW: React Router hook for navigation ---
  const navigate = useNavigate();

  // --- Image URL Helper ---
  const getImageUrl = () => {
    if (breed.image && breed.image.url) return breed.image.url;
    if (breed.reference_image_id) return `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`;
    return "https://via.placeholder.com/300x200"; // Fallback
  };

  // --- API Fetch for Card Details ---
  const fetchBreedDetails = async () => {
    if (details) {
      setIsFlipped(true); 
      return;
    }
    setIsLoading(true);
    setIsFlipped(true);
    setError(null);
    try {
      // NOTE: We are using the external API ID 'breed.id', 
      // NOT our local database 'breed.api_id'
      const response = await fetch(`https://api.thedogapi.com/v1/breeds/${breed.id}`, {
        headers: { "x-api-key": process.env.REACT_APP_DOG_API_KEY },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDetails(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Event Handlers ---
  const handleCardClick = () => {
    if (!isFlipped) fetchBreedDetails();
    else setIsFlipped(false);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Stop the card from flipping
    if (bIsInCompare) {
      removeCompare(breed.id);
      setToast({ open: true, message: `${breed.name} removed from compare.`, severity: "success" });
    } else {
      if (compareCount < 3) {
        addCompare(breed.id);
        setToast({ open: true, message: `${breed.name} added to compare!`, severity: "success" });
      } else {
        setToast({ open: true, message: "Compare limit is 3.", severity: "error" });
      }
    }
  };
  
  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  // --- NEW: Handler for the "View Available" button ---
  const handleViewAvailableClick = (e) => {
    e.stopPropagation(); // Stop card from flipping
    // We will navigate to a new page, passing the breed's external API ID
    // (This matches the 'api_id' in our local Breed table)
    navigate(`/available/${breed.id}`); 
  };

  // --- Render ---
  return (
    <div className="card-scene">
      <div 
        className={`card-container ${isFlipped ? "is-flipped" : ""}`}
        onClick={handleCardClick}
      >
        
        {/* === CARD FRONT === */}
        <div className="card-face card-face-front">
          <Card 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              position: 'relative' 
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={getImageUrl()}
              alt={breed.name}
              sx={{ objectPosition: 'top' }}
            />
            <CardContent sx={{ textAlign: 'center', pb: '80px' }}> 
              <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
                {breed.name}
              </Typography>
            </CardContent>
            
            <CardActions sx={{ 
              justifyContent: 'center',
              position: 'absolute',
              bottom: '16px',
              left: 0,
              right: 0,
              // NEW: Allow buttons to wrap
              flexWrap: 'wrap', 
              gap: '8px'
            }}>
              <Button
                size="small"
                variant={bIsInCompare ? "contained" : "outlined"}
                color={bIsInCompare ? "primary" : "inherit"}
                startIcon={bIsInCompare ? <CheckIcon /> : <AddIcon />}
                onClick={handleCompareClick}
              >
                {bIsInCompare ? 'Added' : 'Compare'}
              </Button>

              {/* --- THE NEW BUTTON --- */}
              {/* 'breed.available_dogs' is the augmented array from BreedList */}
              {breed.available_dogs && breed.available_dogs.length > 0 && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={handleViewAvailableClick} // Use new handler
                >
                  View Available ({breed.available_dogs.length})
                </Button>
              )}
              {/* --- END NEW BUTTON --- */}
            </CardActions>
          </Card>
        </div>
        
        {/* === CARD BACK (DETAILS) === */}
        <div className="card-face card-face-back">
          <Card sx={{ height: '100%', overflow: 'auto' }}>
            <CardContent sx={{ textAlign: 'left', fontSize: '0.9rem' }}>
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <CircularProgress />
                </Box>
              )}
              {error && <Typography color="error">Error: {error}</Typography>}
              {details && (
                <>
                  <Typography variant="h6" component="div" gutterBottom>{details.name}</Typography>
                  <Typography variant="body2"><strong>Temperament:</strong> {details.temperament}</Typography>
                  <Typography variant="body2"><strong>Life Span:</strong> {details.life_span}</Typography>
                  <Typography variant="body2"><strong>Weight:</strong> {details.weight.imperial} lbs</Typography>
                  <Typography variant="body2"><strong>Bred For:</strong> {details.bred_for}</Typography>
                  <Typography variant="body2"><strong>Origin:</strong> {details.origin || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Breed Group:</strong> {details.breed_group || 'N/A'}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* === MUI SNACKBAR (TOAST) === */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default BreedCard;