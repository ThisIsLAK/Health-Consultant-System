import React, { useState } from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import PageTitle from '../../../component/manager/PageTitle';
import { useNavigate } from 'react-router-dom';

const AdminEdit = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />

            <main id='main' className='main'>
                <PageTitle page="Add an Admin" />
                
                <div className="add-form-container">
                    <form className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="form-group">
                                    <input type="password" />
                                    <button 
                                        type="button" 
                                        className="eye-button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" />
                            </div>
                        </div>

                        <div className="form-group photo-upload">
                            <label>Photo</label>
                            <div className="photo-container">
                                <div className="photo-placeholder">
                                    <i className="fas fa-camera"></i>
                                </div>
                                <button type="button" className="add-photo-btn">+</button>
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="button" className="btn-return" onClick={() => navigate('/adminlist')}>
                                Return to List
                            </button>
                            <button type="submit" className="btn-add" onClick={() => navigate('/adminlist')}>
                                Edit Profile
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminEdit;