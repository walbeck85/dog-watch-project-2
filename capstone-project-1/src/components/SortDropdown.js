import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * A controlled component, now using MUI's Select.
 */
function SortDropdown({ sortOrder, onSortChange }) {
  return (
    <Box sx={{ margin: "1rem 0", minWidth: 220 }}>
      {/* FormControl is the wrapper */}
      <FormControl fullWidth variant="outlined">
        {/* InputLabel is the animated label */}
        <InputLabel id="sort-by-label">Sort by:</InputLabel>
        
        {/* Select is the dropdown itself */}
        <Select
          labelId="sort-by-label"
          id="sort"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          label="Sort by:" // This prop connects it to the InputLabel
        >
          {/* MenuItems are the new <option> tags */}
          <MenuItem value="name-asc">Name: A-Z</MenuItem>
          <MenuItem value="name-desc">Name: Z-A</MenuItem>
          <MenuItem value="weight-asc">Weight: Low to High</MenuItem>
          <MenuItem value="weight-desc">Weight: High to Low</MenuItem>
          <MenuItem value="height-asc">Height: Short to Tall</MenuItem>
          <MenuItem value="height-desc">Height: Tall to Short</MenuItem>
          <MenuItem value="lifespan-asc">Lifespan: Short to Long</MenuItem>
          <MenuItem value="lifespan-desc">Lifespan: Long to Short</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default SortDropdown;