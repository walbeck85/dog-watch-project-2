import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is a wrapper.
// It takes the 'currentUser' and the 'children' (the component to protect) as props.
function ProtectedRoute({ currentUser, children }) {
  
  if (!currentUser) {
    // If there is no logged-in user, redirect to the /login page
    return <Navigate to="/login" replace />;
  }

  // If there IS a logged-in user, render the child component 
  // (in this case, the <AdminDashboard />)
  return children;
}

export default ProtectedRoute;