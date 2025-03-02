import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { appointmentService } from "../../../services/appointmentService";
import "./AppointmentList.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import { toast } from "react-toastify";

const AppointmentList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // "upcoming", "past", "all"

  // Check if we just booked an appointment
  useEffect(() => {
    if (location.state?.bookingSuccess) {
      toast.success("Appointment successfully booked!");
    }
  }, [location.state]);

  // Get the current user ID from localStorage or context
  const userId = localStorage.getItem('userId') || 'user123'; // Default for demo

  // Fetch user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await appointmentService.getUserAppointments(userId);
        setAppointments(response.result || []);
      } catch (error) {
        toast.error("Failed to load appointments");
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        toast.success("Appointment cancelled successfully");
        
        // Remove the cancelled appointment from the list
        setAppointments(appointments.filter(app => app.id !== appointmentId));
      } catch (error) {
        toast.error("Failed to cancel appointment");
        console.error("Cancel error:", error);
      }
    }
  };

  const handleRescheduleAppointment = (appointment) => {
    // Navigate to booking page with reschedule flag and appointment details
    navigate(`/booking/${appointment.programType.toLowerCase().replace(/\s+/g, "-")}`, {
      state: {
        isRescheduling: true,
        appointmentId: appointment.id,
        psychologistId: appointment.psychologistId
      }
    });
  };

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    const now = new Date();
    
    if (filter === "upcoming") {
      return appointmentDate > now;
    } else if (filter === "past") {
      return appointmentDate < now;
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

  // Check if an appointment can be cancelled/rescheduled (more than 24h before start)
  const canModifyAppointment = (dateStr, timeStr) => {
    const appointmentDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);
    return appointmentDate > now && hoursDiff > 24;
  };

  return (
    <div>
      <Navbar />
      <div className="appointments-container">
        <div className="appointments-header">
          <h1>My Appointments</h1>
          <button 
            className="new-appointment-btn"
            onClick={() => navigate("/support")}
          >
            Book New Appointment
          </button>
        </div>

        <div className="filter-container">
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
          <div className="loading-message">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-appointments-message">
            <p>You don't have any {filter} appointments.</p>
            {filter !== "upcoming" && (
              <button 
                className="view-upcoming-btn"
                onClick={() => setFilter("upcoming")}
              >
                View Upcoming Appointments
              </button>
            )}
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
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
                    <span className="icon">👨‍⚕️</span>
                    <span>Psychologist ID: {appointment.psychologistId}</span>
                  </div>
                  {appointment.notes && (
                    <div className="detail notes">
                      <span className="icon">📝</span>
                      <span>{appointment.notes}</span>
                    </div>
                  )}
                </div>

                {canModifyAppointment(appointment.date, appointment.startTime) && (
                  <div className="appointment-actions">
                    <button 
                      className="reschedule-btn"
                      onClick={() => handleRescheduleAppointment(appointment)}
                    >
                      Reschedule
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentList;
