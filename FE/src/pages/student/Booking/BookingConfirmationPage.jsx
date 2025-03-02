import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmationPage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import { appointmentService } from "../../../services/appointmentService";
import { toast } from "react-toastify";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get booking details from navigation state
  const {
    program,
    date,
    formattedDate,
    slot,
    isRescheduling,
    appointmentId,
    userId,
    psychologistId
  } = location.state || {};

  // If no booking details are available, redirect to booking page
  if (!program || !date || !slot) {
    navigate("/support");
    return null;
  }

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);

      const appointmentData = {
        userId: userId,
        psychologistId: psychologistId,
        date: formattedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        notes: notes,
        programType: program.title
      };

      let response;
      
      if (isRescheduling) {
        // Cancel the old appointment
        await appointmentService.cancelAppointment(appointmentId);
        
        // Create a new appointment
        response = await appointmentService.bookAppointment(appointmentData);
        toast.success("Appointment rescheduled successfully!");
      } else {
        // Book a new appointment
        response = await appointmentService.bookAppointment(appointmentData);
        toast.success("Appointment booked successfully!");
      }

      // Navigate to appointments page
      navigate("/appointments", { 
        state: { 
          bookingSuccess: true,
          appointmentId: response.result?.id 
        }
      });
      
    } catch (error) {
      toast.error(`Failed to book appointment: ${error.message || "Unknown error"}`);
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div>
      <Navbar />
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h1>{isRescheduling ? "Reschedule Appointment" : "Book an Appointment"}</h1>
        </div>

        <div className="booking-steps">
          <div className="step completed">1. Select Date & Time</div>
          <div className="step active">2. Confirm Booking</div>
        </div>

        <div className="confirmation-content">
          <div className="booking-summary">
            <h2>Booking Summary</h2>
            <div className="summary-details">
              <div className="summary-item">
                <span className="label">Service:</span>
                <span className="value">{program.title}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(date)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Time:</span>
                <span className="value">{slot.time}</span>
              </div>
              {psychologistId && (
                <div className="summary-item">
                  <span className="label">Psychologist ID:</span>
                  <span className="value">{psychologistId}</span>
                </div>
              )}
            </div>
            
            <div className="notes-section">
              <h3>Additional Notes</h3>
              <textarea
                placeholder="Add any additional information or specific concerns you'd like to discuss during your appointment..."
                value={notes}
                onChange={handleNotesChange}
                rows={5}
              />
            </div>
          </div>
          
          <div className="booking-policies">
            <h2>Appointment Policies</h2>
            <div className="policy-list">
              <div className="policy-item">
                <h3>Cancellation Policy</h3>
                <p>You can cancel your appointment up to 24 hours before the scheduled time without any penalty.</p>
              </div>
              <div className="policy-item">
                <h3>Late Arrival</h3>
                <p>If you arrive more than 15 minutes late, we may need to reschedule your appointment.</p>
              </div>
              <div className="policy-item">
                <h3>No-Show Policy</h3>
                <p>If you miss an appointment without notifying us, it will be recorded as a no-show.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : isRescheduling ? "Confirm Reschedule" : "Confirm Booking"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
