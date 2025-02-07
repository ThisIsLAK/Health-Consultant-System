import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './pages/login/LoginSignup';
import Homepage from './pages/student/Homepage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/' element={<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
