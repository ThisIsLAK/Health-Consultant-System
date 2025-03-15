import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApiService from '../../../../../service/ApiService';
import { FaEye, FaGraduationCap, FaSearch, FaUserAlt, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import './AdminStuList.css';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';

const AdminStuList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllUsers();

            if (response.status === 200) {
                // Filter users with USER role based on the response schema
                const studentsList = response.data.filter(user =>
                    user.role && user.role.roleName === 'STUDENT'
                );
                setStudents(studentsList);
                setError(null);
            } else {
                setError(response.message || 'Failed to fetch students');
            }
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('An error occurred while fetching students');
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="stu-loading-container">
                <div className="stu-loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <div className="stu-dashboard">
                    <div className="page-header">
                        <div className="page-title">
                            <FaGraduationCap className="page-icon" />
                            <h1>Students Directory</h1>
                        </div>
                        <div className="page-actions">
                            <div className="refined-search">
                                <div className="search-input-group">
                                    <FaSearch className="search-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input-field"
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="search-clear-btn"
                                            onClick={() => setSearchTerm('')}
                                            aria-label="Clear search"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <Alert variant="danger" className="stu-alert">{error}</Alert>}

                    <div className="stats-overview">
                        <div className="stats-card">
                            <div className="stats-card-inner">
                                <div className="stats-icon-area">
                                    <FaGraduationCap className="stats-icon" />
                                </div>
                                <div className="stats-content">
                                    <h2 className="stats-number">{filteredStudents.length}</h2>
                                    <p className="stats-label">Total Students</p>
                                </div>
                            </div>
                            <div className="stats-footer">
                                <span className="stats-info">
                                    {searchTerm && filteredStudents.length !== students.length ? 
                                        `Showing ${filteredStudents.length} of ${students.length} students` : 
                                        "All students"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="stu-empty">
                            <FaGraduationCap className="stu-empty-icon" />
                            <h3>{searchTerm ? "No students match your search" : "No students found"}</h3>
                            <p>Try modifying your search criteria or check back later.</p>
                        </div>
                    ) : (
                        <div className="stu-grid">
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="stu-card">
                                    <div className="stu-card-header">
                                        <div className="stu-avatar">
                                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                    <div className="stu-card-body">
                                        <h5 className="stu-name">{student.name || 'N/A'}</h5>
                                        <p className="stu-email">{student.email}</p>
                                    </div>
                                    <div className="stu-card-footer">
                                        <div className="button-group">
                                            <Link to={`/userdetail/${student.email}`} className="stu-view-btn">
                                                <FaEye /> View Profile
                                            </Link>
                                            <Link 
                                                to={`/admin/students/appointments/${student.id}`} 
                                                state={{ student: student }}
                                                className="stu-app-btn"
                                            >
                                                <FaCalendarAlt /> Appointments
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default AdminStuList;
