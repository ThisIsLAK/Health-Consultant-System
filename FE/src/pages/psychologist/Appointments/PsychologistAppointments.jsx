import React, { useState, useEffect } from "react";
import { appointmentService } from "../../../services/appointmentService";
import "./PsychologistAppointments.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { toast } from "react-toastify";

const PsychologistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState("calendar"); // "calendar" or "list"
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get the psychologist ID from localStorage or context
  const psychologistId = localStorage.getItem('psychologistId') || 'psychologist123'; // Default for demo

  // Fetch psychologist's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await appointmentService.getPsychologistAppointments(psychologistId);
        setAppointments(response.result || []);
      } catch (error) {
        toast.error("Failed to load appointments");
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [psychologistId]);

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    const now = new Date();
    
    if (filter === "upcoming") {
      return appointmentDate > now;
    } else if (filter === "past") {
      return appointmentDate < now;
    } else if (filter === "today") {
      const today = new Date();
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    }
    return true; // "all" filter
  });

  // Format date string to readable format
  const formatDate = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = startTime.slice(0, 5);
    const end = endTime.slice(0, 5);
    return `${start} - ${end}`;
  };

  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  // Navigate to previous/next day/week/month in calendar view
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (direction === 'today') {
      newDate.setDate(new Date().getDate());
    }
    
    setCurrentDate(newDate);
  };

  // Group appointments by date for calendar view
  const getAppointmentsByDate = () => {
    const dateMap = {};
    
    filteredAppointments.forEach(appointment => {
      if (!dateMap[appointment.date]) {
        dateMap[appointment.date] = [];
      }
      dateMap[appointment.date].push(appointment);
    });
    
    return dateMap;
  };

  const groupedAppointments = getAppointmentsByDate();

  // Format date for the calendar header
  const formatCalendarDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Navbar />
      <div className="psychologist-appointments-container">
        <div className="psychologist-appointments-header">
          <h1>My Schedule</h1>
          <div className="view-toggle">
            <button
              className={`view-btn ${view === "calendar" ? "active" : ""}`}
              onClick={() => setView("calendar")}
            >
              Calendar View
            </button>
            <button
              className={`view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              List View
            </button>
          </div>
        </div>

        <div className="filter-container">
          <button 
            className={`filter-btn ${filter === "today" ? "active" : ""}`}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button 
            className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === "past" ? "active" : ""}`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Loading your schedule..." />
        ) : (
          <>
            {view === "list" ? (
              // List view
              filteredAppointments.length === 0 ? (
                <div className="no-appointments-message">
                  <p>You don't have any {filter} appointments.</p>
                </div>
              ) : (
                <div className="appointments-list">
                  {filteredAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="appointment-card"
                      onClick={() => handleViewAppointmentDetails(appointment)}
                    >
                      <div className="appointment-header">
                        <h2>{appointment.programType}</h2>
                        <span className={`status ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="appointment-details">
                        <div className="detail">
                          <span className="icon">📅</span>
                          <span>{formatDate(appointment.date, appointment.startTime)}</span>
                        </div>
                        <div className="detail">
                          <span className="icon">⏰</span>
                          <span>{formatDuration(appointment.startTime, appointment.endTime)}</span>
                        </div>
                        <div className="detail">
                          <span className="icon">👤</span>
                          <span>Patient ID: {appointment.userId}</span>
                        </div>
                      </div>
                      <div className="view-details-btn">View Details</div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Calendar view
              <div className="calendar-view">
                <div className="calendar-navigation">
                  <button onClick={() => navigateDate('prev')} className="nav-btn">
                    &lt; Previous
                  </button>
                  <h3>{formatCalendarDate(currentDate)}</h3>
                  <button onClick={() => navigateDate('next')} className="nav-btn">
                    Next &gt;
                  </button>
                  <button onClick={() => navigateDate('today')} className="today-btn">
                    Today
                  </button>
                </div>
                
                <div className="daily-schedule">
                  <div className="time-slots">
                    <div className="time-slot-header">Time</div>
                    {/* Time slots from 7AM to 5PM */}
                    {Array.from({ length: 11 }, (_, i) => {
                      const hour = i + 7;
                      return (
                        <div key={hour} className="time-slot">
                          {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="appointments-timeline">
                    <div className="timeline-header">Appointments</div>
                    <div className="timeline-slots">
                      {/* Each slot represents an hour block */}
                      {Array.from({ length: 11 }, (_, i) => {
                        const hour = i + 7;
                        // Format the currentDate to get YYYY-MM-DD
                        const formattedDate = currentDate.toISOString().split('T')[0];
                        // Find appointments that fall within this hour
                        const appointmentsInHour = 
                          (groupedAppointments[formattedDate] || [])
                            .filter(apt => {
                              const aptHour = parseInt(apt.startTime.split(':')[0]);
                              return aptHour === hour;
                            });
                        
                        return (
                          <div key={hour} className="timeline-slot">
                            {appointmentsInHour.length > 0 ? (
                              appointmentsInHour.map(apt => (
                                <div 
                                  key={apt.id} 
                                  className="timeline-appointment"
                                  onClick={() => handleViewAppointmentDetails(apt)}
                                >
                                  <p className="time">{formatDuration(apt.startTime, apt.endTime)}</p>
                                  <p className="program">{apt.programType}</p>
                                  <p className="patient">Patient: {apt.userId}</p>
                                </div>
                              ))
                            ) : (
                              <div className="empty-slot">No appointments</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Appointment details modal */}
      {selectedAppointment && (
        <div className="appointment-modal-backdrop">
          <div className="appointment-modal">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={closeAppointmentDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-detail">
                <span className="label">Program:</span>
                <span className="value">{selectedAppointment.programType}</span>
              </div>
              <div className="modal-detail">
                <span className="label">Status:</span>
                <span className={`value status ${selectedAppointment.status.toLowerCase()}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="modal-detail">
                <span className="label">Date:</span>
                <span className="value">
                  {formatDate(selectedAppointment.date, selectedAppointment.startTime)}
                </span>
              </div>
              <div className="modal-detail">
                <span className="label">Time:</span>
                <span className="value">
                  {formatDuration(selectedAppointment.startTime, selectedAppointment.endTime)}
                </span>
              </div>
              <div className="modal-detail">
                <span className="label">Patient ID:</span>
                <span className="value">{selectedAppointment.userId}</span>
              </div>
              {selectedAppointment.notes && (
                <div className="modal-detail notes">
                  <span className="label">Notes:</span>
                  <span className="value">{selectedAppointment.notes}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn close-modal" onClick={closeAppointmentDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PsychologistAppointments;
