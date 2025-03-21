import React, { useState, useEffect } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import axios from 'axios';
import { Calendar, Search, User, Clock, Eye, AlertTriangle, CheckCircle, XCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import './ManagingAppointment.css';
import AdminHeader from '../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';

const ManagingAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    
    // Pagination states
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    
    // Fetch all appointments on component mount
    useEffect(() => {
        const fetchAllAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Use the all appointments endpoint
                const response = await axios.get('http://localhost:8080/identity/admin/allappointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && Array.isArray(response.data.result)) {
                    // Process the appointment data
                    const formattedAppointments = response.data.result.map(appointment => {
                        const appointmentDate = parseISO(appointment.appointmentDate);
                        const isPastAppointment = new Date(appointmentDate) < new Date() && !isToday(appointmentDate);
                        
                        // Determine status based on 'active' property and date:
                        // - active = null -> UPCOMING
                        // - active = false -> CANCELLED
                        // - active = true -> COMPLETED
                        // - past date (and not cancelled or completed) -> PAST
                        let status;
                        if (appointment.active === false) {
                            status = 'CANCELLED';
                        } else if (appointment.active === true) {
                            status = 'COMPLETED';
                        } else if (isPastAppointment && appointment.active === null) {
                            status = 'PAST';
                        } else {
                            status = 'UPCOMING';
                        }
                        
                        return {
                            ...appointment,
                            formattedDate: format(appointmentDate, 'EEEE, MMMM d, yyyy'),
                            formattedTime: format(appointmentDate, 'h:mm a'),
                            status: status,
                            isPast: isPastAppointment
                        };
                    });
                    
                    // Sort appointments by date (newest first)
                    formattedAppointments.sort((a, b) => 
                        new Date(b.appointmentDate) - new Date(a.appointmentDate)
                    );
                    
                    setAppointments(formattedAppointments);
                } else {
                    setError("Failed to load appointments. Invalid response format.");
                    setAppointments([]);
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Failed to load appointments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllAppointments();
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filter]);

    // Filter and search appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesFilter = 
            filter === 'all' || 
            (filter === 'upcoming' && appointment.status === 'UPCOMING') ||
            (filter === 'past' && appointment.status === 'PAST') ||
            (filter === 'completed' && appointment.status === 'COMPLETED') ||
            (filter === 'cancelled' && appointment.status === 'CANCELLED'); // Fix for cancelled filter
        
        const matchesSearch = 
            searchQuery === "" || 
            appointment.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.psychologistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // appointment.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // appointment.psychologistId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // Pagination calculations
    const indexOfLastAppointment = currentPage * itemsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    // Cancel appointment function
    const cancelAppointment = async (appointmentId) => {
        // Confirm before cancellation
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }
        
        setCancelling(true);
        setCancelError(null);
        
        try {
            const token = localStorage.getItem('token');
            
            // Call the cancel appointment endpoint with DELETE method
            const response = await axios.delete(
                `http://localhost:8080/identity/admin/cancelappointment/${appointmentId}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                // Update the appointment in the local state
                const updatedAppointments = appointments.map(appointment => {
                    if (appointment.appointmentId === appointmentId) {
                        return { 
                            ...appointment, 
                            active: false,
                            status: 'CANCELLED'
                        };
                    }
                    return appointment;
                });
                
                setAppointments(updatedAppointments);
                alert("Appointment cancelled successfully");
            } else {
                setCancelError("Failed to cancel appointment. Please try again.");
            }
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            setCancelError(err.response?.data?.message || "An error occurred while cancelling the appointment");
            alert(err.response?.data?.message || "An error occurred while cancelling the appointment");
        } finally {
            setCancelling(false);
        }
    };

    // Get appointment status class and label
    const getAppointmentStatusInfo = (appointment) => {
        switch(appointment.status) {
            case 'COMPLETED':
                return {
                    className: 'completed',
                    label: 'Completed',
                    icon: <CheckCircle size={14} className="status-icon" />
                };
            case 'CANCELLED':
                return {
                    className: 'cancelled',
                    label: 'Cancelled',
                    icon: <XCircle size={14} className="status-icon" />
                };
            case 'PAST':
                return {
                    className: 'past',
                    label: 'Past',
                    icon: <Clock size={14} className="status-icon" />
                };
            case 'UPCOMING':
                return {
                    className: 'upcoming',
                    label: 'Upcoming',
                    icon: <Clock size={14} className="status-icon" />
                };
            default:
                return {
                    className: 'unknown',
                    label: 'Unknown',
                    icon: <AlertTriangle size={14} className="status-icon" />
                };
        }
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            
            <main className="main admin-main">
                <div className="admin-appointment-container">
                    <div className="appointment-management-header">
                        <h1>All Appointments</h1>
                        <p>View and manage all psychologist appointments</p>
                    </div>
                    
                    <div className="controls-container">
                        {/* Filter and Search */}
                        <div className="filter-search-container">
                            <div className="filter-buttons">
                                <button 
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All Appointments
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                                    onClick={() => setFilter('upcoming')}
                                >
                                    Upcoming
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                                    onClick={() => setFilter('completed')}
                                >
                                    Completed
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                                    onClick={() => setFilter('past')}
                                >
                                    Past
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                                    onClick={() => setFilter('cancelled')}
                                >
                                    Cancelled
                                </button>
                            </div>
                            
                            <div className="search-container-psychoappointment">
                                <Search size={16} className="search-icon" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search by student, psychologist or appointment ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        className="clear-search-btn"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Results summary */}
                        {!loading && (
                            <div className="results-info">
                                <div className="results-count">
                                    <span className="count-number">{filteredAppointments.length}</span> of {appointments.length} appointments
                                    {searchQuery && <span className="search-query"> matching "{searchQuery}"</span>}
                                </div>
                                <div className="filter-tags">
                                    {filter !== 'all' && (
                                        <div className="filter-tag">
                                            {filter}
                                            <button 
                                                className="remove-filter" 
                                                onClick={() => setFilter('all')}
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Appointments Content */}
                    <div className="appointments-content">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading appointments...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <AlertTriangle size={32} />
                                <p>{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="retry-btn"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="empty-state">
                                <Calendar size={40} strokeWidth={1.5} />
                                <h3>No appointments found</h3>
                                <p>
                                    {filter !== 'all' 
                                        ? `There are no ${filter} appointments.` 
                                        : searchQuery 
                                            ? "No appointments match your search." 
                                            : "There are no appointments scheduled."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="appointments-table-container">
                                    <table className="appointments-table">
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Time Slot</th>
                                                <th>User Name</th>
                                                <th>User Email</th>
                                                <th>Psychologist</th>
                                                <th>Psychologist Email</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentAppointments.map(appointment => {
                                                const statusInfo = getAppointmentStatusInfo(appointment);
                                                
                                                return (
                                                    <tr key={appointment.appointmentId} className={statusInfo.className}>
                                                        <td className="status-cell">
                                                            <span className={`status-badge ${statusInfo.className}`}>
                                                                {statusInfo.icon}
                                                                {statusInfo.label}
                                                            </span>
                                                        </td>
                                                        <td className="date-cell">
                                                            <Calendar size={16} className="cell-icon" />
                                                            {appointment.formattedDate}
                                                        </td>
                                                        <td className="time-slot-cell">
                                                            <Clock size={16} className="cell-icon" />
                                                            {appointment.timeSlot}
                                                        </td>
                                                        <td className="student-cell">
                                                            <User size={16} className="cell-icon" />
                                                            <span className="id-text" title={appointment.studentName}>
                                                                {appointment.studentName}
                                                            </span>
                                                        </td>
                                                        <td className="student-email-cell">
                                                            <span className="id-text" title={appointment.studentEmail}>
                                                                {appointment.studentEmail}
                                                            </span>
                                                        </td>
                                                        <td className="psychologist-cell">
                                                            <User size={16} className="cell-icon" />
                                                            <span className="id-text" title={appointment.psychologistName}>
                                                                {appointment.psychologistName}
                                                            </span>
                                                        </td>
                                                        <td className="psychologist-email-cell">
                                                            <span className="id-text" title={appointment.psychologistEmail}>
                                                                {appointment.psychologistEmail}
                                                            </span>
                                                        </td>
                                                        <td className="actions-cell">
                                                            {/* Only show cancel button for UPCOMING appointments that are not in the past */}
                                                            {appointment.status === 'UPCOMING' ? (
                                                                <button 
                                                                    className="action-btn cancel-appointment"
                                                                    onClick={() => cancelAppointment(appointment.appointmentId)}
                                                                    title="Cancel Appointment"
                                                                    disabled={cancelling}
                                                                >
                                                                    <XCircle size={16} />
                                                                    <span className="action-text">Cancel</span>
                                                                </button>
                                                            ) : (
                                                                <span className="no-action-available">
                                                                    {appointment.status === 'COMPLETED' ? "Completed" : 
                                                                    appointment.status === 'CANCELLED' ? "Cancelled" : 
                                                                    appointment.status === 'PAST' ? "Past" : "No action"}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination */}
                                {filteredAppointments.length > 0 && (
                                    <div className="pagination-container">
                                        <div className="pagination-info">
                                            Showing <span className="fw-bold">
                                                {filteredAppointments.length > 0 ? 
                                                    `${indexOfFirstAppointment + 1}-${Math.min(indexOfLastAppointment, filteredAppointments.length)}` 
                                                    : "0"
                                                }
                                            </span> of <span className="fw-bold">{filteredAppointments.length}</span> appointments
                                        </div>
                                        
                                        {totalPages > 1 && (
                                            <div className="pagination-controls">
                                                <ul className="pagination">
                                                    <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="pagination-link" 
                                                            onClick={() => setCurrentPage(1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <ChevronsLeft size={18} />
                                                        </button>
                                                    </li>
                                                    <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="pagination-link" 
                                                            onClick={() => setCurrentPage(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <ChevronLeft size={18} />
                                                        </button>
                                                    </li>
                                                    
                                                    {totalPages <= 5 ? (
                                                        Array.from({ length: totalPages }, (_, i) => (
                                                            <li 
                                                                key={i + 1} 
                                                                className={`pagination-item ${currentPage === i + 1 ? 'active' : ''}`}
                                                            >
                                                                <button 
                                                                    className="pagination-link" 
                                                                    onClick={() => setCurrentPage(i + 1)}
                                                                >
                                                                    {i + 1}
                                                                </button>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <>
                                                            {currentPage > 2 && (
                                                                <li className="pagination-item">
                                                                    <button 
                                                                        className="pagination-link" 
                                                                        onClick={() => setCurrentPage(1)}
                                                                    >
                                                                        1
                                                                    </button>
                                                                </li>
                                                            )}
                                                            
                                                            {currentPage > 3 && (
                                                                <li className="pagination-item disabled">
                                                                    <span className="pagination-ellipsis">...</span>
                                                                </li>
                                                            )}
                                                            
                                                            {currentPage > 1 && (
                                                                <li className="pagination-item">
                                                                    <button 
                                                                        className="pagination-link" 
                                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                                    >
                                                                        {currentPage - 1}
                                                                    </button>
                                                                </li>
                                                            )}
                                                            
                                                            <li className="pagination-item active">
                                                                <span className="pagination-current">{currentPage}</span>
                                                            </li>
                                                            
                                                            {currentPage < totalPages && (
                                                                <li className="pagination-item">
                                                                    <button 
                                                                        className="pagination-link" 
                                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                                    >
                                                                        {currentPage + 1}
                                                                    </button>
                                                                </li>
                                                            )}
                                                            
                                                            {currentPage < totalPages - 2 && (
                                                                <li className="pagination-item disabled">
                                                                    <span className="pagination-ellipsis">...</span>
                                                                </li>
                                                            )}
                                                            
                                                            {currentPage < totalPages - 1 && (
                                                                <li className="pagination-item">
                                                                    <button 
                                                                        className="pagination-link" 
                                                                        onClick={() => setCurrentPage(totalPages)}
                                                                    >
                                                                        {totalPages}
                                                                    </button>
                                                                </li>
                                                            )}
                                                        </>
                                                    )}
                                                    
                                                    <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="pagination-link" 
                                                            onClick={() => setCurrentPage(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </li>
                                                    <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="pagination-link" 
                                                            onClick={() => setCurrentPage(totalPages)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <ChevronsRight size={18} />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagingAppointment;
