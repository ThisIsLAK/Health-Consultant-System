import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Badge, Spinner, Alert, Tabs, Tab, Table } from 'react-bootstrap';
import { 
  FaEdit, FaArrowLeft, FaSave, FaTimes, FaUser, 
  FaEnvelope, FaIdCard, FaHistory
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import ApiService from '../../../../service/ApiService';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';

const AdminUserDetail = () => {
    const { userEmail } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        // Decode the email from the URL as it might be encoded
        const decodedEmail = decodeURIComponent(userEmail);
        fetchUserDetails(decodedEmail);
    }, [userEmail]);

    const fetchUserDetails = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await ApiService.getUserByEmail(email);
            if (response.status === 200) {
                // Extract user from result if needed
                const userData = response.data.result || response.data;
                console.log("Processed user data:", userData);
                
                // Set up the correct active status based on server response
                const userWithStatus = {
                    ...userData,
                    active: userData.active !== undefined ? userData.active : true
                };
                
                setUser(userWithStatus);
                setEditedUser(userWithStatus);
            } else {
                setError(response.message || 'Failed to fetch user details');
                toast.error(response.message || 'Failed to fetch user details');
            }
        } catch (err) {
            const errorMsg = 'An unexpected error occurred loading user details';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error("Error details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Discard changes
            setEditedUser(user);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Use the email from the URL parameter
            const decodedEmail = decodeURIComponent(userEmail);
            
            // Make sure active status is properly set
            const userData = {
                ...editedUser,
                active: editedUser.active === true, // ensure it's a boolean
            };
            
            const response = await ApiService.updateUserByEmail(decodedEmail, userData);
            if (response.status === 200) {
                // Update the user state with the latest data
                setUser(userData);
                setIsEditing(false);
                toast.success('User updated successfully');
            } else {
                toast.error(response.message || 'Failed to update user');
            }
        } catch (err) {
            toast.error('An error occurred while saving changes');
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        if (!role) return 'secondary';
        
        // Check if role has roleName property
        const roleName = role.roleName ? 
            role.roleName.toUpperCase() : 
            (typeof role === 'string' ? role.toUpperCase() : 'UNKNOWN');
        
        switch (roleName) {
            case 'ADMIN': return 'danger';
            case 'PSYCHOLOGIST': return 'info';
            case 'MANAGER': return 'warning';
            case 'USER': 
            case 'STUDENT': return 'success';
            case 'PARENT': return 'primary';
            default: return 'secondary';
        }
    };
    
    const getRoleName = (role) => {
        if (!role) return 'Unknown';
        
        // Check if role has roleName property
        return role.roleName || 
               (typeof role === 'string' ? role : 'Unknown');
    };
    
    // Helper function to determine user status - with null handling
    const getUserStatus = (user) => {
        if (!user) return false;
        return user.active === true; // Ensure it's explicitly compared with true
    };

    // Format date string for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id="main" className="main">
                <PageTitle page="User Details" />

                <div className="user-detail-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => navigate('/adminuserlist')}
                            className="btn-sm-icon"
                        >
                            <FaArrowLeft className="me-2" /> Back to User List
                        </Button>
                        
                        {!isEditing ? (
                            <Button 
                                variant="primary" 
                                onClick={handleEditToggle}
                                className="btn-sm-icon"
                            >
                                <FaEdit className="me-2" /> Edit User
                            </Button>
                        ) : (
                            <div className="d-flex">
                                <Button 
                                    variant="success" 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-sm-icon me-2"
                                >
                                    {saving ? (
                                        <>
                                            <Spinner 
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Saving
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="me-2" /> Save
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleEditToggle}
                                    className="btn-sm-icon"
                                >
                                    <FaTimes className="me-2" /> Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center my-5 py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading user details...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="my-4">
                            <Alert.Heading>Error Loading User</Alert.Heading>
                            <p>{error}</p>
                            <div className="d-flex justify-content-end">
                                <Button
                                    onClick={() => fetchUserDetails(decodeURIComponent(userEmail))}
                                    variant="outline-danger"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </Alert>
                    ) : user ? (
                        isEditing ? (
                            // Edit Mode - Simplified
                            <Card className="shadow-sm">
                                <Card.Header as="h5" className="bg-primary text-white">
                                    <FaEdit className="me-2" /> Edit User
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-muted fw-bold">
                                                        <FaIdCard className="me-2" />User ID
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={editedUser.id || ''}
                                                        disabled
                                                        className="bg-light"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        User ID cannot be changed
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-muted fw-bold">
                                                        <FaEnvelope className="me-2" />Email
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={editedUser.email || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-muted fw-bold">
                                                        <FaUser className="me-2" />Name
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={editedUser.name || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>                                         
                                        </Row>
                                        
                                    </Form>
                                </Card.Body>
                                <Card.Footer className="bg-light d-flex justify-content-end">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleEditToggle}
                                        className="me-2"
                                    >
                                        <FaTimes className="me-1" /> Cancel
                                    </Button>
                                    <Button 
                                        variant="success" 
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-1" /> Save Changes
                                            </>
                                        )}
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ) : (
                            // View Mode - Redesigned layout
                            <Row>
                                <Col lg={12}>
                                    <Card className="shadow-sm mb-4">
                                        <Card.Body className="p-0">
                                            <Row className="g-0">
                                                <Col md={4} className="border-end p-4 text-center bg-light">
                                                    <div className="user-avatar my-4">
                                                        <div className="avatar-circle mx-auto" style={{ width: '120px', height: '120px', fontSize: '48px', lineHeight: '120px', backgroundColor: '#4e73df', color: 'white', borderRadius: '50%' }}>
                                                            {user.name ? user.name.charAt(0).toUpperCase() : 
                                                            (user.email ? user.email.charAt(0).toUpperCase() : '?')}
                                                        </div>
                                                    </div>
                                                    <h4 className="fw-bold mb-1">{user.name || 'No Name'}</h4>
                                                    <p className="text-muted mb-3">{user.email}</p>
                                                    <Badge bg={getRoleBadgeColor(user.role)} className="px-3 py-2 mb-3">
                                                        {getRoleName(user.role)}
                                                    </Badge>
                                                    <div className="user-status mt-3 mb-4">
                                                        <Badge bg={user.active ? 'success' : 'danger'} className="user-status-badge px-3 py-2">
                                                            {user.active ? 'Active Account' : 'Inactive Account'}
                                                        </Badge>
                                                    </div>
                                                    <div className="user-actions mt-4">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            className="w-100 mb-2"
                                                            onClick={handleEditToggle}
                                                        >
                                                            <FaEdit className="me-2" /> Edit Profile
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="p-4">
                                                        <h5 className="mb-4 border-bottom pb-2">User Details</h5>
                                                        <Table className="table-borderless">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="180" className="fw-bold">User ID</td>
                                                                    <td>
                                                                        <span className="text-muted">{user.id}</span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="fw-bold">Full Name</td>
                                                                    <td>{user.name || 'N/A'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="fw-bold">Email</td>
                                                                    <td>{user.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="fw-bold">Role</td>
                                                                    <td>
                                                                        <Badge bg={getRoleBadgeColor(user.role)}>
                                                                            {getRoleName(user.role)}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="fw-bold">Status</td>
                                                                    <td>
                                                                        <Badge bg={user.active ? 'success' : 'danger'}>
                                                                            {user.active ? 'Active' : 'Inactive'}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                        
                                                        {user.additionalInfo && (
                                                            <div className="mt-4">
                                                                <h5 className="mb-3 border-bottom pb-2">Additional Notes</h5>
                                                                <div className="bg-light p-3 rounded">
                                                                    <p className="mb-0">{user.additionalInfo}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )
                    ) : (
                        <Alert variant="warning" className="my-4">
                            <Alert.Heading>User Not Found</Alert.Heading>
                            <p>The user you're looking for doesn't exist or has been deleted.</p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button variant="outline-warning" onClick={() => navigate('/adminuserlist')}>
                                    Return to User List
                                </Button>
                            </div>
                        </Alert>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminUserDetail;
