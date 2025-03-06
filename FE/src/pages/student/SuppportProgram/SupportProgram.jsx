import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SupportProgram.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const SupportProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportPrograms();
  }, []);

  const fetchSupportPrograms = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Make API call with authentication
      const response = await axios.get('http://localhost:8080/identity/users/allsupportprogramsactive', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Support programs response:", response.data);
      
      // Get the programs from the response.result array
      const programsData = response.data.result || [];
      // Filter for active programs only
      const activePrograms = programsData.filter(program => program.active);
      setPrograms(activePrograms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching support programs:", error);
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Navbar/>
      <div className="support-container">
        <div className="support-header">
          <h1>Support Programs</h1>
          <p>Find the right mental health support program to help you navigate life's challenges.</p>
        </div>
        <div className="support-content">
          <h2>Our Support Services</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div 
                style={{ 
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  borderLeftColor: '#6200ea',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <p style={{ marginTop: '1rem' }}>Loading programs...</p>
            </div>
          ) : (
            programs && programs.length > 0 ? (
              <div className="program-grid">
                {programs.map((program) => (
                  <Link 
                    key={program.programCode} 
                    to={`/support/${program.programCode}`} 
                    className="program-card"
                  >
                    <h3>{program.programName}</h3>
                    {/* <p>{program.description && program.description.length > 100 
                      ? `${program.description.substring(0, 100)}...` 
                      : program.description}</p> */}
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                    </div>
                    <span className="learn-more">Learn More →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <p>No support programs available at the moment. Please check back later.</p>
              </div>
            )
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SupportProgram;