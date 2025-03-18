import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { format, parseISO, isToday } from 'date-fns'; // Import date-fns functions
import { FaArrowLeft, FaCalendarAlt, FaUserMd, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaClock } from 'react-icons/fa';
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
                
                // Process appointments to add isPast property
                const processedAppointments = appointmentsData.map(app => {
                    const appDate = new Date(app.appointmentDate);
                    const now = new Date();
                    const isPast = appDate < now && appDate.toDateString() !== now.toDateString();
                    
                    return {
                        ...app,
                        isPast
                    };
                });
                
                setAppointments(processedAppointments);
                
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

    // Function to determine appointment status based on active property and date
    const getAppointmentStatus = (appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const isPastAppointment = appointmentDate < new Date() && 
            !isToday(appointmentDate);
        
        if (appointment.active === false) {
            return 'CANCELLED';
        } else if (appointment.active === true) {
            return 'COMPLETED';
        } else if (isPastAppointment) {
            return 'PAST';
        } else {
            return 'UPCOMING';
        }
    };

    // Get status badge based on appointment status
    const getStatusBadge = (appointment) => {
        const status = getAppointmentStatus(appointment);
        
        let bgColor, label;
        switch(status) {
            case 'UPCOMING':
                bgColor = 'primary';
                label = 'Upcoming';
                break;
            case 'COMPLETED':
                bgColor = 'success';
                label = 'Completed';
                break;
            case 'CANCELLED':
                bgColor = 'danger';
                label = 'Cancelled';
                break;
            case 'PAST':
                bgColor = 'secondary';
                label = 'Past';
                break;
            default:
                bgColor = 'info';
                label = 'Unknown';
        }
        
        return <Badge bg={bgColor}>{label}</Badge>;
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

    // Count appointments by status for statistics
    const countAppointmentsByStatus = () => {
        return appointments.reduce((counts, app) => {
            const status = getAppointmentStatus(app);
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        }, {});
    };

    const statusCounts = countAppointmentsByStatus();

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
                                <div className="stat-icon completed">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{statusCounts.COMPLETED || 0}</h3>
                                    <p>Completed</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon upcoming">
                                    <FaClock />
                                </div>
                                <div className="stat-content">
                                    <h3>{statusCounts.UPCOMING || 0}</h3>
                                    <p>Upcoming</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon cancelled">
                                    <FaTimesCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{statusCounts.CANCELLED || 0}</h3>
                                    <p>Cancelled</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon past">
                                    <FaCalendarAlt />
                                </div>
                                <div className="stat-content">
                                    <h3>{statusCounts.PAST || 0}</h3>
                                    <p>Past</p>
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
                                                <th>User Name</th>
                                                <th>User Email</th>
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
                                                    <td>{getStatusBadge(appointment)}</td>
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
