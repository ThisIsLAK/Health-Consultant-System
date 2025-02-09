import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import LoginSignup from './pages/login/LoginSignup';
import Homepage from './pages/student/Homepage';
import UserProfile from './pages/student/UserProfile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <LoginSignup />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
