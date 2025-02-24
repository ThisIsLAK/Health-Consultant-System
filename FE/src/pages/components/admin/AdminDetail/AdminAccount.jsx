import React, { useState } from 'react';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';

const AdminAccount = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [managerData, setManagerData] = useState({
        username: 'psychologist123',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page="Your Account" />

                <div className="add-form-container">
                    <form className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={managerData.username} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="form-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={managerData.password}
                                        readOnly
                                    />
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
                                <input type="text" value={managerData.firstName} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" value={managerData.lastName} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={managerData.email} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" value={managerData.phone} readOnly />
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminAccount;
