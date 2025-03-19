import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import Sidebar from '../UserInfo/Sidebar';
// Import MUI components
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// Import SweetAlert2
import Swal from 'sweetalert2';
import './AppointmentHistory.css';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // Changed default filter from 'all' to 'upcoming'
  const [cancelling, setCancelling] = useState(false); // Track cancellation state
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(1);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setError('Authentication information not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:8080/identity/users/appointmenthistory/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Appointment history response:', response.data);
      
      // Process the appointments data
      const appointmentsData = response.data.result || [];
      setAppointments(appointmentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      setError('Failed to load appointments. Please try again later.');
      setLoading(false);
    }
  };

  // Format date from ISO string to readable format
  const formatAppointmentDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return 'Invalid date';
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

// Format time slot for display
const formatTimeSlot = (timeSlot) => {
  if (!timeSlot) return 'N/A';
  
  // If timeSlot is already formatted like "09:00 - 11:00", parse and reformat it
  if (timeSlot.includes(' - ')) {
    const [start, end] = timeSlot.split(' - ');
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    return `${startHour}h-${endHour}h`;
  }
  
  // Otherwise format it as a range (assuming 2-hour slots)
  try {
    const [hours, minutes] = timeSlot.split(':');
    const startHour = parseInt(hours);
    const endHour = startHour + 2;
    
    return `${startHour}h-${endHour}h`;
  } catch (error) {
    console.error('Time slot formatting error:', error);
    return timeSlot;
  }
};

  // Cancel appointment function
  const cancelAppointment = async (appointmentId) => {
    // Replace window.confirm with SweetAlert2
    const result = await Swal.fire({
      title: 'Cancel Appointment',
      text: "Are you sure you want to cancel this appointment? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    try {
      setCancelling(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication information not found. Please log in again.');
        setCancelling(false);
        return;
      }
      
      const response = await axios.delete(
        `http://localhost:8080/identity/users/cancelappointment/${appointmentId}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Cancel appointment response:', response.data);
      
      if (response.data.code === 1000) {
        // Show success message with SweetAlert2 instead of toast
        await Swal.fire({
          title: 'Cancelled!',
          text: 'Your appointment has been cancelled successfully.',
          icon: 'success',
          confirmButtonColor: '#4F46E5'
        });
        
        // Refresh the appointment list
        fetchAppointments();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message || 'Failed to cancel appointment',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      }
      
      setCancelling(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to cancel appointment. Please try again.',
        icon: 'error',
        confirmButtonColor: '#4F46E5'
      });
      setCancelling(false);
    }
  };

  // Updated: Check if date is in the future and appointment is not cancelled
  const isUpcoming = (dateString, active) => {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    return appointmentDate > now && active !== false && active !== 0;
  };

  // Get appointment status based on active flag and date - MOVED UP
  const getAppointmentStatus = (appointment) => {
    if (appointment.active === false || appointment.active === 0) {
      return 'cancelled';
    } else if (appointment.active === true || appointment.active === 1) {
      return 'completed';
    }
    
    const appointmentDate = new Date(appointment.appointmentDate);
    const now = new Date();
    return appointmentDate > now ? 'upcoming' : 'past';
  };

  // Sort appointments by date (nearest first)
  const sortAppointmentsByDate = (appts) => {
    return [...appts].sort((a, b) => {
      // First check active status - prioritize upcoming appointments
      if ((a.active === null || a.active === undefined) && (b.active === true || b.active === 1 || b.active === false || b.active === 0)) {
        return -1;
      }
      if ((b.active === null || b.active === undefined) && (a.active === true || a.active === 1 || a.active === false || a.active === 0)) {
        return 1;
      }
      
      // If both have same active status, sort by date
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      const now = new Date();
      
      // Prioritize upcoming over past appointments
      const aIsUpcoming = dateA > now;
      const bIsUpcoming = dateB > now;
      
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      
      // If both are upcoming or both are past, sort by nearest date
      if (aIsUpcoming && bIsUpcoming) {
        return dateA - dateB; // Closest upcoming first
      } else {
        return dateB - dateA; // Most recent past first
      }
    });
  };

  // Updated: Filter and sort appointments based on selected filter
  const getFilteredAndSortedAppointments = () => {
    const filtered = appointments.filter(appointment => {
      const status = getAppointmentStatus(appointment);
      
      if (filter === 'cancelled') {
        return status === 'cancelled';
      } else if (filter === 'upcoming') {
        return status === 'upcoming';
      } else if (filter === 'past') {
        return status === 'past';
      } else if (filter === 'completed') {
        return status === 'completed';
      }
      return true; // 'all' filter
    });

    return sortAppointmentsByDate(filtered);
  };

  // Get current appointments for pagination
  const filteredAndSortedAppointments = getFilteredAndSortedAppointments();
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAndSortedAppointments.slice(
    indexOfFirstAppointment, 
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <Sidebar activeItem="appointments" />
        <div className="profile-content">
          <div className="profile-header-card">
            <div className="appointment-history-header">
              <h1>My Appointments</h1>
              <p>View and manage your scheduled appointments</p>
            </div>
            
            <div className="filter-controls">
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
            
            <div className="actions-bar">
              <Link to="/booking" className="new-appointment-btn">
                <i className="fas fa-plus-circle"></i> Book New Appointment
              </Link>
            </div>
          </div>
          
          <div className="profile-card appointments-card">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your appointments...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={fetchAppointments}>Try Again</button>
              </div>
            ) : filteredAndSortedAppointments.length > 0 ? (
              <>
                <div className="appointments-list">
                  {currentAppointments.map((appointment) => {
                    const status = getAppointmentStatus(appointment);
                    return (
                      <div 
                        key={appointment.appointmentId} 
                        className={`appointment-card ${status}`}
                      >
                        <div className={`appointment-status ${status}`}>
                          {status === 'cancelled' 
                            ? 'Cancelled' 
                            : status === 'upcoming' 
                            ? 'Upcoming' 
                            : status === 'completed'
                            ? 'Completed'
                            : 'Past'}
                        </div>
                        
                        <div className="appointment-details">
                          <div className="appointment-date">
                            <i className="fas fa-calendar-alt"></i>
                            <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                          </div>
                          
                          <div className="detail-divider"></div>
                          
                          <div className="appointment-time">
                            <i className="fas fa-clock"></i>
                            <span>{formatTimeSlot(appointment.timeSlot)}</span>
                          </div>
                          
                          {appointment.psychologistName && (
                            <>
                              <div className="detail-divider"></div>
                              <div className="appointment-doctor">
                                <i className="fas fa-user-md"></i>
                                <span>Dr. {appointment.psychologistName}</span>
                              </div>
                            </>
                          )}
                          
                          {appointment.notes && (
                            <>
                              <div className="detail-divider"></div>
                              <div className="appointment-notes">
                                <i className="fas fa-sticky-note"></i>
                                <span>{appointment.notes}</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {status === 'upcoming' && (
                          <div className="appointment-actions">
                            <button 
                              className="cancel-btn" 
                              onClick={() => cancelAppointment(appointment.appointmentId)}
                              disabled={cancelling}
                            >
                              <i className="fas fa-times-circle"></i> 
                              {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Replace custom pagination with MUI Pagination */}
                {filteredAndSortedAppointments.length > appointmentsPerPage && (
                  <div className="pagination-container-mui">
                    <div className="pagination-info">
                      Showing {currentAppointments.length > 0 ? `${indexOfFirstAppointment + 1}-${Math.min(indexOfLastAppointment, filteredAndSortedAppointments.length)}` : "0"} of {filteredAndSortedAppointments.length} appointments
                    </div>
                    
                    <Stack spacing={2}>
                      <Pagination 
                        count={Math.ceil(filteredAndSortedAppointments.length / appointmentsPerPage)} 
                        page={currentPage}
                        onChange={(event, value) => paginate(value)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        className="mui-pagination"
                      />
                    </Stack>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="far fa-calendar"></i>
                </div>
                <h3>No {filter !== 'all' ? filter : ''} appointments found</h3>
                <p>
                  {filter === 'upcoming' 
                    ? "You don't have any upcoming appointments scheduled."
                    : filter === 'past'
                    ? "You don't have any past appointments that need to be reviewed."
                    : filter === 'completed'
                    ? "You don't have any completed appointments."
                    : filter === 'cancelled'
                    ? "You don't have any cancelled appointments."
                    : "You haven't booked any appointments yet."}
                </p>
                <Link to="/booking" className="book-now-btn">Book an Appointment Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AppointmentHistory;

