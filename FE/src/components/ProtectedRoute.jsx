import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';

// allowedRoles: array of roles that can access this route
// allowGuest: boolean to allow non-authenticated users to access the route
const ProtectedRoute = ({ element, allowedRoles, allowGuest = false }) => {
  const navigate = useNavigate();
  const isAuthenticated = ApiService.isAuthenticated();
  const userRole = ApiService.getUserRole();
  
  useEffect(() => {
    console.log("ProtectedRoute check:");
    console.log("- Is authenticated:", isAuthenticated);
    console.log("- User role:", userRole);
    console.log("- Allowed roles:", allowedRoles);
    console.log("- Allow guest:", allowGuest);
    console.log("- Has access:", isAuthenticated ? allowedRoles?.includes(userRole) : allowGuest);
  }, [isAuthenticated, userRole, allowedRoles, allowGuest]);

  // If user is not authenticated and the route doesn't allow guests, redirect to login
  if (!isAuthenticated && !allowGuest) {
    console.log("Not authenticated and guests not allowed, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but their role is not in the allowed roles list
  if (isAuthenticated && allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Unauthorized access attempt");
    
    // Redirect based on their actual role
    switch (userRole) {
      case 'ADMIN':
        console.log("Redirecting admin to admin page");
        return <Navigate to="/adminuserlist" replace />;
      case 'PSYCHOLOGIST':
        console.log("Redirecting psychologist to their page");
        return <Navigate to="/psyappointment" replace />;
      case 'MANAGER':
        console.log("Redirecting manager to dashboard");
        return <Navigate to="/managerdashboard" replace />;
      case 'USER':
        console.log("Redirecting user to homepage");
        return <Navigate to="/" replace />;
      default:
        console.log("Redirecting unknown role to homepage");
        return <Navigate to="/" replace />;
    }
  }

  console.log("Access granted to path");
  // User is authorized to access this route or is a guest on an allowGuest route
  return element;
};

export default ProtectedRoute;
