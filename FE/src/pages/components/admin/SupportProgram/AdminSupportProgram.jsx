import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Badge, Card, Container, Form, InputGroup, Row, Col, Pagination } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import './SupportProgram.css';

function AdminSupportProgram() {
  const navigate = useNavigate();
  const [supportPrograms, setSupportPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found in localStorage');
      setAuthError(true);
      setLoading(false);
      return;
    }
    
    fetchSupportPrograms();
  }, []);

  const fetchSupportPrograms = async () => {
    try {
      setLoading(true);
      const response = await SupportProgramService.getAllSupportPrograms();
      console.log('Processed response:', response);
      setSupportPrograms(response.result || response || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching support programs:', error);
      if (error?.response?.status === 401) {
        setAuthError(true);
        toast.error('Your session has expired. Please log in again.');
        setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/login');
        }, 3000);
      } else {
        toast.error('Failed to load support programs');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (programCode) => {
    if (window.confirm('Are you sure you want to delete this support program?')) {
      try {
        await SupportProgramService.deleteSupportProgram(programCode);
        toast.success('Support program deleted successfully');
        fetchSupportPrograms();
      } catch (error) {
        console.error('Error deleting support program:', error);
        toast.error('Failed to delete support program');
      }
    }
  };

  // Filter programs based on search and status
  const filteredPrograms = supportPrograms.filter(program => {
    const matchesSearch = 
      program.programCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      program.programName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && program.active) || 
      (filterStatus === 'inactive' && !program.active);
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);
  
  // Format dates for better readability
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authError) {
    return (
      <>
        <AdminHeader />
        <AdminSidebar />
        <div className="admin-content-container">
          <Container fluid className="content-wrapper">
            <Card className="card-container">
              <Card.Body className="p-5 text-center">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-4"></i>
                <h3 className="mb-4">Authentication Error</h3>
                <p className="text-muted mb-4">
                  You need to be logged in to access this page. If you were logged in, your session may have expired.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/login')}
                  className="btn-custom"
                >
                  <i className="fas fa-sign-in-alt me-2"></i> Go to Login
                </Button>
              </Card.Body>
            </Card>
          </Container>
          <ToastContainer />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content-container">
        <Container fluid className="content-wrapper">
          {/* Page Header */}
          <div className="page-header">
            <h2>Support Programs</h2>
            <p className="text-muted">Manage all health support programs and initiatives</p>
          </div>
          
          {/* Quick Stats Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="dashboard-card">
                <Card.Body className="text-center">
                  <i className="fas fa-clipboard-list fa-2x text-primary mb-3"></i>
                  <h5 className="card-title">Total Programs</h5>
                  <div className="number">{supportPrograms.length}</div>
                  <p className="text-muted mb-0">Available programs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="dashboard-card">
                <Card.Body className="text-center">
                  <i className="fas fa-toggle-on fa-2x text-success mb-3"></i>
                  <h5 className="card-title">Active</h5>
                  <div className="number">
                    {supportPrograms.filter(program => program.active).length}
                  </div>
                  <p className="text-muted mb-0">Current programs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="dashboard-card">
                <Card.Body className="text-center">
                  <i className="fas fa-toggle-off fa-2x text-danger mb-3"></i>
                  <h5 className="card-title">Inactive</h5>
                  <div className="number">
                    {supportPrograms.filter(program => !program.active).length}
                  </div>
                  <p className="text-muted mb-0">Disabled programs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="dashboard-card">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                  <Link to="/addsupport" className="btn btn-primary btn-custom w-100">
                    <i className="fas fa-plus me-2"></i> Add New Program
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Search and Filters */}
          <Card className="card-container mb-4">
            <Card.Body className="p-0">
              <div className="search-filter-row">
                <Row className="align-items-end">
                  <Col md={6} lg={5}>
                    <Form.Group>
                      <Form.Label className="form-label-bold">
                        <i className="fas fa-search me-2"></i>Search Programs
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} lg={3}>
                    <Form.Group>
                      <Form.Label className="form-label-bold">
                        <i className="fas fa-filter me-2"></i>Status
                      </Form.Label>
                      <Form.Select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-control-custom"
                      >
                        <option value="all">All Programs</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2} lg={4} className="text-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                      className="btn-custom"
                    >
                      <i className="fas fa-sync-alt me-2"></i> Reset Filters
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          
          {/* Data Table */}
          <Card className="card-container">
            <Card.Body className="card-body-padded">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner-border loading-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="loading-text">Loading support programs...</p>
                </div>
              ) : (
                <>
                  {supportPrograms && supportPrograms.length > 0 ? (
                    <>
                      <Table responsive hover className="table-custom">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPrograms.length > 0 ? (
                            currentPrograms.map((program) => (
                              <tr key={program.programCode}>
                                <td className="fw-bold">{program.programCode}</td>
                                <td>{program.programName}</td>
                                <td>
                                  {program.description && program.description.length > 50
                                    ? `${program.description.substring(0, 50)}...`
                                    : program.description}
                                </td>
                                <td>{formatDate(program.startDate)}</td>
                                <td>{formatDate(program.endDate)}</td>
                                <td>
                                  <Badge bg={program.active ? 'success' : 'danger'} className="badge-custom">
                                    {program.active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <Link to={`/viewsupport/${program.programCode}`} className="btn btn-info" title="View Details">
                                      <i className="fas fa-eye"></i>
                                    </Link>
                                    <Link to={`/editsupport/${program.programCode}`} className="btn btn-warning" title="Edit Program">
                                      <i className="fas fa-edit"></i>
                                    </Link>
                                    <Button
                                      variant="danger"
                                      title="Delete Program"
                                      onClick={() => handleDelete(program.programCode)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                <i className="fas fa-search fa-2x text-muted mb-3"></i>
                                <p className="mb-0">No programs match your search criteria</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <p className="mb-0 text-muted">
                          Showing {currentPrograms.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredPrograms.length)}` : "0"} of {filteredPrograms.length} programs
                        </p>
                        
                        {totalPages > 1 && (
                          <div className="d-flex justify-content-center">
                            <nav>
                              <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(1)}>
                                    <i className="bi bi-chevron-double-left"></i>
                                  </button>
                                </li>
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                  </button>
                                </li>
                                
                                {totalPages <= 5 ? (
                                  Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                      </button>
                                    </li>
                                  ))
                                ) : (
                                  <>
                                    {currentPage > 2 && (
                                      <li className="page-item">
                                        <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
                                      </li>
                                    )}
                                    
                                    {currentPage > 3 && (
                                      <li className="page-item disabled">
                                        <span className="page-link">...</span>
                                      </li>
                                    )}
                                    
                                    {currentPage > 1 && (
                                      <li className="page-item">
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                          {currentPage - 1}
                                        </button>
                                      </li>
                                    )}
                                    
                                    <li className="page-item active">
                                      <span className="page-link">{currentPage}</span>
                                    </li>
                                    
                                    {currentPage < totalPages && (
                                      <li className="page-item">
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                          {currentPage + 1}
                                        </button>
                                      </li>
                                    )}
                                    
                                    {currentPage < totalPages - 2 && (
                                      <li className="page-item disabled">
                                        <span className="page-link">...</span>
                                      </li>
                                    )}
                                    
                                    {currentPage < totalPages - 1 && (
                                      <li className="page-item">
                                        <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                                          {totalPages}
                                        </button>
                                      </li>
                                    )}
                                  </>
                                )}
                                
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                  </button>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                                    <i className="bi bi-chevron-double-right"></i>
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-clipboard-list fa-4x mb-4"></i>
                      <h3 className="mb-3">No Support Programs Found</h3>
                      <p>Get started by creating your first support program</p>
                      <Link to="/addsupport" className="btn btn-primary btn-custom">
                        <i className="fas fa-plus me-2"></i> Create New Program
                      </Link>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Container>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default AdminSupportProgram;
