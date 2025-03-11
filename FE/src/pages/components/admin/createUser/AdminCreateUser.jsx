import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { FaUserPlus, FaCheck } from 'react-icons/fa';
import './AdminCreateUser.css';
import AdminHeader from '../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import PageTitle from '../../../../component/admin/PageTitle';
import ApiService from '../../../../service/ApiService';

const AdminCreateUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form data with name field added
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: '2', // Default role: STUDENT (roleId = 2)
    });

    // Available role options with IDs matching backend
    const roleOptions = [
        { id: '2', name: 'Student' },
        { id: '4', name: 'Psychologist' },
        { id: '3', name: 'Manager' },
        { id: '1', name: 'Admin' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Name, email, and password are required.');
            return false;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 8 characters long.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Build the request payload with name field included
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                roleId: formData.roleId
            };

            // Use ApiService to create the user with the correct endpoint
            const response = await ApiService.createUserByAdmin(payload);

            if (response.status === 200) {
                console.log('User created successfully:', response.data);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/adminuserlist');
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to create user');
            }
        } catch (err) {
            console.error('Error creating user:', err);

            let errorMessage = 'An error occurred while creating the user.';
            if (err.response) {
                if (err.response.status === 400 && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.status === 409) {
                    errorMessage = 'Email already exists.';
                } else if (err.response.status === 403) {
                    errorMessage = 'You do not have permission to create users.';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id="main" className="main">
                <PageTitle page="Create User" />

                <Card className="create-user-card">
                    <Card.Header as="h4" className="text-center">
                        <FaUserPlus className="me-2" /> Create New User
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="spinner-container">
                                <LoadingSpinner text="Creating user..." size="large" />
                            </div>
                        ) : success ? (
                            <div className="success-message">
                                <FaCheck className="success-icon" />
                                <h4>User Created Successfully!</h4>
                                <p>Redirecting to user list...</p>
                            </div>
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

                                <div className="form-section">
                                    <h5 className="form-section-title">User Information</h5>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="required-field">Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter user's full name"
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="required-field">Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="example@email.com"
                                        />
                                        <Form.Text className="text-muted">
                                            This will be used as the username for login
                                        </Form.Text>
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required-field">Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Create password"
                                                />
                                                <Form.Text className="text-muted">
                                                    Must be at least 8 characters
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required-field">Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Confirm password"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="form-section">
                                    <h5 className="form-section-title">Account Settings</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="required-field">User Role</Form.Label>
                                        <Form.Select
                                            name="roleId"
                                            value={formData.roleId}
                                            onChange={handleChange}
                                            required
                                        >
                                            {roleOptions.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                
                                <div className="form-buttons d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                        className="create-btn"
                                    >
                                        Create User
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/adminuserlist')}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </main>
        </div>
    );
};

export default AdminCreateUser;
