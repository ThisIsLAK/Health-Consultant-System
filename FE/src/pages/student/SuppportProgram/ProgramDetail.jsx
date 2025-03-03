import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from "axios";
import "./ProgramDetail.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const ProgramDetail = () => {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  
  // Fetch program details on component mount
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programCode) return;
      
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Make API call with authentication
        const response = await axios.get(`http://localhost:8080/users/findsupportprogrambycode/${programCode}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Program details response:", response.data);
        
        // Get the program from the response
        if (response.data && response.data.result) {
          setProgram(response.data.result);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching program details');
        console.error('Error fetching program details:', err);
        setLoading(false);
      }
    };
    
    fetchProgramDetails();
  }, [programCode]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle register button click
  const handleRegister = async () => {
    try {
      setRegistrationStatus({ loading: true, error: null, success: false });
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create registration request
      const response = await axios.post(`http://localhost:8080/users/registersupportprogram`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Registration response:", response.data);
      
      if (response.data && response.data.code === 200) {
        setRegistrationStatus({ loading: false, error: null, success: true });
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegistrationStatus({ 
        loading: false, 
        error: err.response?.data?.message || err.message || "Failed to register", 
        success: false 
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="program-detail-container">
          <div className="loading-container">
            <Spinner animation="border" role="status" />
            <p>Loading program details...</p>
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
        <div className="program-detail-container">
          <div className="error-container">
            <h3>Program Not Found</h3>
            <p>{error || "Unable to load program details"}</p>
            <Button variant="primary" onClick={() => navigate("/support")}>
              Back to Programs
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="program-detail-container">
        <div className="program-header">
          <Button 
            variant="outline-primary" 
            className="back-button"
            onClick={() => navigate("/support")}
          >
            ← Back to Programs
          </Button>
          
          <h1 className="program-title">{program.programName}</h1>
          <p className="program-code">Program Code: {program.programCode}</p>
        </div>
        
        <div className="program-body">
          <div className="program-section">
            <h3>Description</h3>
            <p className="program-description">{program.description}</p>
          </div>
          
          <div className="program-section">
            <h3>Program Timeline</h3>
            <div className="program-dates">
              <p><strong>Start Date:</strong> {formatDate(program.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(program.endDate)}</p>
              <p><strong>Current Participants:</strong> {program.registeredUsers || 0}</p>
            </div>
          </div>
          
          {registrationStatus && registrationStatus.success && (
            <Alert variant="success" className="mt-3">
              <Alert.Heading>Registration Successful!</Alert.Heading>
              <p>You have successfully registered for this program.</p>
            </Alert>
          )}
          
          {registrationStatus && registrationStatus.error && (
            <Alert variant="danger" className="mt-3">
              <Alert.Heading>Registration Failed</Alert.Heading>
              <p>{registrationStatus.error}</p>
            </Alert>
          )}
          
          <div className="program-registration">
            <Button 
              variant="primary" 
              size="lg" 
              className="register-button"
              onClick={handleRegister}
              disabled={!program.active || (registrationStatus && (registrationStatus.loading || registrationStatus.success))}
            >
              {registrationStatus && registrationStatus.loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registering...
                </>
              ) : registrationStatus && registrationStatus.success ? (
                "Registered Successfully"
              ) : (
                "Register for Program"
              )}
            </Button>
            
            {!program.active && (
              <p className="inactive-message">
                This program is currently not active for registration
              </p>
            )}
          </div>
          
          {program.participants && program.participants.length > 0 && (
            <div className="program-section">
              <h3>Participants</h3>
              <p>Total registered users: {program.registeredUsers || program.participants.length}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProgramDetail;
