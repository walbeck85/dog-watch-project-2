import React, { useState, useContext } from "react";
import { CompareContext } from "../context/CompareContext";
import "./DogCard.css"; // Keep old CSS for animation
import { useNavigate } from 'react-router-dom'; 

import {
  Typography, Button, Card, CardMedia, CardContent,
  CardActions, Snackbar, Alert, Box, CircularProgress, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

function DogCard({ breed, dog }) {
  // --- Context & State ---
  const { isInCompare, addCompare, removeCompare, compareCount } = useContext(CompareContext);
  const [isFlipped, setIsFlipped] = useState(false);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // --- Determine what data to display ---
  const isDogCard = Boolean(dog); 
  
  const displayData = {
    id: isDogCard ? dog.id : breed.id,
    api_id: isDogCard ? dog.breed.api_id : breed.id,
    name: isDogCard ? dog.name : breed.name,
    imageUrl: isDogCard ? (dog.image_url || "https://via.placeholder.com/300x200") : (breed.image?.url || `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`),
  };

  // --- API Fetch for Card Details (for Breeds only) ---
  const fetchBreedDetails = async () => {
    if (isDogCard || details) { 
      setIsFlipped(true); 
      return;
    }
    setIsLoading(true);
    setIsFlipped(true);
    setError(null);
    try {
      const response = await fetch(`https://api.thedogapi.com/v1/breeds/${displayData.id}`, {
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
    if (!isDogCard) {
      if (!isFlipped) fetchBreedDetails();
      else setIsFlipped(false);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    const idToCompare = isDogCard ? displayData.api_id : displayData.id;
    const nameToCompare = isDogCard ? dog.breed.name : breed.name;
    
    if (isInCompare(idToCompare)) {
      removeCompare(idToCompare);
      setToast({ open: true, message: `${nameToCompare} removed from compare.`, severity: "success" });
    } else {
      if (compareCount < 3) {
        addCompare(idToCompare);
        setToast({ open: true, message: `${nameToCompare} added to compare!`, severity: "success" });
      } else {
        setToast({ open: true, message: "Compare limit is 3.", severity: "error" });
      }
    }
  };
  
  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  const handleViewAvailableClick = (e) => {
    e.stopPropagation();
    navigate(`/available/${displayData.api_id}`); 
  };

  // --- RENDER CARD FRONT ---
  const renderCardFront = () => (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <CardMedia
        component="img"
        height="200"
        image={displayData.imageUrl || "https://via.placeholder.com/300x200"}
        alt={displayData.name}
        onError={(e) => { e.target.src = "https://via.placeholder.com/300x200"; }}
        sx={{ objectPosition: 'top' }}
      />
      <CardContent sx={{ textAlign: 'center', pb: '80px' }}> 
        <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
          {displayData.name}
        </Typography>
        {isDogCard && (
          <Typography variant="subtitle2" color="primary">{dog.breed.name}</Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ 
        justifyContent: 'center', position: 'absolute', bottom: '16px',
        left: 0, right: 0, flexWrap: 'wrap', gap: '8px'
      }}>
        {!isDogCard && (
          <Button
            size="small"
            variant={isInCompare(displayData.id) ? "contained" : "outlined"}
            color={isInCompare(displayData.id) ? "primary" : "inherit"}
            startIcon={isInCompare(displayData.id) ? <CheckIcon /> : <AddIcon />}
            onClick={handleCompareClick}
          >
            {isInCompare(displayData.id) ? 'Added' : 'Compare'}
          </Button>
        )}
        {!isDogCard && breed.available_dogs && breed.available_dogs.length > 0 && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleViewAvailableClick}
          >
            View Available ({breed.available_dogs.length})
          </Button>
        )}
        {isDogCard && (
          <Chip 
            label={dog.status} 
            color={dog.status === 'Available' ? "success" : "default"} 
          />
        )}
      </CardActions>
    </Card>
  );

  // --- RENDER CARD BACK ---
  const renderCardBack = () => (
    <Card sx={{ height: '100%', overflow: 'auto' }}>
      <CardContent sx={{ textAlign: 'left', fontSize: '0.9rem' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">Error: {error}</Typography>}
        
        {isDogCard && dog && (
          <>
            <Typography variant="h6" component="div" gutterBottom>{dog.name}</Typography>
            <Typography variant="body2" gutterBottom><strong>Status:</strong> {dog.status}</Typography>
            <Typography variant="body2" gutterBottom><strong>Age:</strong> {dog.age} years old</Typography>
            <Typography variant="body2" gutterBottom><strong>Breed:</strong> {dog.breed.name}</Typography>
            {dog.weight && (
              <Typography variant="body2" gutterBottom><strong>Weight:</strong> {dog.weight}</Typography>
            )}
            {dog.temperament && (
              <Typography variant="body2" gutterBottom><strong>Temperament:</strong> {dog.temperament}</Typography>
            )}
            {dog.description && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>About {dog.name}:</strong><br />
                {dog.description}
              </Typography>
            )}
          </>
        )}
        
        {!isDogCard && details && (
          <>
            <Typography variant="h6" component="div" gutterBottom>{details.name}</Typography>
            <Typography variant="body2"><strong>Temperament:</strong> {details.temperament}</Typography>
            <Typography variant="body2"><strong>Life Span:</strong> {details.life_span}</Typography>
            <Typography variant="body2"><strong>Weight:</strong> {details.weight.imperial} lbs</Typography>
            <Typography variant="body2"><strong>Bred For:</strong> {details.bred_for}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );

  // --- MAIN RENDER ---
  return (
    <div className="card-scene">
      <div 
        className={`card-container ${isFlipped ? "is-flipped" : ""}`}
        onClick={!isDogCard ? handleCardClick : undefined}
      >
        <div className="card-face card-face-front">{renderCardFront()}</div>
        <div className="card-face card-face-back">{renderCardBack()}</div>
      </div>
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

export default DogCard;