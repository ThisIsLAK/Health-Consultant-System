import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { format, parseISO, isToday } from 'date-fns'; // Import isToday from date-fns
import { FaArrowLeft, FaCalendarAlt, FaGraduationCap, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';
import './AdminStuAppointment.css';

const AdminStuAppointment = () => {
    const { studentId } = useParams();
    const location = useLocation();
    const studentData = location.state?.student || null;
    const statusUtils = location.state?.statusUtils || {
        // Default implementation if not provided
        getAppointmentStatus: (appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate);
            const isPastAppointment = appointmentDate < new Date() && 
                !isToday(appointmentDate);
            
            if (appointment.active === false) {
                return 'CANCELLED';
            } else if (appointment.active === true) {
                return 'COMPLETED';
            } else if (isPastAppointment) {
                // If it's a past appointment but not explicitly cancelled or completed
                return 'PAST';
            } else {
                return 'UPCOMING';
            }
        },
        getAppointmentClass: (status) => status.toLowerCase(),
        getStatusLabel: (status) => status
    };
    
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [psychologistNames, setPsychologistNames] = useState({});

    useEffect(() => {
        fetchAppointments();
    }, [studentId]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            // Fetch appointments for the student
            const response = await axios.get(
                `http://localhost:8080/identity/admin/viewuserappointmentlist/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data) {
                console.log('Student appointments data:', response.data);
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
                
                // Create placeholder names for psychologists
                const psychologistIds = [...new Set(appointmentsData.map(app => app.psychologistId))];
                const psychologistNamesObj = {};
                
                psychologistIds.forEach(id => {
                    psychologistNamesObj[id] = `Psychologist ${id.substring(0, 6)}...`;
                });
                
                setPsychologistNames(psychologistNamesObj);
                setError(null);
            } else {
                setError('No data received from the server');
            }
        } catch (err) {
            console.error('Error fetching student appointments:', err);
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

    // Updated function to get status badge with appropriate colors
    const getStatusBadge = (appointment) => {
        const status = statusUtils.getAppointmentStatus(appointment);
        const statusClass = statusUtils.getAppointmentClass(status);
        const label = statusUtils.getStatusLabel(status);
        
        let bgColor;
        switch(statusClass) {
            case 'upcoming':
                bgColor = 'primary';
                break;
            case 'completed':
                bgColor = 'success';
                break;
            case 'cancelled':
                bgColor = 'danger';
                break;
            case 'past':
                bgColor = 'secondary';
                break;
            default:
                bgColor = 'info';
        }
        
        return <Badge bg={bgColor}>{label}</Badge>;
    };

    // First initial for avatar
    const getInitial = () => {
        if (studentData && studentData.name) {
            return studentData.name.charAt(0).toUpperCase();
        }
        return 'S';
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

    // Update the appointment counts based on new status logic
    const countAppointmentsByStatus = () => {
        return appointments.reduce((counts, app) => {
            const status = statusUtils.getAppointmentStatus(app);
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
                            <Link to="/adminstulist" className="back-button">
                                <FaArrowLeft /> Back to Students
                            </Link>
                            <div className="page-title">
                                <FaCalendarAlt className="title-icon" />
                                <h1>
                                    Appointments for {studentData?.name || `Student ${studentId.substring(0, 8)}...`}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}

                    <div className="student-info card">
                        <div className="card-body">
                            <div className="avatar-section">
                                <div className="avatar">
                                    {getInitial()}
                                </div>
                            </div>
                            <div className="info-section">
                                <h2>{studentData?.name || `Student ID: ${studentId.substring(0, 12)}...`}</h2>
                                <p><strong>Email:</strong> {studentData?.email || 'Not available'}</p>
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
                                <p>This student has no appointments yet.</p>
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
                                                <th>Psychologist</th>
                                                <th>Psychologist Email</th>
                                                <th>Date</th>
                                                <th>Time Slot</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appointment, index) => (
                                                <tr key={appointment.appointmentId}>
                                                    <td>{index + 1}</td>
                                                    <td>{psychologistNames[appointment.psychologistName]}</td>
                                                    <td>{appointment.psychologistEmail}</td>
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

export default AdminStuAppointment;
