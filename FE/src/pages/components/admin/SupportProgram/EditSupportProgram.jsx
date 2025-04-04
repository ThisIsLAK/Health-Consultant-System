import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import './SupportProgram.css';

function EditSupportProgram() {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    programCode: '',
    programName: '', // Using programName to match API structure
    description: '',
    startDate: '',
    endDate: '',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgramDetails();
  }, [programCode]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const response = await SupportProgramService.getSupportProgramByCode(programCode);
      const program = response.result || response;
      
      if (program) {
        // Format dates for input fields
        const formattedStartDate = program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '';
          
        setFormData({
          programCode: program.programCode || '',
          programName: program.programName || '', // Using programName to match API structure
          description: program.description || '',
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          active: program.active === undefined ? true : program.active
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching support program details:', error);
      toast.error('Failed to load support program details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.programName.trim()) {
      newErrors.programName = 'Program Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End Date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      await SupportProgramService.updateSupportProgram(programCode, formData);
      toast.success('Support program updated successfully');
      
      // Redirect after short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/adminsupport');
      }, 2000);
    } catch (error) {
      console.error('Error updating support program:', error);
      toast.error('Failed to update support program');
      setSubmitting(false);
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

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content-container">
        <Container fluid className="content-wrapper">
          <Card className="card-container">
            <Card.Header className="card-header-primary">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Edit Support Program</h2>
                <Button 
                  variant="light" 
                  className="btn-custom-sm"
                  onClick={() => navigate('/adminsupport')}
                >
                  <i className="fas fa-arrow-left me-1"></i> Back
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="card-body-padded">
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col lg={6} md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-bold">Program Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.programCode}
                        disabled
                        className="form-control-custom"
                      />
                      <Form.Text className="text-muted">
                        Program code cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col lg={6} md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-bold">Program Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="programName"
                        value={formData.programName}
                        onChange={handleChange}
                        isInvalid={!!errors.programName}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.programName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-bold">Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    style={{ resize: 'none' }}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3">
                  <Col lg={6} md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-bold">Start Date*</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        isInvalid={!!errors.startDate}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col lg={6} md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-bold">End Date*</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        isInvalid={!!errors.endDate}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="active"
                    name="active"
                    label="Program Active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="form-switch"
                  />
                  <Form.Text className="text-muted">
                    Inactive programs won't be visible to users
                  </Form.Text>
                </Form.Group>

                <div className="button-row">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/adminsupport')}
                    className="btn-custom"
                    disabled={submitting}
                  >
                    <i className="fas fa-times me-1"></i> Cancel
                  </Button>
                  <Button 
                    variant="primary"
                    type="submit" 
                    disabled={submitting}
                    className="btn-custom"
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i> Update Program
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default EditSupportProgram;
