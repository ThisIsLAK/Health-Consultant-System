import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { InputGroup, FormControl, Pagination } from 'react-bootstrap';
import "./SupportProgram.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const SupportProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 6;

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
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Our Support Services</h2>
            <div className="search-container" style={{ width: '50%' }}>
              <InputGroup>
                <FormControl
                  placeholder="Search programs by name, code or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          
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
            filteredPrograms && filteredPrograms.length > 0 ? (
              <>
                <div className="program-grid">
                  {currentPrograms.map((program) => (
                    <Link 
                      key={program.programCode} 
                      to={`/support/${program.programCode}`} 
                      className="program-card"
                    >
                      <h3>{program.programName}</h3>
                      <div className="program-code">
                        <span className="badge bg-light text-dark">Code: {program.programCode}</span>
                      </div>
                      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                      </div>
                      <span className="learn-more">Learn More →</span>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container mt-4 d-flex justify-content-center">
                    <Pagination>
                      <Pagination.First 
                        onClick={() => handlePageChange(1)} 
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                      />
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item 
                          key={index + 1} 
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      
                      <Pagination.Next 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last 
                        onClick={() => handlePageChange(totalPages)} 
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
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