import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaInfoCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import "./ProgramDetail.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  
  // Form data for registration
  const [formData, setFormData] = useState({
    programCode: '',
    reason: '',
    additionalInfo: ''
  });
  
  // Fetch program details on component mount
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programId) return;
      
      try {
        setLoading(true);
        const response = await StudentSupportProgramService.getProgramByCode(programId);
        
        if (response.status === 200) {
          setProgram(response.data);
          setFormData(prev => ({ ...prev, programCode: programId }));
        } else {
          throw new Error(response.message || 'Failed to fetch program details');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching program details');
        console.error('Error fetching program details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramDetails();
  }, [programId]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setRegistering(true);
      
      // Get user email from localStorage or user context
      const userEmail = localStorage.getItem('userEmail') || '';
      
      const signupData = {
        ...formData,
        email: userEmail
      };
      
      const response = await StudentSupportProgramService.signupForProgram(signupData);
      
      if (response.status === 200) {
        setRegistered(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to register for program');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setRegistering(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
            </div>
            <div className="col-10">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="text-center">
                  <Spinner animation="border" role="status" variant="primary" />
                  <p className="mt-3">Loading program details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !program) {
    return (
      <>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <Sidebar />
            </div>
            <div className="col-10">
              <div className="container py-5">
                <Alert variant="danger">
                  {error || "Program not found"}
                </Alert>
                <Button variant="secondary" onClick={() => navigate("/support")}>
                  <FaArrowLeft className="me-2" /> Back to Programs
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="col-10">
            <div className="program-detail-container py-4">
              {/* Back button */}
              <Button
                variant="outline-secondary"
                className="mb-4"
                onClick={() => navigate("/support")}
              >
                <FaArrowLeft className="me-2" /> Back to Programs
              </Button>
              
              {/* Program Header */}
              <div className="program-header mb-4">
                <div className="program-header-content">
                  <span className="program-code">{program.programCode}</span>
                  <h1 className="program-title">{program.programName}</h1>
                  <div className="program-dates">
                    <span className="date-range">
                      <FaCalendarAlt className="me-2" />
                      {formatDate(program.startDate)} - {formatDate(program.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Program Content */}
              <div className="program-content">
                <div className="row">
                  <div className="col-md-8">
                    <div className="program-description-card">
                      <h3>About This Program</h3>
                      <p className="program-description">{program.description}</p>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="program-info-card">
                      <div className="program-info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div>
                          <h4>Start Date</h4>
                          <p>{formatDate(program.startDate)}</p>
                        </div>
                      </div>
                      
                      <div className="program-info-item">
                        <FaClock className="info-icon" />
                        <div>
                          <h4>End Date</h4>
                          <p>{formatDate(program.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="program-info-item">
                        <FaInfoCircle className="info-icon" />
                        <div>
                          <h4>Status</h4>
                          <p>{program.active ? "Active" : "Inactive"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Registration button */}
                    <div className="text-center mt-4">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="register-button"
                        onClick={() => setShowModal(true)}
                        disabled={!program.active}
                      >
                        Register for Program
                      </Button>
                      {!program.active && (
                        <p className="text-muted mt-2">
                          <FaInfoCircle className="me-1" />
                          This program is currently not active for registration
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Registration Modal */}
      <Modal show={showModal} onHide={() => !registering && setShowModal(false)} centered>
        <Modal.Header closeButton={!registering}>
          <Modal.Title>Register for {program.programName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registered ? (
            <div className="text-center py-4">
              <div className="success-icon-wrapper mb-3">
                <FaCheck className="success-icon" />
              </div>
              <h4>Registration Successful!</h4>
              <p>You have successfully registered for this program.</p>
              <p className="text-muted">You will receive further details via email.</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Why are you interested in this program?</Form.Label>
                <Form.Control
                  as="textarea"
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  placeholder="Please share your reasons for joining this program..."
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Additional Information (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="additionalInfo"
                  rows={2}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like us to know..."
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowModal(false)}
                  disabled={registering}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={registering}
                >
                  {registering ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProgramDetail;
