import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import BookingService from '../../../services/BookingService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await BookingService.getUserAppointments(userId);
      if (response && response.result) {
        setAppointments(response.result);
      } else {
        // Handle empty response
        setAppointments([]);
      }
    } catch (err) {
      setError('Failed to load appointments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        setCancelingId(appointmentId);
        await BookingService.cancelAppointment(appointmentId);
        setAppointments(appointments.filter(app => app.id !== appointmentId));
        alert('Appointment cancelled successfully');
      } catch (err) {
        alert('Failed to cancel appointment: ' + (err.message || 'Unknown error'));
      } finally {
        setCancelingId(null);
      }
    }
  };

  const formatDateTime = (date, time) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return `${new Date(date).toLocaleDateString('en-US', options)} at ${time}`;
  };

  const getStatusBadge = (status) => {
    let variant;
    switch (status.toLowerCase()) {
      case 'scheduled':
        variant = 'primary';
        break;
      case 'completed':
        variant = 'success';
        break;
      case 'cancelled':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <LoadingSpinner size="large" text="Loading your appointments..." />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">My Appointments</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {appointments.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Appointments Found</Card.Title>
            <Card.Text>You currently don't have any scheduled appointments.</Card.Text>
            <Button variant="primary" onClick={() => navigate('/psychologists')}>
              Find a Psychologist
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {appointments.map(appointment => (
            <Col md={6} lg={4} key={appointment.id} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Appointment #{appointment.id.substring(0, 8)}</span>
                  {getStatusBadge(appointment.status)}
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {appointment.psychologistName || 'Dr. ' + appointment.psychologistId}
                  </Card.Title>
                  <Card.Text>
                    <strong>When:</strong> {formatDateTime(appointment.date, appointment.startTime)}
                    <br />
                    <strong>Duration:</strong> {appointment.duration} minutes
                    {appointment.notes && (
                      <>
                        <br />
                        <strong>Notes:</strong> {appointment.notes}
                      </>
                    )}
                  </Card.Text>
                  
                  {appointment.status.toLowerCase() === 'scheduled' && (
                    <Button 
                      variant="outline-danger" 
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancelingId === appointment.id}
                      className="w-100"
                    >
                      {cancelingId === appointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default UserAppointments;
