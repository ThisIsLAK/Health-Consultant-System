import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProtectedRoute from './components/ProtectedRoute';

/* Student Routes */
import Homepage from './pages/student/Homepage/Homepage';
import UserProfile from './pages/student/EditProfile/EditProfile';
import ContactUs from './pages/student/ContactUs/ContactUs';
import AboutUs from './pages/student/AboutUs/AboutUs';
import Blog from './pages/student/Blog/Blog';
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
import AppointmentList from './pages/manager/AppointmentList/AppointmentList';
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
import AdminUserDetail from './pages/components/admin/UserDetail/AdminUserDetail';
import EditSurvey from './pages/components/admin/EditSurvey/EditSurvey';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup />} />

        {/* Student/User Routes */}
        <Route path='/' element={<ProtectedRoute element={<Homepage />} allowedRoles={['USER']} />} />
        <Route path='/profile' element={<ProtectedRoute element={<UserProfile />} allowedRoles={['USER']} />} />
        <Route path='/contact' element={<ProtectedRoute element={<ContactUs />} allowedRoles={['USER']} />} />
        <Route path='/aboutus' element={<ProtectedRoute element={<AboutUs />} allowedRoles={['USER']} />} />
        <Route path='/tests' element={<ProtectedRoute element={<TestsPage />} allowedRoles={['USER']} />} />
        <Route path='/support' element={<ProtectedRoute element={<SupportProgram />} allowedRoles={['USER']} />} />
        <Route path='/notice' element={<ProtectedRoute element={<NoticePage />} allowedRoles={['USER']} />} />
        <Route path='/info' element={<ProtectedRoute element={<UserInfo />} allowedRoles={['USER']} />} />
        <Route path='/editprofile' element={<ProtectedRoute element={<EditProfile />} allowedRoles={['USER']} />} />
        <Route path='/booking' element={<ProtectedRoute element={<BookingForm />} allowedRoles={['USER']} />} />
        <Route path='/blog' element={<ProtectedRoute element={<Blog />} allowedRoles={['USER']} />} />

        {/* Manager Routes */}
        <Route path='/customerlist' element={<ProtectedRoute element={<CustomerList />} allowedRoles={['MANAGER']} />} />
        <Route path='/psychologistlist' element={<ProtectedRoute element={<PsychologistList />} allowedRoles={['MANAGER']} />} />
        <Route path='/adminlist' element={<ProtectedRoute element={<AdminList />} allowedRoles={['MANAGER']} />} />
        <Route path='/apphistory' element={<ProtectedRoute element={<AppointmentHistory />} allowedRoles={['MANAGER']} />} />
        <Route path='/applist' element={<ProtectedRoute element={<AppointmentList />} allowedRoles={['MANAGER']} />} />
        <Route path='/managerdashboard' element={<ProtectedRoute element={<ManagerDashboard />} allowedRoles={['MANAGER']} />} />
        <Route path='/appdetails' element={<ProtectedRoute element={<AppointmentDetail />} allowedRoles={['MANAGER']} />} />
        <Route path='/userdetails' element={<ProtectedRoute element={<CustomerDetail />} allowedRoles={['MANAGER']} />} />
        <Route path='/psychologistdetails' element={<ProtectedRoute element={<PsychologistDetail />} allowedRoles={['MANAGER']} />} />
        <Route path='/admindetails' element={<ProtectedRoute element={<AdminDetail />} allowedRoles={['MANAGER']} />} />
        <Route path='/addadmin' element={<ProtectedRoute element={<AdminAdd />} allowedRoles={['MANAGER']} />} />
        <Route path='/editadmin' element={<ProtectedRoute element={<AdminEdit />} allowedRoles={['MANAGER']} />} />
        <Route path='/manageraccount' element={<ProtectedRoute element={<ManagerAccount />} allowedRoles={['MANAGER']} />} />

        {/* Psychologist Routes */}
        <Route path='/patientlist' element={<ProtectedRoute element={<UserList />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/patientdetail' element={<ProtectedRoute element={<UserDetail />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/psyapplist' element={<ProtectedRoute element={<PsyAppointmentList />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/therapynote' element={<ProtectedRoute element={<TherapyNote />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/psyapphistory' element={<ProtectedRoute element={<PsyAppHistory />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/psyappdetail' element={<ProtectedRoute element={<PsyAppDetail />} allowedRoles={['PSYCHOLOGIST']} />} />
        <Route path='/psyaccount' element={<ProtectedRoute element={<PsychologistAccount />} allowedRoles={['PSYCHOLOGIST']} />} />

        {/* Admin Routes */}
        <Route path='/adminaccount' element={<ProtectedRoute element={<AdminAccount />} allowedRoles={['ADMIN']} />} />
        <Route path='/adminuserlist' element={<ProtectedRoute element={<AdminUserList />} allowedRoles={['ADMIN']} />} />
        <Route path='/userdetail/:userEmail' element={<ProtectedRoute element={<AdminUserDetail />} allowedRoles={['ADMIN']} />} />
        <Route path='/editsurvey' element={<ProtectedRoute element={<EditSurvey />} allowedRoles={['ADMIN']} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
