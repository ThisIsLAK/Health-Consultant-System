import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import axios from 'axios';
import { FaSearch, FaStar, FaFilter } from 'react-icons/fa';

const PsychologistList = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPsychologists();
  }, []);
  
  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      // API call to fetch psychologists
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/psychologists`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.result) {
        setPsychologists(response.data.result);
        
        // Extract unique specialties for the filter dropdown
        const uniqueSpecialties = [...new Set(
          response.data.result.flatMap(p => p.specialties || [])
        )];
        setSpecialties(uniqueSpecialties);
      } else {
        // If API returns empty data or unexpected format
        setError('No psychologists found. Please try again later.');
      }
    } catch (err) {
      setError('Failed to load psychologists. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (psychologistId) => {
    navigate(`/book-appointment/${psychologistId}`);
  };

  // Filter psychologists based on search term and selected specialty
  const filteredPsychologists = psychologists.filter(psychologist => {
    const matchesSearch = 
      psychologist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psychologist.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      !selectedSpecialty || 
      (psychologist.specialties && psychologist.specialties.includes(selectedSpecialty));
    
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <LoadingSpinner size="large" text="Loading psychologists..." />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Our Psychologists</h2>
      
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {filteredPsychologists.length === 0 ? (
        <Alert variant="info">No psychologists found matching your criteria.</Alert>
      ) : (
        <Row>
          {filteredPsychologists.map(psychologist => (
            <Col md={6} lg={4} key={psychologist.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div className="text-center pt-3">
                  <img
                    src={psychologist.imageUrl || "https://via.placeholder.com/150"}
                    alt={psychologist.name}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-center">{psychologist.name}</Card.Title>
                  <div className="text-center mb-2">
                    <span className="text-warning me-1">
                      <FaStar /> {psychologist.rating || "N/A"}
                    </span>
                    {psychologist.reviewCount && (
                      <span className="text-muted">
                        ({psychologist.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                  
                  <Card.Text>{psychologist.description || "No description available."}</Card.Text>
                  
                  <div className="mb-3">
                    <strong>Specialties:</strong>
                    <div>
                      {(psychologist.specialties || []).length > 0 ? (
                        psychologist.specialties.map((specialty, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">
                            {specialty}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No specialties listed</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Experience:</strong> {psychologist.experience || "N/A"} years
                  </div>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      onClick={() => handleBooking(psychologist.id)}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PsychologistList;
