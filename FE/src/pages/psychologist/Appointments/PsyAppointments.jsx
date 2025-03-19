import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO, isToday, isPast, isFuture } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail, Link as LinkIcon, FileText, Edit, Clock, User, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import './PsyAppointments.css';

// Helper function to parse JWT token for user ID
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
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
    const [dateFilterActive, setDateFilterActive] = useState(false); // New state to track if date filtering is active
    const [cancellingAppointment, setCancellingAppointment] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    // Status filter options
    const statuses = [
        { id: 'all', label: 'All Appointments' },
        { id: 'UPCOMING', label: 'Upcoming' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' },
        { id: 'PAST', label: 'Past' }
    ];

    // Function to handle editing appointment/adding notes
    const handleEdit = (appointmentId) => {
        const appointmentToEdit = appointments.find(app => app.appointmentId === appointmentId);
        navigate('/therapynote', { state: { appointment: appointmentToEdit } });
    };

    // Function to navigate to previous day
    const goToPreviousDay = () => {
        setCurrentDate(prevDate => subDays(prevDate, 1));
        setDateFilterActive(true); // Activate date filtering when navigating
    };

    // Function to navigate to next day
    const goToNextDay = () => {
        setCurrentDate(prevDate => addDays(prevDate, 1));
        setDateFilterActive(true); // Activate date filtering when navigating
    };

    // Function to reset date filter
    const resetDateFilter = () => {
        setDateFilterActive(false);
        setCurrentDate(new Date());
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

    // Helper function to determine appointment timing (past, today, future)
    const getAppointmentTiming = (dateString) => {
        const date = parseISO(dateString);
        if (isPast(date) && !isToday(date)) return 'past';
        if (isToday(date)) return 'today';
        if (isFuture(date)) return 'future';
        return '';
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
                    // Process the appointments based on the schema
                    const formattedAppointments = response.data.result.map(app => {
                        // Parse the date
                        const date = parseISO(app.appointmentDate);
                        const isPastAppointment = isPast(date) && !isToday(date);
                        
                        // Determine status based on 'active' property and date:
                        // - active = null -> UPCOMING
                        // - active = false -> CANCELLED
                        // - active = true -> COMPLETED
                        // - past date (and not cancelled or completed) -> PAST
                        let status;
                        if (app.active === false) {
                            status = 'CANCELLED';
                        } else if (app.active === true) {
                            status = 'COMPLETED';
                        } else if (isPastAppointment && app.active === null) {
                            status = 'PAST';
                        } else {
                            status = 'UPCOMING';
                        }

                        return {
                            ...app, // Preserve all original properties
                            appointmentId: app.appointmentId || app.id, // Ensure we have an ID
                            active: app.active, // Store the active property
                            status: status, // Set status based on active property and date
                            // Format time for display
                            formattedTime: format(date, 'HH:mm'),
                            formattedDate: format(date, 'PPP'),
                            period: format(date, 'a').toUpperCase(),
                            // Add timing property
                            timing: getAppointmentTiming(app.appointmentDate)
                        };
                    });

                    // Sort by date (past first, then today, then future)
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

    // Function to show cancel confirmation dialog using SweetAlert
    const showCancelConfirmation = (appointmentId) => {
        Swal.fire({
            title: 'Cancel Appointment',
            text: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Cancel Appointment',
            cancelButtonText: 'No, Keep Appointment'
        }).then((result) => {
            if (result.isConfirmed) {
                handleCancelAppointment(appointmentId);
            }
        });
    };

    // Function to handle appointment cancellation
    const handleCancelAppointment = async (appointmentId) => {
        if (!appointmentId) return;

        // Set cancelling state
        setCancellingAppointment(appointmentId);
        setCancelSuccess(null);
        setCancelError(null);

        try {
            const token = localStorage.getItem('token');

            // Make request to cancel appointment endpoint using correct URL
            const response = await axios.delete(
                `http://localhost:8080/identity/psychologists/cancelappointment/${appointmentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Cancel appointment response:", response.data);

            // Handle the specific response schema
            if (response.data && response.data.code === 1000) {
                // Update the appointment in the local state
                setAppointments(prevAppointments =>
                    prevAppointments.map(app =>
                        app.appointmentId === appointmentId
                            ? { ...app, status: 'CANCELLED', active: false }
                            : app
                    )
                );

                // Show success message with SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || `Appointment cancelled successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                // Show error message with SweetAlert
                Swal.fire({
                    title: 'Error!',
                    text: response.data?.message || "Failed to cancel appointment. Please try again.",
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            // Show error message with SweetAlert
            Swal.fire({
                title: 'Error!',
                text: "Failed to cancel appointment. " + (err.response?.data?.message || err.message),
                icon: 'error'
            });
        } finally {
            setCancellingAppointment(null);
        }
    };

    // Function to handle marking an appointment as completed
    const handleCompleteAppointment = async (appointmentId) => {
        if (!appointmentId) return;

        // Set state to show we're processing
        setCancellingAppointment(appointmentId); // Reusing this state for visual feedback
        setCancelSuccess(null);
        setCancelError(null);

        try {
            const token = localStorage.getItem('token');

            // Make request to complete appointment endpoint
            const response = await axios.put(
                `http://localhost:8080/identity/psychologists/completeappointment/${appointmentId}`,
                {}, // Empty body since we're just changing status
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Complete appointment response:", response.data);

            // Handle successful response
            if (response.data && response.data.code === 1000) {
                // Update the appointment in the local state
                setAppointments(prevAppointments =>
                    prevAppointments.map(app =>
                        app.appointmentId === appointmentId
                            ? { ...app, status: 'COMPLETED', active: true }
                            : app
                    )
                );

                // Show success message with SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || `Appointment marked as completed successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                // Show error message with SweetAlert
                Swal.fire({
                    title: 'Error!',
                    text: response.data?.message || "Failed to complete appointment. Please try again.",
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error("Error completing appointment:", err);
            // Show error message with SweetAlert
            Swal.fire({
                title: 'Error!',
                text: "Failed to complete appointment. " + (err.response?.data?.message || err.message),
                icon: 'error'
            });
        } finally {
            setCancellingAppointment(null);
        }
    };

    // Function to show complete confirmation dialog
    const showCompleteConfirmation = (appointmentId) => {
        Swal.fire({
            title: 'Mark as Completed',
            text: 'Are you sure you want to mark this appointment as completed?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Green color for completion
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Mark as Completed',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                handleCompleteAppointment(appointmentId);
            }
        });
    };

    // Filter appointments based on selected status and date (if date filter is active)
    const filteredAppointments = appointments.filter(app => {
        // Filter by status if not "all"
        const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;

        // Filter by current selected date only if date filter is active
        let dateMatch = true;
        if (dateFilterActive) {
            const appDate = parseISO(app.appointmentDate);
            dateMatch =
                appDate.getDate() === currentDate.getDate() &&
                appDate.getMonth() === currentDate.getMonth() &&
                appDate.getFullYear() === currentDate.getFullYear();
        }

        return statusMatch && dateMatch;
    });

    // Group appointments by date for better organization
    const getGroupedAppointments = () => {
        const grouped = {};

        filteredAppointments.forEach(app => {
            const dateKey = format(parseISO(app.appointmentDate), 'yyyy-MM-dd');
            const timing = getAppointmentTiming(app.appointmentDate);

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    formattedDate: format(parseISO(app.appointmentDate), 'EEEE, MMMM d, yyyy'),
                    timing: timing,
                    appointments: []
                };
            }
            grouped[dateKey].appointments.push(app);
        });

        // Sort dates chronologically
        return Object.keys(grouped)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(key => grouped[key]);
    };

    const groupedAppointments = getGroupedAppointments();
    const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

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
                            <button className="date-button" onClick={goToPreviousDay}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className={`date-display ${dateFilterActive ? 'date-active' : ''}`}>
                                <Calendar size={16} className="calendar-icon" />
                                <h2 className="current-date">
                                    {dateFilterActive ? `Filtering by: ${formattedDate}` : 'Showing All Dates'}
                                </h2>
                                {dateFilterActive && (
                                    <button className="reset-date-btn" onClick={resetDateFilter}>
                                        Show All
                                    </button>
                                )}
                            </div>
                            <button className="date-button" onClick={goToNextDay}>
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
                            <p>
                                {dateFilterActive
                                    ? `There are no appointments scheduled for ${formattedDate} with the selected filter.`
                                    : 'There are no appointments matching the selected filters.'}
                            </p>
                        </div>
                    )}

                    {/* Display success message if any */}
                    {cancelSuccess && (
                        <div className="success-alert">
                            <div className="success-message">{cancelSuccess}</div>
                        </div>
                    )}

                    {/* Display error message if any */}
                    {cancelError && (
                        <div className="error-alert">
                            <div className="error-message">{cancelError}</div>
                            <button className="close-alert" onClick={() => setCancelError(null)}>×</button>
                        </div>
                    )}

                    {/* Appointments list grouped by date */}
                    {!loading && !error && groupedAppointments.length > 0 && (
                        <div className="appointments-list">
                            {groupedAppointments.map((group, groupIndex) => (
                                <div key={groupIndex} className={`appointment-date-group`}>
                                    <h3 className={`date-group-header ${group.timing}`}>
                                        {group.formattedDate}
                                    </h3>
                                    <div className="appointments-container">
                                        {group.appointments.map(appointment => (
                                            <div
                                                className={`appointment-card status-${appointment.status.toLowerCase()} timing-${appointment.timing}`}
                                                key={appointment.appointmentId}
                                            >
                                                {/* Time section */}
                                                <div className="time-section">
                                                    <div className={`time-slot-tag ${appointment.timing}`}>
                                                        {appointment.timeSlot}
                                                    </div>
                                                </div>

                                                {/* Details section */}
                                                <div className="details-section">
                                                    <div className="app-header">
                                                        <div className="name-status">
                                                            <h3 className="patient-name">
                                                                <User size={16} className="user-icon" />
                                                                {appointment.studentName}
                                                                {/* Status badges */}
                                                                {appointment.status === 'CANCELLED' && (
                                                                    <span className="timing-badge cancelled">Cancelled</span>
                                                                )}
                                                                {appointment.status === 'COMPLETED' && (
                                                                    <span className="timing-badge completed">Completed</span>
                                                                )}
                                                                {appointment.status === 'PAST' && (
                                                                    <span className="timing-badge past">Past</span>
                                                                )}
                                                                {appointment.status === 'UPCOMING' && (
                                                                    <span className="timing-badge upcoming">
                                                                        {appointment.timing === 'today' ? 'Today' : 'Upcoming'}
                                                                    </span>
                                                                )}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="info-grid">
                                                        {/* User Email information */}
                                                        <div className="info-item">
                                                            <Mail className="icon" size={16} />
                                                            <span className="text">
                                                                {appointment.studentEmail}
                                                            </span>
                                                        </div>

                                                        {/* Date information */}
                                                        <div className="info-item">
                                                            <Calendar className="icon" size={16} />
                                                            <span className="text">
                                                                {appointment.formattedDate}
                                                            </span>
                                                        </div>

                                                        {/* Time information */}
                                                        <div className="info-item">
                                                            <Clock className="icon" size={16} />
                                                            <span className="text">
                                                                Time: {appointment.timeSlot}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions section */}
                                                <div className="actions">
                                                    {/* Cancel button - for UPCOMING appointments only */}
                                                    {appointment.status === 'UPCOMING' && (
                                                        <button
                                                            className="action-btn cancel-appointment"
                                                            onClick={() => showCancelConfirmation(appointment.appointmentId)}
                                                            disabled={cancellingAppointment === appointment.appointmentId}
                                                        >
                                                            {cancellingAppointment === appointment.appointmentId ? (
                                                                <span>Cancelling...</span>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="icon" size={16} />
                                                                    <span>Cancel</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    {/* Complete button - for UPCOMING and PAST appointments */}
                                                    {(appointment.status === 'UPCOMING' || appointment.status === 'PAST') && (
                                                        <button
                                                            className="action-btn complete-appointment"
                                                            onClick={() => showCompleteConfirmation(appointment.appointmentId)}
                                                            disabled={cancellingAppointment === appointment.appointmentId}
                                                        >
                                                            {cancellingAppointment === appointment.appointmentId ? (
                                                                <span>Processing...</span>
                                                            ) : (
                                                                <>
                                                                    <Clock className="icon" size={16} />
                                                                    <span>Complete</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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