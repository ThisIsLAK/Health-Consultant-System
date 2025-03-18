import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaGraduationCap, FaSearch, FaUserAlt, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';
import './AdminParentList.css'; // Đảm bảo tạo file CSS tương ứng nếu chưa có

const AdminParentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Dữ liệu giả
    const mockStudents = [
        { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: { roleName: 'STUDENT' } },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: { roleName: 'STUDENT' } },
        { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: { roleName: 'STUDENT' } },
        { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com', role: { roleName: 'STUDENT' } },
        { id: '5', name: 'Emma Davis', email: 'emma.davis@example.com', role: { roleName: 'STUDENT' } },
    ];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Thay vì gọi API, sử dụng dữ liệu giả
            setTimeout(() => { // Giả lập thời gian tải dữ liệu
                const studentsList = mockStudents.filter(user =>
                    user.role && user.role.roleName === 'STUDENT'
                );
                setStudents(studentsList);
                setError(null);
                setLoading(false);
            }, 1000); // Delay 1 giây để mô phỏng tải dữ liệu
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('An error occurred while fetching students');
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
            <div className="psych-loading-container">
                <div className="psych-loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
                <p>Loading parents...</p>
            </div>
        );
    }

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <div className="psych-dashboard">
                    <div className="page-header">
                        <div className="page-title">
                            <FaGraduationCap className="page-icon" />
                            <h1>Parents Directory</h1>
                        </div>
                        <div className="page-actions">
                            <div className="refined-search">
                                <div className="search-input-group">
                                    <FaSearch className="search-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search parents..."
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

                    {error && <Alert variant="danger" className="psych-alert">{error}</Alert>}

                    <div className="stats-overview">
                        <div className="stats-card">
                            <div className="stats-card-inner">
                                <div className="stats-icon-area">
                                    <FaGraduationCap className="stats-icon" />
                                </div>
                                <div className="stats-content">
                                    <h2 className="stats-number">{filteredStudents.length}</h2>
                                    <p className="stats-label">Total Parents</p>
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
                        <div className="psych-empty">
                            <FaGraduationCap className="psych-empty-icon" />
                            <h3>{searchTerm ? "No parents match your search" : "No parents found"}</h3>
                            <p>Try modifying your search criteria or check back later.</p>
                        </div>
                    ) : (
                        <div className="psych-grid">
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="psych-card">
                                    <div className="psych-card-header">
                                        <div className="psych-avatar">
                                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                    <div className="psych-card-body">
                                        <h5 className="psych-name">{student.name || 'N/A'}</h5>
                                        <p className="psych-email">{student.email}</p>
                                    </div>
                                    <div className="psych-card-footer">
                                        <div className="button-group">
                                            <Link to={`/userdetail/${student.email}`} className="psych-view-btn">
                                                <FaEye /> View Profile
                                            </Link>
                                            <Link
                                                to={`/admin/students/appointments/${student.id}`}
                                                state={{ student: student }}
                                                className="psych-app-btn"
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

export default AdminParentList;