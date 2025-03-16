import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApiService from '../../../../../service/ApiService';
import { FaEye, FaUserMd, FaSearch, FaUserAlt, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import './AdminPsychoList.css';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';

const AdminPsychoList = () => {
    const [psychologists, setPsychologists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPsychologists();
    }, []);

    const fetchPsychologists = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllUsers();

            if (response.status === 200) {
                // Filter users with PSYCHOLOGIST role based on the response schema
                const psychologistsList = response.data.filter(user =>
                    user.role && user.role.roleName === 'PSYCHOLOGIST'
                );
                setPsychologists(psychologistsList);
                setError(null);
            } else {
                setError(response.message || 'Failed to fetch psychologists');
            }
        } catch (err) {
            console.error('Error fetching psychologists:', err);
            setError('An error occurred while fetching psychologists');
        } finally {
            setLoading(false);
        }
    };

    // Filter psychologists based on search term
    const filteredPsychologists = psychologists.filter(psychologist =>
        psychologist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psychologist.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="psych-loading-container">
                <div className="psych-loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
                <p>Loading psychologists...</p>
            </div>
        );
    }

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <div className="psych-dashboard">
                    <div className="page-header">
                        <div className="page-title">
                            <FaUserMd className="page-icon" />
                            <h1>Psychologists Directory</h1>
                        </div>
                        <div className="page-actions">
                            <div className="refined-search">
                                <div className="search-input-group">
                                    <FaSearch className="search-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search psychologists..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input-field"
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="search-clear-btn"
                                            onClick={() => setSearchTerm('')}
                                            aria-label="Clear search"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <Alert variant="danger" className="psych-alert">{error}</Alert>}

                    <div className="stats-overview">
                        <div className="stats-card">
                            <div className="stats-card-inner">
                                <div className="stats-icon-area">
                                    <FaUserMd className="stats-icon" />
                                </div>
                                <div className="stats-content">
                                    <h2 className="stats-number">{filteredPsychologists.length}</h2>
                                    <p className="stats-label">Total Psychologists</p>
                                </div>
                            </div>
                            <div className="stats-footer">
                                <span className="stats-info">
                                    {searchTerm && filteredPsychologists.length !== psychologists.length ? 
                                        `Showing ${filteredPsychologists.length} of ${psychologists.length} psychologists` : 
                                        "All psychologists"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {filteredPsychologists.length === 0 ? (
                        <div className="psych-empty">
                            <FaUserMd className="psych-empty-icon" />
                            <h3>{searchTerm ? "No psychologists match your search" : "No psychologists found"}</h3>
                            <p>Try modifying your search criteria or check back later.</p>
                        </div>
                    ) : (
                        <div className="psych-grid">
                            {filteredPsychologists.map((psychologist) => (
                                <div key={psychologist.id} className="psych-card">
                                    <div className="psych-card-header">
                                        <div className="psych-avatar">
                                            {psychologist.name ? psychologist.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                    <div className="psych-card-body">
                                        <h5 className="psych-name">{psychologist.name || 'N/A'}</h5>
                                        <p className="psych-email">{psychologist.email}</p>
                                    </div>
                                    <div className="psych-card-footer">
                                        <div className="button-group">
                                            <Link to={`/userdetail/${psychologist.email}`} className="psych-view-btn">
                                                <FaEye /> View Profile
                                            </Link>
                                            <Link 
                                                to={`/admin/psychologists/appointments/${psychologist.id}`} 
                                                state={{ psychologist: psychologist }}
                                                className="psych-app-btn"
                                            >
                                                <FaCalendarAlt /> Appointments
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default AdminPsychoList;
