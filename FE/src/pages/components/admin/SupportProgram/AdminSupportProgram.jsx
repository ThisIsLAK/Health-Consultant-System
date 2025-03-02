import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Badge, Card } from 'react-bootstrap';
import SupportProgramService from '../../../../services/SupportProgramService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/adminheader';
import './SupportProgram.css';

function AdminSupportProgram() {
  const navigate = useNavigate();
  const [supportPrograms, setSupportPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

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

  if (authError) {
    return (
      <>
        <AdminHeader />
        <AdminSidebar />
        <div className="admin-content-container">
          <div className="content-wrapper p-4">
            <Card className="card-container">
              <Card.Body className="p-5 text-center">
                <h3 className="mb-4">Authentication Error</h3>
                <p className="text-muted mb-4">
                  You need to be logged in to access this page. If you were logged in, your session may have expired.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
        <ToastContainer />
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
                <h2 className="mb-0">Support Programs</h2>
                <Link to="/addsupport">
                  <Button variant="success" className="btn-custom">
                    <i className="fas fa-plus me-2"></i> Add New Program
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body className="card-body-padded">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="ms-3 mb-0">Loading support programs...</p>
                </div>
              ) : (
                <>
                  {supportPrograms && supportPrograms.length > 0 ? (
                    <Table responsive hover className="table-custom">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supportPrograms.map((program) => (
                          <tr key={program.programCode}>
                            <td>{program.programCode}</td>
                            <td>{program.programName}</td> {/* Using programName to match API structure */}
                            <td>
                              {program.description && program.description.length > 50
                                ? `${program.description.substring(0, 50)}...`
                                : program.description}
                            </td>
                            <td>{new Date(program.startDate).toLocaleDateString()}</td>
                            <td>{new Date(program.endDate).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={program.active ? 'success' : 'danger'}>
                                {program.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`/viewsupport/${program.programCode}`} className="btn btn-sm btn-info">
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <Link to={`/editsupport/${program.programCode}`} className="btn btn-sm btn-warning">
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(program.programCode)}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-5">
                      <p className="mb-3">No support programs found</p>
                      <Link to="/addsupport" className="btn btn-primary btn-custom">
                        Create New Program
                      </Link>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default AdminSupportProgram;
