import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from "axios";
import "./ProgramDetail.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import { FaArrowLeft, FaCalendarAlt, FaClipboardList, FaUserFriends } from 'react-icons/fa';

const ProgramDetail = () => {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  
  // Fetch user info and program details on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Fetch user info to get the email
        const response = await axios.get(`http://localhost:8080/identity/users/myInfo`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("User info response:", response.data);
        
        if (response.data && response.data.result) {
          setUserEmail(response.data.result.email);
        } else if (response.data && response.data.email) {
          setUserEmail(response.data.email);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    
    const fetchProgramDetails = async () => {
      if (!programCode) return;
      
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Use the correct endpoint for fetching program details
        const response = await axios.get(`http://localhost:8080/identity/users/findsupportprogrambycode/${programCode}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Program details response:", response.data);
        
        // Get the program from the response - handle both response formats
        if (response.data) {
          if (response.data.result) {
            setProgram(response.data.result);
          } else if (response.data.code === 1000 && response.data.data) {
            setProgram(response.data.data);
          } else {
            setProgram(response.data);
          }
          console.log("Processed program data:", response.data);
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
    
    fetchUserInfo();
    if (programCode) {
      fetchProgramDetails();
    }
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
      
      if (!userEmail) {
        throw new Error("User email is required for registration");
      }
      
      // Create registration request with the correct endpoint and body
      const response = await axios.post(
        `http://localhost:8080/identity/users/signupprogram`, 
        {
          programCode: programCode,
          email: userEmail // Use the email fetched from myInfo API
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Registration response:", response.data);
      
      if (response.data && response.data.code === 1000) {
        setRegistrationStatus({ loading: false, error: null, success: true });
        
        // Update the program data to reflect the new registration
        if (response.data.result) {
          setProgram(response.data.result);
        }
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
      <div className="program-page">
        <Navbar />
        <div className="program-container">
          <div className="loading-container">
            <Spinner animation="border" role="status" className="loading-spinner" />
            <p>Loading program details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="program-page">
        <Navbar />
        <div className="program-container">
          <div className="error-container">
            <h3>Program Not Found</h3>
            <p>{error || "Unable to load program details"}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/support")}
              className="mt-3"
            >
              Back to Programs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="program-page">
      <Navbar />
      <div className="program-container">
        <div className="program-hero">
          <Button 
            className="back-button-programdetail"
            onClick={() => navigate("/support")}
          >
            <FaArrowLeft /> Back to Programs
          </Button>
          
          <h1 className="program-title">{program?.programName || 'Program'}</h1>
          <p className="program-code">Program Code: {program?.programCode || 'Unknown'}</p>
        </div>
        
        <div className="program-content">
          <div className="program-section">
            <h3><FaClipboardList /> Description</h3>
            <p className="program-description">{program?.description || 'No description available'}</p>
          </div>
          
          <div className="program-section">
            <h3><FaCalendarAlt /> Program Timeline</h3>
            <div className="program-dates">
              <div className="date-card">
                <div className="date-label">Start Date</div>
                <div className="date-value">{formatDate(program?.startDate)}</div>
              </div>
              
              <div className="date-card">
                <div className="date-label">End Date</div>
                <div className="date-value">{formatDate(program?.endDate)}</div>
              </div>
              
              {program?.registeredUsers !== null && program?.registeredUsers !== undefined && (
                <div className="date-card">
                  <div className="date-label">Current Participants</div>
                  <div className="date-value participants">
                    <FaUserFriends /> {program.registeredUsers}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {registrationStatus && registrationStatus.success && (
            <div className="program-section">
              <Alert variant="success" className="alert alert-success">
                <h4 className="alert-heading">Registration Successful!</h4>
                <p>You have successfully registered for this program.</p>
              </Alert>
            </div>
          )}
          
          {registrationStatus && registrationStatus.error && (
            <div className="program-section">
              <Alert variant="danger" className="alert alert-danger">
                <h4 className="alert-heading">Registration Failed</h4>
                <p>{registrationStatus.error}</p>
              </Alert>
            </div>
          )}
          
          <div className="program-registration">
            <Button 
              variant="primary" 
              className="register-button"
              onClick={handleRegister}
              disabled={registrationStatus && (registrationStatus.loading || registrationStatus.success)}
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProgramDetail;