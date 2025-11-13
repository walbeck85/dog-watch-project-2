// Add these imports at the top
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// Make sure your AppThemeProvider is imported if it's used here
// (I'll assume it's in context, but your file structure may vary)
// import { useThemeContext } from '../context/AppThemeProvider'; 

// --- 1. ACCEPT 'currentUser' and 'setCurrentUser' AS PROPS ---
function NavBar({ currentUser, setCurrentUser }) {
  // Your theme context (if you have one)
  // const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme(); // Fallback if context is not used here
  const navigate = useNavigate();

  // --- 2. ADD LOGOUT FUNCTION ---
  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then(r => {
      if (r.ok) {
        setCurrentUser(null); // Clear user state in App.js
        navigate('/login');   // Redirect to login
      }
    });
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={NavLink} to="/" color="inherit">
            Dog Watch
          </Button>
        </Typography>
        
        <Button component={NavLink} to="/compare" color="inherit">
          Compare (0) {/* We'll link this to compare context later */}
        </Button>

        {/* --- 3. ADD CONDITIONAL LOGIC --- */}
        {currentUser ? (
          // If user is logged in, show their name and a Logout button
          <>
            <Button component={NavLink} to="/admin" color="inherit">
              Admin Dashboard
            </Button>
            <Typography sx={{ ml: 2 }}>
              Hi, {currentUser.username}!
            </Typography>
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
              Logout
            </Button>
          </>
        ) : (
          // If no user, show the Login button
          <Button component={NavLink} to="/login" color="inherit">
            Admin Login
          </Button>
        )}

        {/* Your Dark Mode Toggle (if it's in the NavBar) */}
        <IconButton sx={{ ml: 1 }} onClick={() => { /* TODO: add toggleTheme */ }} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;