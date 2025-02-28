import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* Student Routes */
import Homepage from './pages/student/Homepage/Homepage';
import UserProfile from './pages/student/EditProfile/EditProfile';
import ContactUs from './pages/student/ContactUs/ContactUs';
import AboutUs from './pages/student/AboutUs/AboutUs';
import LoginSignup from './pages/login/LoginSignup';
import TestsPage from './pages/student/TestListPage/TestsPage';
import SupportProgram from './pages/student/SuppportProgram/SupportProgram';
import NoticePage from './pages/student/Notice/NoticePage';
import UserInfo from './pages/student/UserInfo/UserInfo';
import EditProfile from './pages/student/EditProfile/EditProfile';
import BookingForm from './pages/student/PickDate/BookingForm';

/* Manager Routes */
import CustomerList from './pages/manager/CustomerList/CustomerList';
import PsychologistList from './pages/manager/PsychologistList/PsychologistList';
import AdminList from './pages/manager/AdminList/AdminList';
import AppointmentHistory from './pages/manager/AppointmentHistory/AppointmentHistory';
import ManagerDashboard from './pages/manager/ManagerDashboard/ManagerDashboard';
import AppointmentDetail from './pages/manager/AppointmentDetail/AppointmentDetail';
import CustomerDetail from './pages/manager/CustomerDetail/CustomerDetail';
import PsychologistDetail from './pages/manager/PsychologistDetail/PsychologistDetail';
import AdminDetail from './pages/manager/AdminDetail/AdminDetail';
import AdminAdd from './pages/manager/AdminAdd/AdminAdd';
import AdminEdit from './pages/manager/AdminEdit/AdminEdit';
import ManagerAccount from './pages/manager/ManagerAccount/ManagerAccount'

/* Psychologist Routes */
import UserList from './pages/psychologist/UserList/UserList';
import UserDetail from './pages/psychologist/UserDetail/UserDetail';
import PsyAppointmentList from './pages/psychologist/PsyAppointmentList/PsyAppointmentList';
import TherapyNote from './pages/psychologist/TherapyNote/TherapyNote';
import PsyAppHistory from './pages/psychologist/PsyAppHistory/PsyAppHistory';
import PsyAppDetail from './pages/psychologist/PsyAppDetail/PsyAppDetail';
import PsychologistAccount from './pages/psychologist/PsychologistAccount/PsychologistAccount'

// Admin Routes
import AdminAccount from './pages/components/admin/AdminDetail/AdminAccount';
import AdminUserList from './pages/components/admin/UserList/AdminUserList';
import EditSurvey from './pages/components/admin/EditSurvey/EditSurvey';
import AdminSurvey from './pages/components/admin/AdminSurvey/AdminSurvey';
import AddBlog from './pages/components/admin/AddBlog/AddBlog';
import AdminBlog from './pages/components/admin/AdminBlog/AdminBlog';
import EditBlog from './pages/components/admin/EditBlog/EditBlog';

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
        <Route path='/info' element={<UserInfo/>}/>
        <Route path='/editprofile' element={<EditProfile/>}/>
        <Route path='/booking' element={<BookingForm/>}/>


        {/* Manager Routes */}
        <Route path='/customerlist' element={<CustomerList/>}/>
        <Route path='/psychologistlist' element={<PsychologistList/>}/>
        <Route path='/adminlist' element={<AdminList/>}/>
        <Route path='/apphistory' element={<AppointmentHistory/>}/>
        <Route path='/managerdashboard' element={<ManagerDashboard/>}/>
        <Route path='/appdetails' element={<AppointmentDetail/>}/>
        <Route path='/userdetails' element={<CustomerDetail/>}/>
        <Route path='/psychologistdetails' element={<PsychologistDetail/>}/>
        <Route path='/admindetails' element={<AdminDetail/>}/>
        <Route path='/addadmin' element={<AdminAdd/>}/>
        <Route path='/editadmin' element={<AdminEdit/>}/>
        <Route path='/manageraccount' element={<ManagerAccount/>}/>

        {/* Psychologist Routes */}
        <Route path='/patientlist' element={<UserList/>}/>
        <Route path='/patientdetail' element={<UserDetail/>}/>
        <Route path='/psyapplist' element={<PsyAppointmentList/>}/>
        <Route path='/therapynote' element={<TherapyNote/>}/>
        <Route path='/psyapphistory' element={<PsyAppHistory/>}/>
        <Route path='/psyappdetail' element={<PsyAppDetail/>}/>
        <Route path='/psyaccount' element={<PsychologistAccount/>}/>

        {/* Admin Routes */}
        <Route path='/adminaccount' element={<AdminAccount/>}/>
        <Route path='/adminuserlist' element={<AdminUserList/>}/>
        <Route path='/adminsurvey' element={<AdminSurvey/>}/>
        <Route path='/editsurvey' element={<EditSurvey/>}/>
        <Route path='/adminblog' element={<AdminBlog/>}/>
        <Route path='/addblog' element={<AddBlog/>}/>
        <Route path='/editblog' element={<EditBlog/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
