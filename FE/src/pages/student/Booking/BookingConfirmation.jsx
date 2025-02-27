import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get booking details from location state
  const { 
    program, 
    date, 
    slot, 
    programId, 
    isRescheduling, 
    appointmentId 
  } = location.state || {};

  // If no booking details, redirect back to support page
  if (!program || !date || !slot) {
    navigate("/support");
    return null;
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    
    // Simulate API call to create or reschedule booking
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // After 3 seconds, redirect to schedule page
      setTimeout(() => {
        navigate("/schedule");
      }, 3000);
    }, 1500);
  };

  return (
    <div>
      <Navbar />
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h1>{isRescheduling ? "Confirm Rescheduling" : "Confirm Your Booking"}</h1>
        </div>

        <div className="booking-steps">
          <div className="step">1. Select Date & Time</div>
          <div className="step active">2. Confirm Booking</div>
        </div>

        {isSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>{isRescheduling ? "Appointment Rescheduled!" : "Booking Confirmed!"}</h2>
            <p>
              {isRescheduling 
                ? "Your appointment has been successfully rescheduled. You will receive an updated confirmation email shortly."
                : "Your appointment has been successfully booked. You will receive a confirmation email shortly."
              }
            </p>
            <p>Redirecting to your schedule...</p>
          </div>
        ) : (
          <div className="confirmation-content">
            <div className="booking-summary">
              <h2>Booking Summary</h2>
              <div className="summary-item">
                <span className="label">Program:</span>
                <span className="value">{program.title}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(date)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Time Slot:</span>
                <span className="value">{slot.time}</span>
              </div>
              {isRescheduling && (
                <div className="rescheduling-note">
                  <p>You are rescheduling an existing appointment. Your previous appointment will be canceled.</p>
                </div>
              )}
            </div>

            <div className="confirmation-notes">
              <h3>Important Notes</h3>
              <ul>
                <li>Please arrive 10 minutes before your appointment time.</li>
                <li>If you need to cancel, please do so at least 24 hours in advance.</li>
                <li>You will receive a confirmation email with all details.</li>
              </ul>
            </div>

            <div className="confirmation-actions">
              <button
                className="back-button"
                onClick={() => navigate(`/booking/${programId}`, { 
                  state: isRescheduling ? { isRescheduling, appointmentId } : {} 
                })}
              >
                Back
              </button>
              <button
                className="confirm-button"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : isRescheduling ? "Confirm Reschedule" : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
