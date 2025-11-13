import React, { useState, useMemo, createContext, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // CssBaseline is a style reset

// 1. Create our new context
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

  // 4. Create the MUI theme object *based on our state*
  // This theme object will be available to all MUI components
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode, // This tells MUI to use light or dark mode
        },
      }),
    [mode]
  );

  return (
    // 5. Our context provides the toggle function
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