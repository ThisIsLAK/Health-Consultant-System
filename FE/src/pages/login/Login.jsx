import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await ApiService.loginUser(formData);
            console.log("Login response:", response);
            
            if (response.status === 200) {
                console.log("Login successful, redirecting to home page");
                // Make sure we have the token in localStorage before redirecting
                if (!localStorage.getItem('token') && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                
                // Important: Add a small delay to make sure token is stored
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(); // Force reload to update UI
                }, 100);
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Keep your original CSS classes
    return (
        <div className="login-container">
            <h2>Login</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="btn-login"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <p className="register-link">
                    Don't have an account?{' '}
                    <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
