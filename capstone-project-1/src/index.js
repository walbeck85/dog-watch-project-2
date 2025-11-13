import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AppThemeProvider } from './context/AppThemeProvider'; // <-- IMPORT NEW
import { CompareProvider } from './context/CompareContext';
// import { ThemeProvider } from './context/ThemeContext'; // <-- DELETE OLD

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Use the new AppThemeProvider */}
      <AppThemeProvider>
        {/* CompareProvider is still needed! */}
        <CompareProvider>
          <App />
        </CompareProvider>
      </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);