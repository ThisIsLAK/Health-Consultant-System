import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail, Link as LinkIcon, FileText, Edit, Clock, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import ApiService from '../../../service/ApiService';
import './PsyAppointments.css';

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
        { id: 'SCHEDULED', label: 'Scheduled' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' }
    ];

    // Function to handle editing appointment/adding notes
    const handleEdit = (appointmentId) => {
        const appointmentToEdit = appointments.find(app => app.id === appointmentId);
        navigate('/therapynote', { state: { appointment: appointmentToEdit } });
    };

    // Function to start the meeting
    const startMeeting = (meetingLink) => {
        if (meetingLink && meetingLink !== 'Not yet generated') {
            window.open(meetingLink, '_blank');
        }
    };

    // Function to navigate to previous day
    const goToPreviousDay = () => {
        setCurrentDate(prevDate => subDays(prevDate, 1));
    };

    // Function to navigate to next day
    const goToNextDay = () => {
        setCurrentDate(prevDate => addDays(prevDate, 1));
    };

    // Load the psychologist ID from the logged-in user
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userResponse = await ApiService.getLoggedInUserInfo();
                if (userResponse.status === 200 && userResponse.data) {
                    setPsychologistId(userResponse.data.id);
                } else {
                    setError("Could not retrieve psychologist information");
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                setError("Error fetching user information");
            }
        };

        fetchUserInfo();
    }, []);

    // Fetch appointments when psychologistId or currentDate changes
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!psychologistId) return;
            
            setLoading(true);
            try {
                const formattedDate = format(currentDate, 'yyyy-MM-dd');
                // Updated endpoint URL based on the new format
                const response = await fetch(`${ApiService.BASE_URL}/identity/psychologists/psyappointment/${psychologistId}`, {
                    headers: ApiService.getHeader()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const responseData = await response.json();
                
                // Check if the API call was successful and get the result array
                if (responseData.code !== 1073741824) {
                    throw new Error(responseData.message || "Failed to fetch appointments");
                }
                
                const data = responseData.result || [];
                
                // Transform data for display based on the new schema
                const transformedAppointments = data.map(app => {
                    // Parse the appointment date
                    const appointmentDateTime = parseISO(app.appointmentDate);
                    
                    return {
                        id: app.appointmentId, // Use appointmentId from schema
                        time: format(appointmentDateTime, 'HH:mm'),
                        period: format(appointmentDateTime, 'a').toUpperCase(),
                        duration: "30 mins", // Default value as it's not in the schema
                        name: "Student", // Placeholder as it's not in the schema
                        status: "SCHEDULED", // Default value as it's not in the schema
                        type: app.timeSlot || "Consultation", // Using timeSlot from schema
                        phone: "N/A", // Placeholder
                        email: "N/A", // Placeholder
                        meetingLink: "Not yet generated", // Placeholder
                        notes: "No notes available", // Placeholder
                        studentId: app.userId, // Using userId from schema as studentId
                        rawTime: app.appointmentDate, // Keep raw time for comparison
                        timeSlot: app.timeSlot // New field from schema
                    };
                });
                
                // Sort appointments by time
                transformedAppointments.sort((a, b) => 
                    new Date(a.rawTime) - new Date(b.rawTime)
                );
                
                setAppointments(transformedAppointments);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Failed to load appointments");
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [psychologistId, currentDate]);

    const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

    const filteredAppointments = selectedStatus === 'all'
        ? appointments
        : appointments.filter(app => app.status === selectedStatus);

    // Check if an appointment is coming up soon (within 15 minutes)
    const isComingSoon = (appointmentTime) => {
        if (!appointmentTime) return false;
        
        const now = new Date();
        const appTime = parseISO(appointmentTime);
        const diffInMinutes = (appTime - now) / (1000 * 60);
        return diffInMinutes > 0 && diffInMinutes <= 15;
    };

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

                    {/* Content area */}
                    <div className="appointments-content">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading your appointments...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <AlertCircle size={40} />
                                <p className="error-message">{error}</p>
                                <button className="retry-btn" onClick={() => window.location.reload()}>
                                    Retry
                                </button>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="empty-state">
                                <Calendar size={48} strokeWidth={1} />
                                <h3>No appointments found</h3>
                                <p>There are no appointments scheduled for this day with the selected filter.</p>
                            </div>
                        ) : (
                            <div className="appointments-list">
                                {filteredAppointments.map(appointment => (
                                    <div 
                                        className={`appointment-card status-${appointment.status.toLowerCase()}`} 
                                        key={appointment.id}
                                    >
                                        <div className="time-section">
                                            <div className="time">{appointment.time}</div>
                                            <div className="period">{appointment.period}</div>
                                            <div className="duration">
                                                <Clock size={14} />
                                                {appointment.duration}
                                            </div>
                                            {/* Add the timeSlot from new schema */}
                                            <div className="time-slot-tag">
                                                {appointment.timeSlot}
                                            </div>
                                        </div>
                                        
                                        <div className="details-section">
                                            <div className="app-header">
                                                <div className="name-status">
                                                    <h3 className="patient-name">
                                                        <User size={16} className="user-icon" />
                                                        {/* Show studentId since we don't have name */}
                                                        Student ID: {appointment.studentId}
                                                    </h3>
                                                    <span className={`status ${appointment.status.toLowerCase()}`}>
                                                        {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                                <div className="appointment-type">{appointment.type}</div>
                                            </div>
                                            
                                            <div className="info-grid">
                                                {/* Show appointment date */}
                                                <div className="info-item">
                                                    <Calendar className="icon" size={16} />
                                                    <span className="text">
                                                        {format(parseISO(appointment.rawTime), 'PPP')}
                                                    </span>
                                                </div>
                                                
                                                {/* Show time slot again for clarity */}
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
                                                        User ID: {appointment.studentId}
                                                    </span>
                                                </div>
                                                
                                                {/* Appointment ID information */}
                                                <div className="info-item">
                                                    <FileText className="icon" size={16} />
                                                    <span className="text notes-text">
                                                        Appointment ID: {appointment.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="actions">
                                            {appointment.status === 'SCHEDULED' && (
                                                <button 
                                                    className={`action-btn join-meeting ${isComingSoon(appointment.rawTime) ? 'coming-soon' : ''}`}
                                                    disabled={true} // Disabled since meetingLink is not available
                                                    title="Meeting link not available"
                                                >
                                                    {isComingSoon(appointment.rawTime) ? 'Join Soon' : 'Join Meeting'}
                                                </button>
                                            )}
                                            
                                            <button 
                                                className="action-btn edit-notes"
                                                onClick={() => handleEdit(appointment.id)}
                                                disabled={appointment.status === 'CANCELLED'}
                                            >
                                                <Edit className="icon" size={16} />
                                                <span>Notes</span>
                                            </button>
                                            
                                            <button 
                                                className="action-btn view-profile"
                                                onClick={() => navigate(`/student-profile/${appointment.studentId}`)}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PsyAppointments;