import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { FaEye, FaUserFriends, FaSearch, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import AdminHeader from '../../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../../component/admin/AdminSiderbar';
import './AdminParentList.css';

const AdminParentList = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            setLoading(true);
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            // Make API call to fetch parents
            const response = await axios.get('http://localhost:8080/identity/admin/allparents', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && Array.isArray(response.data.result)) {
                setParents(response.data.result);
                setError(null);
            } else {
                setError('Failed to load parents data. Invalid response format.');
                setParents([]);
            }
        } catch (err) {
            console.error('Error fetching parents:', err);
            setError('An error occurred while fetching parents: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Filter parents based on search term
    const filteredParents = parents.filter(parent =>
        parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="psych-loading-container">
                <div className="psych-loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
                <p>Loading parents...</p>
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
                            <FaUserFriends className="page-icon" />
                            <h1>Parents Directory</h1>
                        </div>
                        <div className="page-actions">
                            <div className="refined-search">
                                <div className="search-input-group">
                                    <FaSearch className="search-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search parents..."
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
                                    <FaUserFriends className="stats-icon" />
                                </div>
                                <div className="stats-content">
                                    <h2 className="stats-number">{filteredParents.length}</h2>
                                    <p className="stats-label">Total Parents</p>
                                </div>
                            </div>
                            <div className="stats-footer">
                                <span className="stats-info">
                                    {searchTerm && filteredParents.length !== parents.length ?
                                        `Showing ${filteredParents.length} of ${parents.length} parents` :
                                        "All parents"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {filteredParents.length === 0 ? (
                        <div className="psych-empty">
                            <FaUserFriends className="psych-empty-icon" />
                            <h3>{searchTerm ? "No parents match your search" : "No parents found"}</h3>
                            <p>Try modifying your search criteria or check back later.</p>
                        </div>
                    ) : (
                        <div className="psych-grid">
                            {filteredParents.map((parent) => (
                                <div key={parent.id} className="psych-card">
                                    <div className="psych-card-header">
                                        <div className="psych-avatar">
                                            {parent.name ? parent.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                    <div className="psych-card-body">
                                        <h5 className="psych-name">{parent.name || 'N/A'}</h5>
                                        <p className="psych-email">{parent.email}</p>
                                    </div>
                                    <div className="psych-card-footer">
                                        <div className="button-group">
                                            <Link to={`/userdetail/${parent.email}`} className="psych-view-btn">
                                                <FaEye /> View Profile
                                            </Link>
                                            <Link
                                                to={`/admin/parents/appointments/${parent.id}`}
                                                state={{ parent: parent }}
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

export default AdminParentList;