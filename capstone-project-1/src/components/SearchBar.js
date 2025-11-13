import React from "react";
import { Box, TextField } from '@mui/material';

/**
 * A controlled component, now using MUI's TextField.
 */
function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <Box sx={{ margin: "1rem 0" }}>
      <TextField
        label="Search Breeds" // This becomes the animated label
        variant="outlined" // This style works well in light/dark mode
        placeholder="Type a breed name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: '300px' }} // Control the size
      />
    </Box>
  );
}

export default SearchBar;