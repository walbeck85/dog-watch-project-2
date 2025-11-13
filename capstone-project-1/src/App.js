import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Import my components
import NavBar from './components/NavBar';
import BreedList from './components/BreedList';
import ComparePage from './components/ComparePage';
import Login from './components/Login'; 
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; 
import AvailableDogsPage from './components/AvailableDogsPage'; // <-- IMPORT NEW PAGE

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in from a previous session
    fetch("/check_session")
      .then(r => {
        if (r.ok) {
          r.json().then(user => setCurrentUser(user));
        }
      });
  }, []); // Empty dependency array means this runs once on app load

  return (
    <div className="App">
      {/* Pass user state to NavBar to show "Login" or "Logout" */}
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      
      <Routes> 
        {/* --- Public Routes --- */}
        <Route 
          path="/" 
          element={<BreedList />} 
        />
        <Route 
          path="/compare" 
          element={<ComparePage />} 
        />
        <Route 
          path="/login" 
          element={<Login setCurrentUser={setCurrentUser} />} 
        />
        
        {/* --- NEW PUBLIC ROUTE FOR AVAILABLE DOGS --- */}
        {/* This is the page for a specific breed's available dogs */}
        <Route 
          path="/available/:api_id" 
          element={<AvailableDogsPage />} 
        />
        
        {/* --- Private Admin Route --- */}
        <Route 
          path="/admin" 
          element={
            // This component "guards" the AdminDashboard
            <ProtectedRoute currentUser={currentUser}>
              <AdminDashboard currentUser={currentUser} />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </div>
  );
}

export default App;