import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/adminheader';
import './SupportProgram.css';

function ViewSupportProgram() {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (window.confirm('Are you sure you want to delete this support program?')) {
      try {
        await SupportProgramService.deleteSupportProgram(programCode);
        toast.success('Support program deleted successfully');
        setTimeout(() => {
          navigate('/adminsupport');
        }, 1500);
      } catch (error) {
        console.error('Error deleting support program:', error);
        toast.error('Failed to delete support program');
      }
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <AdminSidebar />
        <div className="admin-content-container">
          <div className="content-wrapper p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading program details...</p>
            </div>
          </div>
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
          <div className="content-wrapper p-4">
            <Card className="card-container">
              <Card.Body className="p-5 text-center">
                <h3 className="mb-4">Program not found</h3>
                <p className="text-muted mb-4">
                  The support program you're looking for doesn't exist or has been removed.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/adminsupport')}
                >
                  Back to Programs List
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content-container">
        <div className="content-wrapper p-4">
          <Card className="card-container">
            <Card.Header className="card-header-primary">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Program Details</h2>
                <div>
                  <Button 
                    variant="light" 
                    className="me-2"
                    onClick={() => navigate('/adminsupport')}
                  >
                    <i className="fas fa-arrow-left me-1"></i> Back
                  </Button>
                  <Button 
                    variant="warning" 
                    className="me-2"
                    onClick={() => navigate(`/editsupport/${programCode}`)}
                  >
                    <i className="fas fa-edit me-1"></i> Edit
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={handleDelete}
                  >
                    <i className="fas fa-trash me-1"></i> Delete
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <h3 className="mb-3">{program.programName}</h3> {/* Use programName instead of name */}
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Program Code:</h5>
                  <p>{program.programCode}</p>
                </Col>
                <Col md={6}>
                  <h5>Program Type:</h5>
                  <p>{program.programType}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Start Date:</h5>
                  <p>{program.startDate}</p>
                </Col>
                <Col md={6}>
                  <h5>End Date:</h5>
                  <p>{program.endDate}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <h5>Description:</h5>
                  <p>{program.description}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <h5>Status:</h5>
                  <Badge bg={program.status === 'Active' ? 'success' : 'secondary'}>
                    {program.status}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ViewSupportProgram;
