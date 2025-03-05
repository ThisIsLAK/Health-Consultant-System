import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail, Link as LinkIcon, FileText, Edit, Clock, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import './PsyAppointments.css';

// Helper function to parse JWT token for user ID
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
};

const PsyAppointments = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [psychologistId, setPsychologistId] = useState(null);

    // Status filter options
    const statuses = [
        { id: 'all', label: 'All Appointments' },
        { id: 'ACTIVE', label: 'Active' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' }
    ];

    // Function to handle editing appointment/adding notes
    const handleEdit = (appointmentId) => {
        const appointmentToEdit = appointments.find(app => app.appointmentId === appointmentId);
        navigate('/therapynote', { state: { appointment: appointmentToEdit } });
    };

    // Function to navigate to previous day
    const goToPreviousDay = () => {
        setCurrentDate(prevDate => subDays(prevDate, 1));
    };

    // Function to navigate to next day
    const goToNextDay = () => {
        setCurrentDate(prevDate => addDays(prevDate, 1));
    };

    // Load the psychologist ID from the JWT token when component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // First approach: Check if psychologistId is available in token claims
                const decoded = parseJwt(token);
                
                // Use User ID from token as fallback - this would only work if the user ID is the psychologist ID
                const userId = decoded?.iss || decoded?.sub;
                
                if (userId) {
                    setPsychologistId(userId);
                    console.log("Set psychologist ID from token:", userId);
                } else {
                    // Second approach: Make an API call to get psychologist profile
                    fetchPsychologistProfile(token);
                }
            } catch (error) {
                console.error("Error parsing token:", error);
                // If token parsing fails, try API call
                fetchPsychologistProfile(token);
            }
        } else {
            setError("Authentication token not found. Please log in again.");
        }
    }, []);

    // Function to fetch psychologist profile to get ID
    const fetchPsychologistProfile = async (token) => {
        try {
            // Make a request to an endpoint that returns the logged-in user's profile
            const response = await axios.get('http://localhost:8080/identity/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Extract psychologist ID from the profile response
            if (response.data && response.data.result && response.data.result.id) {
                setPsychologistId(response.data.result.id);
                console.log("Set psychologist ID from profile API:", response.data.result.id);
            } else {
                setError("Could not determine psychologist ID. Please log in again.");
            }
        } catch (err) {
            console.error("Error fetching psychologist profile:", err);
            setError("Failed to load psychologist information");
        }
    };

    // Fetch appointments when psychologistId changes
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!psychologistId) return;
            
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                
                // Make request to the specified endpoint
                const response = await axios.get(
                    `http://localhost:8080/identity/psychologists/psyappointment/${psychologistId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                console.log("Appointments response:", response.data);
                
                if (response.data && Array.isArray(response.data.result)) {
                    // Process the appointments based on the provided schema
                    const formattedAppointments = response.data.result.map(app => {
                        // Parse the date
                        const date = parseISO(app.appointmentDate);
                        
                        // Default status is ACTIVE if not provided
                        const status = app.status || 'ACTIVE';
                        
                        return {
                            appointmentId: app.appointmentId,
                            userId: app.userId,
                            psychologistId: app.psychologistId,
                            appointmentDate: app.appointmentDate,
                            timeSlot: app.timeSlot,
                            status: status,
                            // Format time for display
                            formattedTime: format(date, 'HH:mm'),
                            formattedDate: format(date, 'PPP'),
                            period: format(date, 'a').toUpperCase()
                        };
                    });
                    
                    // Sort by date (newest first)
                    formattedAppointments.sort((a, b) => 
                        new Date(a.appointmentDate) - new Date(b.appointmentDate)
                    );
                    
                    setAppointments(formattedAppointments);
                } else {
                    setAppointments([]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Failed to load appointments. " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [psychologistId]);

    const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

    // Filter appointments based on selected status and date
    const filteredAppointments = appointments.filter(app => {
        // Filter by status if not "all"
        const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
        
        // Filter by current selected date
        const appDate = parseISO(app.appointmentDate);
        const dateMatch = 
            appDate.getDate() === currentDate.getDate() && 
            appDate.getMonth() === currentDate.getMonth() && 
            appDate.getFullYear() === currentDate.getFullYear();
        
        return statusMatch && dateMatch;
    });

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id="main" className="main">
                <PageTitle page="My Appointments" />
                
                <div className="psy-appointments-container">
                    {/* Header with filters and date navigation */}
                    <div className="appointments-header">
                        <div className="status-filters">
                            {statuses.map(status => (
                                <button
                                    key={status.id}
                                    className={`status-button ${selectedStatus === status.id ? 'active' : ''}`}
                                    onClick={() => setSelectedStatus(status.id)}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>

                        <div className="date-navigation">
                            <button className="nav-button" onClick={goToPreviousDay}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className="date-display">
                                <Calendar size={16} className="calendar-icon" />
                                <h2 className="current-date">{formattedDate}</h2>
                            </div>
                            <button className="nav-button" onClick={goToNextDay}>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading your appointments...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="error-state">
                            <AlertCircle size={40} />
                            <p className="error-message">{error}</p>
                            <button className="retry-btn" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filteredAppointments.length === 0 && (
                        <div className="empty-state">
                            <Calendar size={48} strokeWidth={1} />
                            <h3>No appointments found</h3>
                            <p>There are no appointments scheduled for this day with the selected filter.</p>
                        </div>
                    )}

                    {/* Appointments list */}
                    {!loading && !error && filteredAppointments.length > 0 && (
                        <div className="appointments-list">
                            {filteredAppointments.map(appointment => (
                                <div 
                                    className={`appointment-card status-${appointment.status.toLowerCase()}`} 
                                    key={appointment.appointmentId}
                                >
                                    {/* Time section */}
                                    <div className="time-section">
                                        <div className="time-slot-tag">
                                            {appointment.timeSlot}
                                        </div>
                                    </div>
                                    
                                    {/* Details section */}
                                    <div className="details-section">
                                        <div className="app-header">
                                            <div className="name-status">
                                                <h3 className="patient-name">
                                                    <User size={16} className="user-icon" />
                                                    Student ID: {appointment.userId}
                                                </h3>
                                                <span className={`status ${appointment.status.toLowerCase()}`}>
                                                    {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="info-grid">
                                            {/* Date information */}
                                            <div className="info-item">
                                                <Calendar className="icon" size={16} />
                                                <span className="text">
                                                    {appointment.formattedDate}
                                                </span>
                                            </div>
                                            
                                            {/* Time slot information */}
                                            <div className="info-item">
                                                <Clock className="icon" size={16} />
                                                <span className="text">
                                                    Time Slot: {appointment.timeSlot}
                                                </span>
                                            </div>
                                            
                                            {/* User ID information */}
                                            <div className="info-item">
                                                <User className="icon" size={16} />
                                                <span className="text">
                                                    User ID: {appointment.userId}
                                                </span>
                                            </div>
                                            
                                            {/* Appointment ID information */}
                                            <div className="info-item">
                                                <FileText className="icon" size={16} />
                                                <span className="text notes-text">
                                                    Appointment ID: {appointment.appointmentId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions section */}
                                    <div className="actions">
                                        <button 
                                            className="action-btn edit-notes"
                                            onClick={() => handleEdit(appointment.appointmentId)}
                                            disabled={appointment.status === 'CANCELLED'}
                                        >
                                            <Edit className="icon" size={16} />
                                            <span>Add Notes</span>
                                        </button>
                                        
                                        <button 
                                            className="action-btn view-profile"
                                            onClick={() => navigate(`/student-profile/${appointment.userId}`)}
                                        >
                                            View Student
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PsyAppointments;