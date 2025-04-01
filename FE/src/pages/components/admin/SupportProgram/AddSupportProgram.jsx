import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import './SupportProgram.css';

function AddSupportProgram() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programCode: '',
    programName: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

    if (!formData.programCode.trim()) {
      newErrors.programCode = 'Program Code is required';
    }

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
      console.log("Sending data to API:", formData);
      const response = await SupportProgramService.createSupportProgram(formData);
      console.log("API response:", response);

      toast.success('Support program created successfully');

      setTimeout(() => {
        navigate('/adminsupport');
      }, 2000);
    } catch (error) {
      console.error('Error creating support program:', error);

      // Show more specific error message
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Failed to create support program');
      }

      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content-container">
        <Container fluid className="content-wrapper">
          <div className="back-link-container">
            <Button
              variant="link"
              className="back-link"
              onClick={() => navigate('/adminsupport')}
            >
              <i className="fas fa-arrow-left"></i> Back
            </Button>
          </div>
          <Card className="card-container">
            <Card.Header className="card-header-primary">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Add New Support Program</h2>
              </div>
            </Card.Header>
            <Card.Body className="card-body-padded">
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col lg={6} md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-bold">Program Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="programCode"
                        value={formData.programCode}
                        onChange={handleChange}
                        isInvalid={!!errors.programCode}
                        placeholder="Enter a unique code (e.g. SP0001)"
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.programCode}
                      </Form.Control.Feedback>
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
                        placeholder="Enter program name"
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
                    placeholder="Enter program description"
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i> Create Program
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

export default AddSupportProgram;
