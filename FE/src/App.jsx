import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/student/Homepage';
import UserProfile from './pages/student/UserProfile';
import ContactUs from './pages/student/ContactUs';
import AboutUs from './pages/student/AboutUs';
import LoginSignup from './pages/login/LoginSignup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Homepage />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/login' element={<LoginSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
