import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import './PsychologistBooking.css';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Get JWT payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};

const PsychologistBooking = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch psychologists from the API
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8080/identity/users/allpsy', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Psychologists data:", response.data);
        
        // Extract psychologists from response
        const psychologistsData = response.data.result || [];
        setPsychologists(psychologistsData);
        setFilteredPsychologists(psychologistsData);
      } catch (error) {
        console.error("Error fetching psychologists:", error);
        toast.error("Failed to load psychologists. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  // Filter psychologists based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPsychologists(psychologists);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = psychologists.filter(
        psych => {
          const name = psych.name ? psych.name.toLowerCase() : '';
          const email = psych.email ? psych.email.toLowerCase() : '';
          return name.includes(query) || email.includes(query);
        }
      );
      setFilteredPsychologists(filtered);
    }
  }, [searchQuery, psychologists]);

  // Update the generateTimeSlots function to use the specific time slots you requested

// Replace the current generateTimeSlots function with this:
const generateTimeSlots = () => {
  // Define the specific time slots as requested
  return [
    {
      id: 0,
      time: "7h-9h",
      value: "7h-9h"  // Changed from "08:00" to match the expected string format
    },
    {
      id: 1,
      time: "10h-12h",
      value: "10h-12h"  // Changed from "10:00" to match the expected string format
    },
    {
      id: 2,
      time: "13h-15h", 
      value: "13h-15h"  // Changed from "13:00" to match the expected string format
    },
    {
      id: 3,
      time: "15h-17h",
      value: "15h-17h"  // Changed from "15:00" to match the expected string format
    }
  ];
};

  const timeSlots = generateTimeSlots();

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ 
        day, 
        date,
        isToday: isToday(date),
        isPast: isPastDay(date)
      });
    }
    
    return days;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is in the past
  const isPastDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to previous or next month
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Select a date on the calendar
  const handleDateSelect = (date) => {
    if (!date || isPastDay(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Create a unique key for bookings based on date and psychologist
  const getBookingKey = (date, psychologistId) => {
    if (!date) return null;
    return `${date.toISOString().split('T')[0]}-${psychologistId}`;
  };

  // Check if a slot is booked
  const isSlotBooked = (date, psychologistId, slotId) => {
    const key = getBookingKey(date, psychologistId);
    return key && bookings[key] && bookings[key][slotId];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      console.log("Decoded token:", decoded);
      console.log("User ID (from issuer):", decoded.iss);
      
      // Store the userId in localStorage for easy access
      if (decoded.iss) {
        localStorage.setItem('userId', decoded.iss);
      }
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  // Book the selected appointment with exact field names matching the API
  const bookAppointment = async () => {
    if (!selectedDate || !selectedPsychologist || selectedSlot === null) {
      toast.error("Please select date, psychologist, and time slot");
      return;
    }
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("You need to be logged in to book an appointment");
        return;
      }
      
      // Extract userId from token instead of using localStorage directly
      const decoded = parseJwt(token);
      const userId = decoded?.iss;
      
      if (!userId) {
        toast.error("Could not determine user identity. Please log in again.");
        return;
      }
      
      console.log("Using userId:", userId);
      
      // Create a copy of the selected date to avoid time zone issues
      const appointmentDate = new Date(selectedDate);
      
      // Set the time to noon (12:00) to avoid timezone issues
      appointmentDate.setHours(12, 0, 0, 0);
      
      // Format the date for API - ISO string but preserve the selected date
      const formattedDate = appointmentDate.toISOString();
      
      console.log("Original selected date:", selectedDate);
      console.log("Formatted date for API:", formattedDate);
      
      // Create payload with correct formats
      const appointmentData = {
        userId: userId,
        psychologistId: selectedPsychologist.id,
        appointmentId: "", // Backend will generate this
        appointmentDate: formattedDate,
        timeSlot: timeSlots[selectedSlot].value, // Using our string format "7h-9h" etc
        active: true
      };
      
      console.log("Sending booking data:", appointmentData);
      
      // Make API request
      const response = await axios.post(
        'http://localhost:8080/identity/users/bookappointment',
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Booking response:", response.data);
      
      // Check if booking was successful
      if (response.data && response.data.code === 1000) {
        // Update local state to reflect booking        
        const bookingKey = getBookingKey(selectedDate, selectedPsychologist.id);
        const newBookings = { ...bookings };
        if (!newBookings[bookingKey]) {
          newBookings[bookingKey] = {};
        }
        newBookings[bookingKey][selectedSlot] = "Booked";
        setBookings(newBookings);
        
        // Show success message
        toast.success("Appointment booked successfully!");
        setShowConfirmation(true);
        
        // Hide confirmation after delay
        setTimeout(() => {
          setShowConfirmation(false);
          navigate('/appointments'); // Navigate to appointments list
        }, 3000);
      } else {
        toast.success( "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <p>Schedule a session with one of our professional psychologists</p>
        </div>
        
        <div className="booking-content">
          <div className="booking-grid">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} className="month-nav">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h2>{formatMonthYear(currentDate)}</h2>
                <button onClick={() => changeMonth(1)} className="month-nav">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="day-header">{day}</div>
                ))}
                
                {generateCalendarDays().map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => handleDateSelect(item.date)}
                    className={`calendar-day ${
                      !item.day ? 'empty' : 
                      item.isPast ? 'past' : 
                      item.isToday ? 'today' : 
                      selectedDate && item.date.getTime() === selectedDate.getTime() ? 'selected' : ''
                    }`}
                  >
                    {item.day}
                  </div>
                ))}
              </div>
              
              {selectedDate && (
                <div className="selected-date-info">
                  <p><i className="fas fa-calendar-check"></i> Selected date: {formatDate(selectedDate)}</p>
                </div>
              )}
            </div>
            
            {/* Psychologist Selection */}
            <div className="psychologist-section">
              <h2>Select a Psychologist</h2>
              
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search"></i>
              </div>
              
              <div className="psychologist-list">
                {loading ? (
                  <div className="loading">Loading psychologists...</div>
                ) : filteredPsychologists.length > 0 ? (
                  filteredPsychologists.map(psychologist => (
                    <div 
                      key={psychologist.id}
                      className={`psychologist-card ${selectedPsychologist?.id === psychologist.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPsychologist(psychologist)}
                    >
                      <div className="psychologist-avatar">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div className="psychologist-info">
                        <h3>{psychologist.name}</h3>
                        <p>{psychologist.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No psychologists found</div>
                )}
              </div>
            </div>
            
            {/* Time Slots & Booking */}
            <div className="booking-section">
              <h2>Complete Your Booking</h2>
              
              {selectedDate && selectedPsychologist ? (
                <>
                  <div className="booking-info">
                    <p><strong>Psychologist:</strong> {selectedPsychologist.name}</p>
                    <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                  </div>
                  
                  <div className="time-slots">
                    <h3>Select a Time Slot</h3>
                    <div className="slots-grid">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`time-slot ${
                            isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? 'booked' :
                            selectedSlot === slot.id ? 'selected' : ''
                          }`}
                          disabled={isSlotBooked(selectedDate, selectedPsychologist.id, slot.id)}
                        >
                          {slot.time}
                          {isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) && (
                            <span className="booked-label">Booked</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedSlot !== null && (
                    <div className="booking-form">
                      <h3>Complete Booking</h3>
                      <div className="booking-summary">
                        <p><strong>Summary:</strong> Appointment with {selectedPsychologist.name}</p>
                        <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                        <p><strong>Time:</strong> {timeSlots[selectedSlot].time}</p>
                      </div>
                      
                      <button 
                        className="submit-btn"
                        onClick={bookAppointment}
                        disabled={submitting}
                      >
                        {submitting ? 'Booking...' : 'Confirm Appointment'}
                      </button>
                      
                      <p className="booking-terms">
                        By booking this appointment, you agree to our cancellation policy. You can cancel or reschedule up to 24 hours before your appointment.
                      </p>
                    </div>
                  )}
                  
                  {showConfirmation && (
                    <div className="booking-confirmation">
                      <div className="confirmation-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h3>Appointment Booked!</h3>
                      <div className="confirmation-details">
                        <p><strong>Psychologist:</strong> {selectedPsychologist.name}</p>
                        <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                        <p><strong>Time:</strong> {timeSlots[selectedSlot].time}</p>
                      </div>
                      <p className="confirmation-redirect">
                        You will be redirected to your appointments page in a moment...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="booking-placeholder">
                  <div className="placeholder-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <p>
                    {!selectedDate 
                      ? 'Please select a date from the calendar' 
                      : 'Please select a psychologist to continue'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default PsychologistBooking;
