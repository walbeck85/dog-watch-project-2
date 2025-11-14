import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Import your components
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
    fetch("/check_session")
      .then(r => {
        if (r.ok) {
          r.json().then(user => setCurrentUser(user));
        }
      });
  }, []); 

  return (
    <div className="App">
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      
      <Routes> 
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
        <Route 
          path="/available/:api_id" 
          element={<AvailableDogsPage />} 
        />
        
        {/* --- Private Admin Route --- */}
        <Route 
          path="/admin" 
          element={
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