import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import './PsychologistBooking.css';

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
  const [appointmentNote, setAppointmentNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch psychologists from the API
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8080/identity/psychologists/allpsy', {
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

  // Generate time slots (9AM to 5PM, 1-hour slots)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');
      slots.push({
        id: hour - 9,
        time: `${startHour}:00 - ${endHour}:00`,
        value: `${startHour}:00`
      });
    }
    return slots;
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

  // Book the selected appointment
  const bookAppointment = async () => {
    if (!selectedDate || !selectedPsychologist || selectedSlot === null) {
      toast.error("Please select date, psychologist, and time slot");
      return;
    }
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast.error("You need to be logged in to book an appointment");
        return;
      }
      
      // Format the date for the API
      const appointmentDate = new Date(selectedDate);
      const formattedDate = appointmentDate.toISOString();
      
      // Prepare the appointment data
      const appointmentData = {
        userId: userId,
        psychologistId: selectedPsychologist.id,
        appointmentDate: formattedDate,
        timeSlot: timeSlots[selectedSlot].value,
        notes: appointmentNote,
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
      if (response.data && response.data.code === 200) {
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
        
        // Reset form
        setAppointmentNote('');
        
        // Hide confirmation after delay
        setTimeout(() => {
          setShowConfirmation(false);
          navigate('/appointments'); // Navigate to appointments list
        }, 3000);
      } else {
        toast.error(response.data?.message || "Failed to book appointment");
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
                      <h3>Additional Information</h3>
                      <textarea
                        placeholder="Notes for your appointment (optional)"
                        value={appointmentNote}
                        onChange={(e) => setAppointmentNote(e.target.value)}
                        rows="3"
                      ></textarea>
                      
                      <button 
                        className="submit-btn"
                        onClick={bookAppointment}
                        disabled={submitting}
                      >
                        {submitting ? 'Booking...' : 'Book Appointment'}
                      </button>
                    </div>
                  )}
                  
                  {showConfirmation && (
                    <div className="booking-confirmation">
                      <div className="confirmation-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h3>Appointment Booked!</h3>
                      <p>Your appointment with {selectedPsychologist.name} on {formatDate(selectedDate)} at {timeSlots[selectedSlot].time} has been confirmed.</p>
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
