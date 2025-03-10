import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import './AppointmentHistory.css';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

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

  return (
    <>
      <Navbar />
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
                      <button className="reschedule-btn">
                        <i className="fas fa-calendar-alt"></i> Reschedule
                      </button>
                      <button className="cancel-btn">
                        <i className="fas fa-times-circle"></i> Cancel
                      </button>
                    </div>
                  )}
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
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default AppointmentHistory;
