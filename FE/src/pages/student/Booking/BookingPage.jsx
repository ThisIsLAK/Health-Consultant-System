import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

// Mock data for program details - in production this would come from an API
const programDetails = {
  "one-on-one-counseling": {
    title: "One-on-One Counseling",
    description: "Schedule a session with a professional psychologist.",
  },
  "group-support": {
    title: "Group Support",
    description: "Join support groups to discuss mental health topics.",
  },
  "self-help-resources": {
    title: "Self-Help Resources",
    description: "Access blogs, e-books, and mindfulness exercises.",
  },
};

// Available time slots - each slot is 2 hours
const timeSlots = [
  { id: 1, time: "7:00 AM - 9:00 AM" },
  { id: 2, time: "9:00 AM - 11:00 AM" },
  { id: 3, time: "1:00 PM - 3:00 PM" },
  { id: 4, time: "3:00 PM - 5:00 PM" },
];

const BookingPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [calendarView, setCalendarView] = useState('month');
  const [viewDate, setViewDate] = useState(new Date());
  
  // Check if we're rescheduling an existing appointment
  const isRescheduling = location.state?.isRescheduling || false;
  const appointmentId = location.state?.appointmentId;

  const program = programDetails[programId];

  // Get tomorrow's date as the minimum bookable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Get maximum bookable date (3 weeks from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 21); // 3 weeks

  // Simulate fetching available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      // In a real application, this would be an API call to check availability
      // For demo purposes, we'll simulate some random availability
      const dayOfWeek = selectedDate.getDay();
      
      // Simulate weekend availability (no slots on weekends)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setAvailableSlots([]);
        return;
      }
      
      // Randomly make some slots unavailable
      const available = timeSlots.filter(() => Math.random() > 0.3);
      setAvailableSlots(available);
    }
  }, [selectedDate]);

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      // Navigate to confirmation page with booking details
      navigate("/booking-confirmation", { 
        state: { 
          program: program,
          date: selectedDate,
          slot: selectedSlot,
          programId: programId,
          isRescheduling: isRescheduling,
          appointmentId: appointmentId
        } 
      });
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };
  
  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };
  
  const toggleCalendarView = () => {
    setCalendarView(calendarView === 'month' ? 'week' : 'month');
  };

  if (!program) {
    navigate("/support");
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="booking-container">
        <div className="booking-header">
          <h1>{isRescheduling ? "Reschedule Appointment" : "Book an Appointment"}</h1>
          <p>for {program.title}</p>
        </div>

        <div className="booking-steps">
          <div className="step active">1. Select Date & Time</div>
          <div className="step">2. Confirm Booking</div>
        </div>

        <div className="calendar-controls">
          <button onClick={handlePrevMonth} className="calendar-nav-btn">
            &lt; Previous
          </button>
          <span className="calendar-current-month">
            {viewDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} className="calendar-nav-btn">
            Next &gt;
          </button>
          <button onClick={toggleCalendarView} className="view-toggle-btn">
            {calendarView === 'month' ? 'Week View' : 'Month View'}
          </button>
        </div>
        
        <div className="calendar-info">
          <div className="info-item">
            <div className="color-dot available"></div>
            <span>Available</span>
          </div>
          <div className="info-item">
            <div className="color-dot unavailable"></div>
            <span>Unavailable (Weekend/Past)</span>
          </div>
          <div className="info-item">
            <div className="color-dot selected"></div>
            <span>Selected Date</span>
          </div>
        </div>

        <div className="booking-content">
          <div className="calendar-container">
            <h2>Select a Date</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={tomorrow}
              maxDate={maxDate}
              className="calendar"
              tileDisabled={({ date }) => isWeekend(date)}
              view={calendarView}
              onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
              activeStartDate={viewDate}
              showNeighboringMonth={true}
            />
            <div className="date-range-info">
              <p>Available booking window: {tomorrow.toLocaleDateString()} - {maxDate.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="timeslots-container">
            <h2>Available Time Slots for {formatDate(selectedDate)}</h2>
            
            {availableSlots.length === 0 ? (
              <p className="no-slots-message">
                {isWeekend(selectedDate) 
                  ? "No appointments available on weekends." 
                  : "No slots available for this date. Please select another date."}
              </p>
            ) : (
              <div className="timeslots-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`slot-button ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => handleSelectSlot(slot)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
            
            <div className="booking-actions">
              <button 
                className="back-button"
                onClick={() => isRescheduling ? navigate("/schedule") : navigate(`/support/${programId}`)}
              >
                Back
              </button>
              <button
                className="continue-button"
                onClick={handleContinue}
                disabled={!selectedSlot}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
