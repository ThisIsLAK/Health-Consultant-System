import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PsySupportProgram.css';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';

const PsySupportProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/identity/psychologists/allsupportprograms', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Access the result array from the response data
                if (response.data && response.data.result && Array.isArray(response.data.result)) {
                    setPrograms(response.data.result);
                    //log out the response data
                    console.log(response.data.result);
                } else {
                    // If the response structure doesn't match expected format, set empty array
                    console.error("Unexpected response format:", response.data);
                    setPrograms([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching support programs:", err);
                setError("Failed to load support programs. Please try again later.");
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const isProgramActive = (active) => {
        return active === true;
    };

    return (
        <>
        <PsychologistHeader/>
        <PsychologistSidebar/>
            <div className="psy-support-container">
                <div className="psy-support-header">
                    <h2>Support Programs</h2>
                </div>

                {loading ? (
                    <div className="psy-loading">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading programs...</p>
                    </div>
                ) : error ? (
                    <div className="psy-error-message">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <p>{error}</p>
                    </div>
                ) : programs.length === 0 ? (
                    <div className="psy-no-programs">
                        <i className="bi bi-file-earmark-x"></i>
                        <p>No support programs found</p>
                    </div>
                ) : (
                    <div className="psy-program-list">
                        {programs
                            .filter(program => program.active !== false) // Only show programs where active is not false
                            .map((program, index) => (
                                <div key={program.programCode || index} className="psy-program-card">
                                    <div className="psy-program-header">
                                        <h3>{program.programName || 'Untitled Program'}</h3>
                                        {isProgramActive(program.active) && (
                                            <span className="active-badge">Active</span>
                                        )}
                                    </div>
                                    <div className="psy-program-body">
                                        <p className="psy-program-description">
                                            {program.description || 'No description available.'}
                                        </p>
                                        <div className="psy-program-details">
                                            <div className="psy-detail-item">
                                                <i className="bi bi-calendar-event"></i>
                                                <span><strong>Start:</strong> {formatDate(program.startDate)}</span>
                                            </div>
                                            <div className="psy-detail-item">
                                                <i className="bi bi-calendar-check"></i>
                                                <span><strong>End:</strong> {formatDate(program.endDate)}</span>
                                            </div>
                                            <div className="psy-detail-item">
                                                <i className="bi bi-people-fill"></i>
                                                <span><strong>Registered Users:</strong> {program.registeredUsers}</span>
                                            </div>
                                            {program.participants && program.participants.length > 0 && (
                                                <div className="psy-detail-item psy-participants">
                                                    <i className="bi bi-person-check"></i>
                                                    <span>
                                                        <strong>Participants:</strong>
                                                        <ul className="psy-participant-list">
                                                            {program.participants.slice(0, 3).map(participant => (
                                                                <li key={participant.id}>
                                                                    {participant.name} ({participant.email})
                                                                </li>
                                                            ))}
                                                            {program.participants.length > 3 && (
                                                                <li>+{program.participants.length - 3} more</li>
                                                            )}
                                                        </ul>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="psy-program-footer">
                                        <Link
                                            to={`/psysupport/${program.programCode}`}
                                            className="psy-view-btn"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PsySupportProgram;
