import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import BookingService from '../../../services/BookingService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { psychologistId } = useParams();
  const userId = localStorage.getItem('userId'); // Assume you store userId in localStorage

  const [formData, setFormData] = useState({
    userId: userId,
    psychologistId: psychologistId,
    date: '',
    startTime: '',
    duration: 120, // Default duration in minutes (2 hours)
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Updated time slots according to the specified timeline
  const [timeSlots] = useState([
    { start: '07:00', end: '09:00', label: '7:00 AM - 9:00 AM' },
    { start: '09:00', end: '11:00', label: '9:00 AM - 11:00 AM' },
    { start: '13:00', end: '15:00', label: '1:00 PM - 3:00 PM' },
    { start: '15:00', end: '17:00', label: '3:00 PM - 5:00 PM' }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await BookingService.bookAppointment(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/booking-confirmation', { 
          state: { appointment: response.result }
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates in the date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4" className="text-center bg-primary text-white">
              Book an Appointment
            </Card.Header>
            <Card.Body>
              {loading && <LoadingSpinner text="Processing your booking..." />}
              
              {error && !loading && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              {success && !loading && (
                <Alert variant="success">
                  Appointment booked successfully! Redirecting to confirmation page...
                </Alert>
              )}
              
              {!loading && !success && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Time Slot (2-hour session)</Form.Label>
                    <Form.Select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(slot => (
                        <option key={slot.start} value={slot.start}>
                          {slot.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Each appointment slot is a 2-hour session.
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Notes (optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any specific concerns or topics you'd like to discuss..."
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button variant="primary" type="submit" size="lg">
                      Book Appointment
                    </Button>
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
