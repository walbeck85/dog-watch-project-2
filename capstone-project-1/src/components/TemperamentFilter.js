import React, { useState, useMemo } from 'react';
// import './TemperamentFilter.css'; // <-- THIS LINE IS NOW DELETED

// --- Import all the new MUI components ---
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton, // Use ListItemButton to make the whole row clickable
  Checkbox,
  ListItemText
} from '@mui/material';

/**
 * A filter component, now built as a self-contained MUI Dialog.
 * It receives 'open' and 'onClose' props to control its visibility.
 */
function TemperamentFilter({ 
  open, // <-- Prop to control visibility
  onClose, // <-- Prop to close the dialog
  allTemperaments, 
  selectedTemperaments, 
  onTemperamentChange 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the filtering calculation
  const filteredTemperaments = useMemo(() => {
    return allTemperaments.filter(temp =>
      temp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTemperaments, searchTerm]);

  // Handler for when a list item is clicked
  const handleToggle = (temperament) => {
    if (selectedTemperaments.includes(temperament)) {
      onTemperamentChange(selectedTemperaments.filter(t => t !== temperament));
    } else {
      onTemperamentChange([...selectedTemperaments, temperament]);
    }
  };

  return (
    // <Dialog> is the new <Modal>. It uses the 'open' and 'onClose' props.
    // 'fullWidth' and 'maxWidth' are MUI props to control sizing.
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Filter by Temperament:</DialogTitle>
      
      {/* <DialogContent> will be the scrollable body */}
      <DialogContent>
        {/* 1. The Search Bar */}
        <TextField
          autoFocus // Automatically focus this when the modal opens
          margin="dense"
          id="search"
          label="Search temperaments..."
          type="text"
          fullWidth
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }} // Add a little margin-bottom
        />
        
        {/* 2. The Checkbox List */}
        <List sx={{ 
          width: '100%', 
          maxHeight: '40vh', // Same height as before
          overflow: 'auto'  // Same scroll as before
        }}>
          {filteredTemperaments.map(temp => {
            const labelId = `checkbox-list-label-${temp}`;
            const isChecked = selectedTemperaments.includes(temp);

            return (
              <ListItemButton 
                key={temp} 
                role={undefined} 
                dense 
                onClick={() => handleToggle(temp)}
              >
                <Checkbox
                  edge="start"
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={temp} />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
      
      {/* <DialogActions> is the footer for buttons */}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TemperamentFilter;