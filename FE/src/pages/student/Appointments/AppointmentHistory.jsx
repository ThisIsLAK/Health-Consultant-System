import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner'; // Replace react-toastify with sonner
import Swal from 'sweetalert2'; // Import SweetAlert
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import './AppointmentHistory.css';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [cancellingId, setCancellingId] = useState(null); // Track which appointment is being cancelled

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

    // If timeSlot is already formatted like "09:00 - 11:00", return it as is
    if (timeSlot.includes(' - ')) return timeSlot;

    // Otherwise format it as a range (assuming 2-hour slots)
    try {
      const [hours, minutes] = timeSlot.split(':');
      const startHour = parseInt(hours);
      const endHour = startHour + 2;

      return `${hours.padStart(2, '0')}:${minutes || '00'} - ${endHour.toString().padStart(2, '0')}:${minutes || '00'}`;
    } catch (error) {
      console.error('Time slot formatting error:', error);
      return timeSlot;
    }
  };

  // Check if date is in the future
  const isUpcoming = (dateString) => {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    return appointmentDate > now;
  };

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'upcoming') {
      return isUpcoming(appointment.appointmentDate);
    } else if (filter === 'past') {
      return !isUpcoming(appointment.appointmentDate);
    }
    return true; // 'all' filter
  });

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      return;
    }

    try {
      // Set the cancelling state to show loading on the button
      setCancellingId(appointmentId);

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setCancellingId(null);
        return;
      }

      // Call the API to cancel the appointment
      const response = await axios.delete(`http://localhost:8080/identity/users/cancelappointment/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Cancel appointment response:', response.data);

      // Check if cancellation was successful
      if (response.data && response.data.code === 1000) {
        // Success - Update the local state to remove the cancelled appointment
        toast.success("Appointment cancelled successfully");

        // Remove the cancelled appointment from state
        setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
      } else {
        // Error with response
        toast.error(response.data?.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment. Please try again later.");
    } finally {
      // Clear the cancelling state
      setCancellingId(null);
    }
  };

  // Confirmation dialog for cancellation using SweetAlert instead of window.confirm
  const confirmCancelAppointment = (appointmentId, date, time) => {
    // Format the date and time for the confirmation message
    const formattedDate = formatAppointmentDate(date);

    Swal.fire({
      title: 'Cancel Appointment?',
      html: `Are you sure you want to cancel your appointment on <b>${formattedDate}</b> at <b>${time}</b>?<br><br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel appointment',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with cancellation
        cancelAppointment(appointmentId);
      }
    });
  };

  return (
    <>
      <Navbar />
      {/* Add the namespace container class to prevent CSS conflicts */}
      <div className="student-appointment-container">
        <div className="appointment-history-container">
          <div className="appointment-history-header">
            <h1>My Appointments</h1>
            <p>View and manage your scheduled appointments</p>
          </div>

          <div className="appointment-history-content">
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
                className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                onClick={() => setFilter('past')}
              >
                Past
              </button>
            </div>

            <div className="actions-bar">
              <Link to="/booking" className="new-appointment-btn">
                <i className="fas fa-plus-circle"></i> Book New Appointment
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your appointments...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error}</p>
                <button onClick={fetchAppointments} className="retry-btn">Try Again</button>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="appointments-list">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.appointmentId} className="appointment-card">
                    <div className={`appointment-status ${isUpcoming(appointment.appointmentDate) ? 'upcoming' : 'past'}`}>
                      {isUpcoming(appointment.appointmentDate) ? 'Upcoming' : 'Past'}
                    </div>

                    <div className='appointment-info'>
                      <div className="appointment-details">
                        <div className="appointment-date">
                          <i className="fas fa-calendar-day"></i>
                          <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                        </div>

                        <div className="appointment-time">
                          <i className="fas fa-clock"></i>
                          <span>{formatTimeSlot(appointment.timeSlot)}</span>
                        </div>

                        {/* Display additional information if available */}
                        {appointment.psychologistName && (
                          <div className="appointment-doctor">
                            <i className="fas fa-user-md"></i>
                            <span>Dr. {appointment.psychologistName}</span>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="appointment-notes">
                            <i className="fas fa-sticky-note"></i>
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>

                      {isUpcoming(appointment.appointmentDate) && (
                        <div className="appointment-actions">
                          <button
                            className="cancel-btn"
                            onClick={() => confirmCancelAppointment(
                              appointment.appointmentId,
                              appointment.appointmentDate,
                              appointment.timeSlot
                            )}
                            disabled={cancellingId === appointment.appointmentId}
                          >
                            {cancellingId === appointment.appointmentId ? (
                              <>
                                <i className="fas fa-spinner fa-spin"></i> Cancelling...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-times-circle"></i> Cancel
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                      ? "You don't have any past appointments."
                      : "You haven't booked any appointments yet."}
                </p>
                <Link to="/booking" className="book-now-btn">Book an Appointment Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {/* Replace ToastContainer with Toaster */}
      <Toaster position="bottom-right" richColors />
    </>
  );
};

export default AppointmentHistory;
