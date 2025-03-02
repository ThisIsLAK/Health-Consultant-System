import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaClock, FaUser, FaUserMd, FaMapMarkerAlt } from 'react-icons/fa';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  // If no appointment data, redirect to booking page
  if (!appointment) {
    return (
      <Container className="my-5 text-center">
        <Card>
          <Card.Body>
            <Card.Title>No appointment data found</Card.Title>
            <Card.Text>
              Sorry, we couldn't find any information about your booking.
            </Card.Text>
            <Button variant="primary" onClick={() => navigate('/psychologists')}>
              Book a new appointment
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Format the date properly
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h3 className="my-2">
                <FaCalendarCheck className="me-2" />
                Appointment Confirmed!
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <p className="lead">
                  Your appointment has been successfully scheduled. We have sent the details to your email.
                </p>
              </div>

              <Card className="mb-4">
                <Card.Header as="h5">Appointment Details</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col xs={1} className="text-center">
                      <FaCalendarCheck className="text-success" size={24} />
                    </Col>
                    <Col>
                      <strong>Date:</strong> {formatDate(appointment.date)}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={1} className="text-center">
                      <FaClock className="text-success" size={24} />
                    </Col>
                    <Col>
                      <strong>Time:</strong> {appointment.startTime}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={1} className="text-center">
                      <FaUserMd className="text-success" size={24} />
                    </Col>
                    <Col>
                      <strong>Psychologist:</strong> {appointment.psychologistName || 'Dr. ' + appointment.psychologistId}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={1} className="text-center">
                      <FaUser className="text-success" size={24} />
                    </Col>
                    <Col>
                      <strong>Patient:</strong> {appointment.userName || appointment.userId}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={1} className="text-center">
                      <FaMapMarkerAlt className="text-success" size={24} />
                    </Col>
                    <Col>
                      <strong>Duration:</strong> {appointment.duration} minutes
                    </Col>
                  </Row>

                  {appointment.notes && (
                    <Row className="mt-3">
                      <Col>
                        <Card.Subtitle>Notes</Card.Subtitle>
                        <div className="border p-2 mt-1 rounded bg-light">
                          {appointment.notes}
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>

              <div className="d-grid gap-2">
                <Button variant="success" onClick={() => navigate('/schedule')}>
                  View My Schedule
                </Button>
                <Button variant="outline-primary" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;
