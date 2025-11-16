import React, { useContext } from 'react'; // <-- 1. ADD useContext
import { NavLink, useNavigate } from 'react-router-dom'; 
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '../context/AppThemeProvider';
import { CompareContext } from '../context/CompareContext'; // <-- 2. IMPORT COMPARE CONTEXT

function NavBar({ currentUser, setCurrentUser }) {
  const { mode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();

  // --- 3. CONSUME THE CONTEXT ---
  const { compareCount } = useContext(CompareContext);

  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then(r => {
      if (r.ok) {
        setCurrentUser(null);
        navigate('/login');
      }
    });
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* --- Left-aligned items --- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            <Button component={NavLink} to="/" color="inherit" sx={{ fontSize: '1.25rem' }}>
              Dog Watch
            </Button>
          </Typography>
          <Button component={NavLink} to="/compare" color="inherit" sx={{ ml: 2 }}>
            {/* --- 4. THE FIX: Use the dynamic count --- */}
            Compare ({compareCount})
          </Button>
        </Box>

        {/* --- This Box "grows" to push items apart --- */}
        <Box sx={{ flexGrow: 1 }} />

        {/* --- Right-aligned items --- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentUser ? (
            // If user is logged in
            <>
              <Button component={NavLink} to="/admin" color="inherit">
                Admin Dashboard
              </Button>
              <Typography sx={{ ml: 2, mr: 1 }}>
                Hi, {currentUser.username}!
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            // If no user
            <Button component={NavLink} to="/login" color="inherit">
              Admin Login
            </Button>
          )}

          {/* --- DARK MODE FIX: Hook up onClick and mode --- */}
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;