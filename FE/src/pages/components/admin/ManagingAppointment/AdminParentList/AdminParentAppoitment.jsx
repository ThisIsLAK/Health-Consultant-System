import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Alert, Spinner, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaUserMd, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import axios from 'axios';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';

const AdminParentAppointment = () => {
    const { psychologistId } = useParams();
    const location = useLocation();
    const psychologistData = location.state?.psychologist || null;
    
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentNames, setStudentNames] = useState({});

    useEffect(() => {
        fetchAppointments();
    }, [psychologistId]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/identity/admin/psyappointment/${psychologistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data) {
                const appointmentsData = response.data.result || response.data;
                setAppointments(appointmentsData);
                const studentIds = [...new Set(appointmentsData.map(app => app.userId))];
                const studentNamesObj = {};
                studentIds.forEach(id => {
                    studentNamesObj[id] = `Student ${id.substring(0, 6)}...`;
                });
                setStudentNames(studentNamesObj);
                setError(null);
            } else {
                setError('No data received from the server');
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isAppointmentInPast = (dateString) => {
        if (!dateString) return false;
        const appointmentDate = new Date(dateString);
        return appointmentDate < new Date();
    };

    const getStatusBadge = (active, appointmentDate) => {
        if (!active) {
            return <Badge bg="danger">Cancelled</Badge>;
        }
        if (isAppointmentInPast(appointmentDate)) {
            return <Badge bg="secondary">Completed</Badge>;
        }
        return <Badge bg="success">Upcoming</Badge>;
    };

    const getInitial = () => {
        return psychologistData?.name ? psychologistData.name.charAt(0).toUpperCase() : 'P';
    };

    if (loading) {
        return (
            <>
                <AdminHeader />
                <AdminSidebar />
                <main id="main" className="main">
                    <div className="psych-loading-container">
                        <div className="psych-loading-spinner">
                            <Spinner animation="border" variant="primary" />
                        </div>
                        <p>Loading appointments...</p>
                    </div>
                </main>
            </>
        );
    }

    const activeAppointments = appointments.filter(app => app.active).length;
    const cancelledAppointments = appointments.filter(app => !app.active).length;

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <div className="psych-dashboard">
                    <div className="page-header">
                        <div className="page-title">
                            <FaCalendarAlt className="page-icon" />
                            <h1>
                                Appointments for {psychologistData?.name || `Psychologist ${psychologistId.substring(0, 8)}...`}
                            </h1>
                        </div>
                        <div className="page-actions">
                            <Link to="/adminpsycholist" className="psych-view-btn">
                                <FaArrowLeft /> Back to Psychologists
                            </Link>
                        </div>
                    </div>

                    {error && <Alert variant="danger" className="psych-alert">{error}</Alert>}

                    <div className="psych-card" style={{ marginBottom: '30px' }}>
                        <div className="psych-card-header">
                            <div className="psych-avatar">{getInitial()}</div>
                        </div>
                        <div className="psych-card-body">
                            <h5 className="psych-name">{psychologistData?.name || 'N/A'}</h5>
                            <p className="psych-email">{psychologistData?.email || 'Not available'}</p>
                        </div>
                    </div>

                    <div className="stats-overview">
                        <div className="stats-card">
                            <div className="stats-card-inner">
                                <div className="stats-icon-area">
                                    <FaCalendarAlt className="stats-icon" />
                                </div>
                                <div className="stats-content">
                                    <h2 className="stats-number">{appointments.length}</h2>
                                    <p className="stats-label">Total Appointments</p>
                                </div>
                            </div>
                            <div className="stats-footer">
                                <span className="stats-info">
                                    Active: {activeAppointments} | Cancelled: {cancelledAppointments}
                                </span>
                            </div>
                        </div>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="psych-empty">
                            <FaUserMd className="psych-empty-icon" />
                            <h3>No Appointments Found</h3>
                            <p>This psychologist has no appointments yet.</p>
                        </div>
                    ) : (
                        <div className="psych-grid">
                            {appointments.map((appointment, index) => (
                                <div key={appointment.appointmentId} className="psych-card">
                                    <div className="psych-card-header">
                                        <div className="psych-avatar">{index + 1}</div>
                                    </div>
                                    <div className="psych-card-body">
                                        <h5 className="psych-name">{appointment.studentName || studentNames[appointment.userId]}</h5>
                                        <p className="psych-email">{appointment.studentEmail || 'N/A'}</p>
                                        <p>Date: {formatDate(appointment.appointmentDate)}</p>
                                        <p>Time: {appointment.timeSlot || 'N/A'}</p>
                                        <p>Status: {getStatusBadge(appointment.active, appointment.appointmentDate)}</p>
                                    </div>
                                    <div className="psych-card-footer">
                                        <div className="button-group">
                                            <Link to={`/userdetail/${appointment.studentEmail}`} className="psych-view-btn">
                                                <FaEye /> View Student Profile
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

export default AdminParentAppointment;