import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Homepage from './pages/student/Homepage';
import UserProfile from './pages/student/UserProfile';
import ContactUs from './pages/student/ContactUs';
import AboutUs from './pages/student/AboutUs';
import LoginSignup from './pages/login/LoginSignup';

import CustomerList from './pages/manager/CustomerList/CustomerList';
import PsychologistList from './pages/manager/PsychologistList/PsychologistList';
import AdminList from './pages/manager/AdminList/AdminList';
import AppointmentHistory from './pages/manager/AppointmentHistory/AppointmentHistory';
import AppointmentList from './pages/manager/AppointmentList/AppointmentList';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup />} />

        {/* Student Routes */}
        <Route path='/' element={<Homepage />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/aboutus' element={<AboutUs />} />

        {/* Manager Routes */}
        <Route path='/customerlist' element={<CustomerList/>}/>
        <Route path='/psychologistlist' element={<PsychologistList/>}/>
        <Route path='/adminlist' element={<AdminList/>}/>
        <Route path='/apphistory' element={<AppointmentHistory/>}/>
        <Route path='/applist' element={<AppointmentList/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
