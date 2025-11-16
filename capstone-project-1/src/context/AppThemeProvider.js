import React, { useState, useMemo, createContext, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// 1. Create the new context
const AppThemeContext = createContext();

// 2. Create the provider component
function AppThemeProvider({ children }) {
  const [mode, setMode] = useState('light'); // Default to light

  // 3. Define the value to be passed down
  const themeContextValue = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // 4. Create the MUI theme object *based on the state*
  const muiTheme = useMemo(
    () =>
      createTheme({
        // --- NEW THEME DEFINITION ---
        palette: {
          mode: mode, // This tells MUI to use light or dark mode
          primary: {
            main: '#2e7d32', // A friendly, trustworthy Green
          },
          secondary: {
            main: '#f57c00', // A warm, energetic Orange for accents
          },
        },
        typography: {
          // Tell MUI to use "Nunito" as the default font
          fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700, // Make headers bolder
          },
          h5: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 700,
          },
        },
        // --- END NEW THEME DEFINITION ---
      }),
    [mode]
  );

  return (
    // 5. The context provides the toggle function
    <AppThemeContext.Provider value={themeContextValue}>
      {/* 6. MUI's provider applies the theme */}
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline /> {/* Applies a clean baseline style reset */}
        {children}
      </MuiThemeProvider>
    </AppThemeContext.Provider>
  );
}

// 7. Custom hook to make it easy to use our context
const useAppTheme = () => useContext(AppThemeContext);

export { AppThemeProvider, useAppTheme };