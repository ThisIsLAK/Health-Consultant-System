import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./SupportProgram.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import LoginPrompt from '../../../components/LoginPrompt';

const SupportProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const programsPerPage = 9;

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      fetchSupportPrograms();
    } else {
      setLoading(false);
    }
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
      
      // Don't filter by active since the API already returns only active programs
      // and the active field is null in the response
      setPrograms(programsData);
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

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => {
    return program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           program.programCode.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate pagination
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);

  // Change page
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // If not authenticated, render the login prompt
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <LoginPrompt 
          featureName="support programs"
          title="Discover programs designed for your wellbeing"
          message="Our support programs are tailored to help you navigate life's challenges. Sign in to explore programs that match your needs."
          buttonText="Sign In to Explore"
        />
        <Footer />
      </>
    );
  }

  return (
    <div className="support-page">
      <Navbar/>
      <div className="support-hero">
        <div className="support-hero-content">
          <h1>Support Programs</h1>
          <p>Find the right mental health support program to help you navigate life's challenges</p>
          <div className="hero-search-container">
            <input
              type="text"
              placeholder="Search for programs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="hero-search-input"
            />
            <button className="hero-search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="support-main-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading programs...</p>
          </div>
        ) : (
          <>
            <div className="support-header-section">
              <h2>Our Support Services</h2>
              <p className="support-count">{filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} available</p>
            </div>
            
            {filteredPrograms.length === 0 ? (
              <div className="no-programs">
                <p>No support programs found matching your search. Please try a different keyword.</p>
              </div>
            ) : (
              <>
                <div className="program-grid">
                  {currentPrograms.map((program) => (
                    <div key={program.programCode} className="program-card">
                      <div className="program-card-header">
                        <h3>{program.programName}</h3>
                      </div>
                      <div className="program-card-body">
                        <p className="program-description">
                          {program.description && program.description.length > 120
                            ? `${program.description.substring(0, 120)}...`
                            : program.description || "No description available."}
                        </p>
                        <div className="program-meta">
                          <div className="meta-item">
                            <span className="meta-label">Start Date:</span>
                            <span className="meta-value">{formatDate(program.startDate)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">End Date:</span>
                            <span className="meta-value">{formatDate(program.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="program-card-footer">
                        <Link
                          to={`/support/${program.programCode}`}
                          className="view-program-btn"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredPrograms.length > programsPerPage && (
                  <div className="pagination-container-mui">
                    <div className="pagination-info">
                      Showing {currentPrograms.length > 0 ? `${indexOfFirstProgram + 1}-${Math.min(indexOfLastProgram, filteredPrograms.length)}` : "0"} of {filteredPrograms.length} programs
                    </div>
                    
                    <Stack spacing={2}>
                      <Pagination 
                        count={Math.ceil(filteredPrograms.length / programsPerPage)} 
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        className="mui-pagination"
                      />
                    </Stack>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default SupportProgram;