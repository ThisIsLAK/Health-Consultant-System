import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Homepage from './pages/student/Homepage/Homepage';
import UserProfile from './pages/student/UserProfile/UserProfile';
import ContactUs from './pages/student/ContactUs/ContactUs';
import AboutUs from './pages/student/AboutUs/AboutUs';
import LoginSignup from './pages/login/LoginSignup';

import CustomerList from './pages/manager/CustomerList/CustomerList';
import PsychologistList from './pages/manager/PsychologistList/PsychologistList';
import AdminList from './pages/manager/AdminList/AdminList';
import AppointmentHistory from './pages/manager/AppointmentHistory/AppointmentHistory';
import AppointmentList from './pages/manager/AppointmentList/AppointmentList';
import ManagerDashboard from './pages/manager/ManagerDashboard/ManagerDashboard';

import TestsPage from './pages/student/TestListPage/TestsPage';
import SupportProgram from './pages/student/SuppportProgram/SupportProgram';
import NoticePage from './pages/student/Notice/NoticePage';



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
        <Route path='/tests' element={<TestsPage />} />
        <Route path='/support' element={<SupportProgram/>} />
        <Route path='/notice' element={<NoticePage/>}/>

        {/* Manager Routes */}
        <Route path='/customerlist' element={<CustomerList/>}/>
        <Route path='/psychologistlist' element={<PsychologistList/>}/>
        <Route path='/adminlist' element={<AdminList/>}/>
        <Route path='/apphistory' element={<AppointmentHistory/>}/>
        <Route path='/applist' element={<AppointmentList/>}/>
        <Route path='/managerdashboard' element={<ManagerDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
