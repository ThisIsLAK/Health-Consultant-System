import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

const CalendarView = ({ appointments }) => {
  const [viewDate, setViewDate] = useState(new Date());

  // Group appointments by date for easier lookup
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const dateStr = appointment.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(appointment);
    return acc;
  }, {});

  // Format time slot for display
  const formatTimeSlot = (timeSlot) => {
    return timeSlot;
  };

  const tileContent = ({ date, view }) => {
    const dateStr = date.toDateString();
    const dateAppointments = appointmentsByDate[dateStr] || [];

    if (view === 'month' && dateAppointments.length > 0) {
      return (
        <div className="calendar-appointment-indicator">
          {dateAppointments.map((appointment, index) => (
            <div 
              key={index} 
              className="appointment-dot"
              title={`${appointment.programTitle} - ${formatTimeSlot(appointment.timeSlot)}`}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const handleClickDay = (date) => {
    const dateStr = date.toDateString();
    const dateAppointments = appointmentsByDate[dateStr] || [];
    
    if (dateAppointments.length > 0) {
      // When there are appointments on this day, show them in detail
      setSelectedDate(date);
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="calendar-view-container">
      <div className="calendar-wrapper">
        <Calendar
          onChange={(date) => handleClickDay(date)}
          value={viewDate}
          onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
          tileContent={tileContent}
          className="appointments-calendar"
        />
      </div>

      {selectedDate && (
        <div className="selected-date-appointments">
          <h3>Appointments on {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          
          <div className="day-appointments-list">
            {appointmentsByDate[selectedDate.toDateString()]?.map((appointment, index) => (
              <div key={index} className="day-appointment-item">
                <div className="time-indicator">{appointment.timeSlot}</div>
                <div className="appointment-info">
                  <h4>{appointment.programTitle}</h4>
                  <p><strong>Counselor:</strong> {appointment.counselor}</p>
                  <p><strong>Location:</strong> {appointment.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="close-selected-btn" onClick={() => setSelectedDate(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
