import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import { AppThemeProvider } from './context/AppThemeProvider'; // <-- 1. IMPORT THE PROVIDER

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. WRAP THE APP IN ALL THE PROVIDERS */}
    <AppThemeProvider>
      <CompareProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CompareProvider>
    </AppThemeProvider>
  </React.StrictMode>
);

reportWebVitals();