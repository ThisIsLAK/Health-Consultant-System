import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, Container, Modal } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import './SupportProgram.css';

function ViewSupportProgram() {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProgramDetails();
  }, [programCode]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const response = await SupportProgramService.getSupportProgramByCode(programCode);
      setProgram(response.result || response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching support program details:', error);
      toast.error('Failed to load program details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await SupportProgramService.deleteSupportProgram(programCode);
      toast.success('Support program deleted successfully');
      setShowDeleteModal(false);
      setTimeout(() => {
        navigate('/adminsupport');
      }, 1500);
    } catch (error) {
      console.error('Error deleting support program:', error);
      toast.error('Failed to delete support program');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <AdminSidebar />
        <div className="admin-content-container">
          <Container fluid className="content-wrapper">
            <div className="loading-container">
              <div className="spinner-border loading-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading program details...</p>
            </div>
          </Container>
        </div>
      </>
    );
  }

  if (!program) {
    return (
      <>
        <AdminHeader />
        <AdminSidebar />
        <div className="admin-content-container">
          <Container fluid className="content-wrapper">
            <Card className="card-container">
              <Card.Body className="p-5 text-center">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h3 className="mb-4">Program not found</h3>
                <p className="text-muted mb-4">
                  The support program you're looking for doesn't exist or has been removed.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/adminsupport')}
                  className="btn-custom"
                >
                  <i className="fas fa-arrow-left me-1"></i> Back to Programs List
                </Button>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate program duration in days
  const calculateDuration = () => {
    if (!program || !program.startDate || !program.endDate) return null;
    
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Check if program is currently active based on dates
  const isProgramCurrentlyActive = () => {
    if (!program || !program.startDate || !program.endDate) return false;
    
    const today = new Date();
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    
    return today >= start && today <= end;
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content-container">
        <Container fluid className="content-wrapper">
          {/* Action Buttons Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button 
              variant="outline-secondary" 
              className="btn-custom-sm"
              onClick={() => navigate('/adminsupport')}
            >
              <i className="fas fa-arrow-left me-2"></i> Back to Programs
            </Button>
            <div>
              <Button 
                variant="warning" 
                className="btn-custom-sm me-2"
                onClick={() => navigate(`/editsupport/${programCode}`)}
              >
                <i className="fas fa-edit me-2"></i> Edit Program
              </Button>
              <Button 
                variant="danger"
                className="btn-custom-sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <i className="fas fa-trash me-2"></i> Delete Program
              </Button>
            </div>
          </div>
          
          {/* Program Main Info Card */}
          <Card className="card-container mb-4">
            <Card.Body className="card-body-padded">
              <Row>
                <Col md={9}>
                  <h2 className="mb-2">{program.programName}</h2>
                  <div className="d-flex align-items-center mb-4">
                    <Badge bg={program.active ? 'success' : 'danger'} className="badge-custom me-3">
                      {program.active ? 'Active' : 'Inactive'}
                    </Badge>
                    {isProgramCurrentlyActive() && (
                      <Badge bg="primary" className="badge-custom">
                        Currently Running
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted mb-0">
                    <strong>Program Code:</strong> {program.programCode}
                  </p>
                  <p className="text-muted">
                    <strong>Program Type:</strong> {program.programType || 'General'}
                  </p>
                </Col>
                <Col md={3} className="text-center text-md-end">
                  <div className="p-3 border rounded-circle d-inline-flex justify-content-center align-items-center" style={{width: '120px', height: '120px'}}>
                    <div>
                      <div className="h2 mb-0 fw-bold text-primary">{calculateDuration()}</div>
                      <div className="small text-muted">Days Duration</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Program Details Cards */}
          <Row>
            <Col lg={8}>
              {/* Description Card */}
              <Card className="card-container mb-4">
                <Card.Header className="card-header-primary">
                  <h4 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i> Program Description
                  </h4>
                </Card.Header>
                <Card.Body className="card-body-padded">
                  <div className="description-box">
                    {program.description}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              {/* Timeline Card */}
              <Card className="card-container mb-4">
                <Card.Header className="card-header-primary">
                  <h4 className="mb-0">
                    <i className="fas fa-calendar-alt me-2"></i> Program Timeline
                  </h4>
                </Card.Header>
                <Card.Body className="card-body-padded">
                  <div className="timeline-container">
                    <div className="timeline-item">
                      <div className="timeline-date">Start Date</div>
                      <div className="timeline-text">{formatDate(program.startDate)}</div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-date">End Date</div>
                      <div className="timeline-text">{formatDate(program.endDate)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top">
                    <h5 className="mb-3">Program Status</h5>
                    <div className="d-flex align-items-center mb-2">
                      <div className={`status-indicator ${program.active ? 'status-active' : 'status-inactive'}`}></div>
                      <span className="ms-2">{program.active ? 'Program is active' : 'Program is inactive'}</span>
                    </div>
                    <p className="text-muted small mb-0">
                      {program.active 
                        ? 'This program is enabled and visible to users' 
                        : 'This program is disabled and hidden from users'}
                    </p>
                  </div>
                </Card.Body>
              </Card>
              
              {/* Actions Card */}
              <Card className="card-container">
                <Card.Header className="card-header-primary">
                  <h4 className="mb-0">
                    <i className="fas fa-cog me-2"></i> Actions
                  </h4>
                </Card.Header>
                <Card.Body className="card-body-padded">
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className="btn-custom"
                      onClick={() => navigate(`/editsupport/${programCode}`)}
                    >
                      <i className="fas fa-edit me-2"></i> Edit Program
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      className="btn-custom"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="fas fa-trash me-2"></i> Delete Program
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        
        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="confirmation-modal">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-4">
              <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
              <h4>Are you sure?</h4>
              <p className="text-muted">
                You are about to delete the support program "{program?.programName}". 
                This action cannot be undone.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete Program
            </Button>
          </Modal.Footer>
        </Modal>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default ViewSupportProgram;
