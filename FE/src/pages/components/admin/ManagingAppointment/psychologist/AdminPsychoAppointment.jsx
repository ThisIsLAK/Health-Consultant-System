import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaUserMd, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';
import './AdminPsychoAppointment.css';

const AdminPsychoAppointment = () => {
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
            
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            // Fetch appointments for the psychologist
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
                console.log('Appointments data:', response.data);
                // Check if response has the correct structure
                const appointmentsData = response.data.result || response.data;
                setAppointments(appointmentsData);
                
                // No need to fetch student names since they're not available
                // Just set a placeholder for each unique user ID
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

    // Format date to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Check if appointment is in the past
    const isAppointmentInPast = (dateString) => {
        if (!dateString) return false;
        const appointmentDate = new Date(dateString);
        return appointmentDate < new Date();
    };

    // Get status badge based on active property and date
    const getStatusBadge = (active, appointmentDate) => {
        if (!active) {
            return <Badge bg="danger">Cancelled</Badge>;
        }
        
        if (isAppointmentInPast(appointmentDate)) {
            return <Badge bg="secondary">Completed</Badge>;
        }
        
        return <Badge bg="success">Upcoming</Badge>;
    };

    // First initial for avatar
    const getInitial = () => {
        if (psychologistData && psychologistData.name) {
            return psychologistData.name.charAt(0).toUpperCase();
        }
        return 'P';
    };

    if (loading) {
        return (
            <>
                <AdminHeader />
                <AdminSidebar />
                <main id="main" className="main">
                    <div className="loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading appointments...</p>
                    </div>
                </main>
            </>
        );
    }

    // Count active and inactive appointments
    const activeAppointments = appointments.filter(app => app.active).length;
    const cancelledAppointments = appointments.filter(app => !app.active).length;

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <div className="appointment-dashboard">
                    <div className="page-header">
                        <div className="header-wrapper">
                            <Link to="/adminpsycholist" className="back-button">
                                <FaArrowLeft /> Back to Psychologists
                            </Link>
                            <div className="page-title">
                                <FaCalendarAlt className="title-icon" />
                                <h1>
                                    Appointments for {psychologistData?.name || `Psychologist ${psychologistId.substring(0, 8)}...`}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}

                    <div className="psychologist-info card">
                        <div className="card-body">
                            <div className="avatar-section">
                                <div className="avatar">
                                    {getInitial()}
                                </div>
                            </div>
                            <div className="info-section">
                                <h2>{psychologistData?.name || `Psychologist ID: ${psychologistId.substring(0, 12)}...`}</h2>
                                <p><strong>Email:</strong> {psychologistData?.email || 'Not available'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="appointment-stats card">
                        <div className="card-body stats-container">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div className="stat-content">
                                    <h3>{appointments.length}</h3>
                                    <p>Total Appointments</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon active">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{activeAppointments}</h3>
                                    <p>Active</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon cancelled">
                                    <FaTimesCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{cancelledAppointments}</h3>
                                    <p>Cancelled</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="no-appointments card">
                            <div className="card-body text-center">
                                <FaInfoCircle className="empty-icon" />
                                <h3>No Appointments Found</h3>
                                <p>This psychologist has no appointments yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="appointment-list card">
                            <div className="card-body">
                                <h3 className="card-title">Appointment History</h3>
                                <div className="table-responsive">
                                    <Table hover className="appointment-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Student</th>
                                                <th>Student Email</th>
                                                <th>Date</th>
                                                <th>Time Slot</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appointment, index) => (
                                                <tr key={appointment.appointmentId}>
                                                    <td>{index + 1}</td>
                                                    <td>{appointment.studentName}</td>
                                                    <td>{appointment.studentEmail}</td>
                                                    <td>{formatDate(appointment.appointmentDate)}</td>
                                                    <td>{appointment.timeSlot}</td>
                                                    <td>{getStatusBadge(appointment.active, appointment.appointmentDate)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default AdminPsychoAppointment;
