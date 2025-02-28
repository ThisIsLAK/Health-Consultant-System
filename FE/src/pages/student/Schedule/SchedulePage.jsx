import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SchedulePage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import CalendarView from "./CalendarView";

// Mock data for scheduled appointments - in production, this would come from an API
const mockAppointments = [
  {
    id: "appt-001",
    programId: "one-on-one-counseling",
    programTitle: "One-on-One Counseling",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    timeSlot: "9:00 AM - 11:00 AM",
    location: "Student Wellness Center, Room 204",
    counselor: "Dr. Sarah Johnson"
  },
  {
    id: "appt-002",
    programId: "group-support",
    programTitle: "Group Support",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    timeSlot: "1:00 PM - 3:00 PM",
    location: "Student Center, Conference Room B",
    counselor: "Dr. Michael Chen"
  },
  {
    id: "appt-003",
    programId: "one-on-one-counseling",
    programTitle: "One-on-One Counseling",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    timeSlot: "3:00 PM - 5:00 PM",
    location: "Student Wellness Center, Room 204",
    counselor: "Dr. Emily Rodriguez"
  }
];

const SchedulePage = () => {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch appointments
    setTimeout(() => {
      const now = new Date();
      
      // Sort appointments by date
      const sorted = [...mockAppointments].sort((a, b) => a.date - b.date);
      
      // Split into upcoming and past
      const upcoming = sorted.filter(appointment => appointment.date > now);
      const past = sorted.filter(appointment => appointment.date <= now);
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      // Simulate API call to cancel appointment
      setUpcomingAppointments(prev => 
        prev.filter(appointment => appointment.id !== appointmentId)
      );
      alert("Appointment cancelled successfully.");
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysDifference = (date) => {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const renderAppointments = (appointments) => {
    if (appointments.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>{activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments"}</h3>
          {activeTab === "upcoming" && (
            <p>You don't have any scheduled appointments. Would you like to book one?</p>
          )}
          {activeTab === "upcoming" && (
            <button className="book-now-btn" onClick={() => navigate("/support")}>
              Book an Appointment
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="appointment-date">
              <div className="date-badge">
                <span className="month">{appointment.date.toLocaleString('default', { month: 'short' })}</span>
                <span className="day">{appointment.date.getDate()}</span>
              </div>
              <span className="day-info">{getDaysDifference(appointment.date)}</span>
            </div>
            
            <div className="appointment-details">
              <h3>{appointment.programTitle}</h3>
              <p><strong>Time:</strong> {appointment.timeSlot}</p>
              <p><strong>Location:</strong> {appointment.location}</p>
              <p><strong>Counselor:</strong> {appointment.counselor}</p>
              <div className="appointment-meta">
                <span>{formatDate(appointment.date)}</span>
              </div>
            </div>
            
            {activeTab === "upcoming" && (
              <div className="appointment-actions">
                <button 
                  className="reschedule-btn" 
                  onClick={() => navigate(`/booking/${appointment.programId}`, { state: { isRescheduling: true, appointmentId: appointment.id } })}
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
    );
  };

  return (
    <div>
      <Navbar />
      <div className="schedule-container">
        <div className="schedule-header">
          <h1>My Appointments</h1>
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button 
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar View
              </button>
            </div>
            <button className="new-appointment-btn" onClick={() => navigate("/support")}>
              Book New Appointment
            </button>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <>
            <div className="schedule-tabs">
              <button 
                className={`tab ${activeTab === "upcoming" ? "active" : ""}`} 
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming
                {upcomingAppointments.length > 0 && (
                  <span className="badge">{upcomingAppointments.length}</span>
                )}
              </button>
              <button 
                className={`tab ${activeTab === "past" ? "active" : ""}`}
                onClick={() => setActiveTab("past")}
              >
                Past
                {pastAppointments.length > 0 && (
                  <span className="badge">{pastAppointments.length}</span>
                )}
              </button>
            </div>
            
            <div className="schedule-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loader"></div>
                  <p>Loading your appointments...</p>
                </div>
              ) : (
                renderAppointments(activeTab === "upcoming" ? upcomingAppointments : pastAppointments)
              )}
            </div>
          </>
        ) : (
          <div className="calendar-view-tab">
            <h2>Appointments Calendar</h2>
            <p className="calendar-hint">Click on a date with appointments to view details</p>
            {isLoading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading your calendar...</p>
              </div>
            ) : (
              <CalendarView appointments={[...upcomingAppointments, ...pastAppointments]} />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SchedulePage;
