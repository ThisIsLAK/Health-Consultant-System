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
import SupportProgram from './pages/student/SuppportProgram/SupportProgram';
import NoticePage from './pages/student/Notice/NoticePage';
import UserInfo from './pages/student/UserInfo/UserInfo';
import EditProfile from './pages/student/EditProfile/EditProfile';
import ProgramDetail from './pages/student/SuppportProgram/ProgramDetail';
import PsychologistBooking from './pages/student/Booking/PsychologistBooking';
import StudentAppointmentHistory from './pages/student/Appointments/AppointmentHistory';

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
import AdminSurvey from './pages/components/admin/AdminSurvey/AdminSurvey';
import AddBlog from './pages/components/admin/AddBlog/AddBlog';
import AdminBlog from './pages/components/admin/AdminBlog/AdminBlog';
import EditBlog from './pages/components/admin/EditBlog/EditBlog';
import AdminCreateUser from './pages/components/admin/CreateUser/AdminCreateUser';
import AddSupportProgram from './pages/components/admin/SupportProgram/AddSupportProgram';
import AdminSupportProgram from './pages/components/admin/SupportProgram/AdminSupportProgram';
import ViewSupportProgram from './pages/components/admin/SupportProgram/ViewSupportProgram';
import EditSupportProgram from './pages/components/admin/SupportProgram/EditSupportProgram';

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
        <Route path='/support' element={<ProtectedRoute element={<SupportProgram />} allowedRoles={['USER']} />} />
        <Route path="/support/:programId" element={<ProgramDetail />} allowedRoles={['USER']} />
        <Route path='/notice' element={<ProtectedRoute element={<NoticePage />} allowedRoles={['USER']} />} />
        <Route path='/info' element={<ProtectedRoute element={<UserInfo />} allowedRoles={['USER']} />} />
        <Route path='/editprofile' element={<ProtectedRoute element={<EditProfile />} allowedRoles={['USER']} />} />
        <Route path='/blog' element={<ProtectedRoute element={<Blog />} allowedRoles={['USER']} />} />
        <Route path="/psychologists" element={<ProtectedRoute element={<PsychologistList />} allowedRoles={['USER']} />} />
        <Route path='/booking' element={<ProtectedRoute element={<PsychologistBooking />} allowedRoles={['USER']} />} />
        <Route path='/appointments' element={<ProtectedRoute element={<StudentAppointmentHistory />} allowedRoles={['USER']} />} />


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
        <Route path='/createuser' element={<ProtectedRoute element={<AdminCreateUser />} allowedRoles={['ADMIN']} />} />
        <Route path='/editsurvey' element={<ProtectedRoute element={<EditSurvey />} allowedRoles={['ADMIN']} />} />
        <Route path='/adminsurvey' element={<ProtectedRoute element={<AdminSurvey />} allowedRoles={['ADMIN']} />} />
        <Route path='/addblog' element={<ProtectedRoute element={<AddBlog />} allowedRoles={['ADMIN']} />} />
        <Route path='/adminblog' element={<ProtectedRoute element={<AdminBlog />} allowedRoles={['ADMIN']} />} />
        <Route path='/editblog/:blogCode' element={<ProtectedRoute element={<EditBlog />} allowedRoles={['ADMIN']} />} />
        <Route path='/adminsupport' element={<ProtectedRoute element={<AdminSupportProgram />} allowedRoles={['ADMIN']} />} />
        <Route path='/addsupport' element={<ProtectedRoute element={<AddSupportProgram />} allowedRoles={['ADMIN']} />} />
        <Route path='/viewsupport/:programCode' element={<ProtectedRoute element={<ViewSupportProgram />} allowedRoles={['ADMIN']} />} />
        <Route path='/editsupport/:programCode' element={<ProtectedRoute element={<EditSupportProgram />} allowedRoles={['ADMIN']} />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
