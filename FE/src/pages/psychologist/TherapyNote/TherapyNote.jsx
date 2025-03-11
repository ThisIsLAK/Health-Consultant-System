import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import './TherapyNote.css'

const TherapyNote = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appointmentData = location.state?.appointment;
    const [therapyNotes, setTherapyNotes] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');

    // Chuyển logic redirect vào useEffect
    useEffect(() => {
        if (!appointmentData) {
            navigate('/psyapplist');
        }
    }, [appointmentData, navigate]);

    // Nếu không có data, return null để tránh render không cần thiết
    if (!appointmentData) {
        return null;
    }

    const handleSave = () => {
        // Here you would save the notes to your backend
        console.log('Saving notes for appointment:', {
            appointmentId: appointmentData.id,
            therapyNotes,
            clinicalNotes
        });
        navigate('/psyapplist');
    };

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id='main' className='main'>
                <PageTitle page="Therapy Notes" />

                <div className="appointment-container">
                    {/* Patient Name and ID */}
                    <div className="patient-header">
                        <h2 className="patient-name">{appointmentData.name}</h2>
                        <p className="patient-id">Patient ID: SE{appointmentData.id.toString().padStart(4, '*')}</p>
                    </div>

                    {/* Appointment Status */}
                    <div className="status-card">
                        <h3 className="app-card-title">Treatment Status</h3>
                        <div className="status-grid">
                            <div className="status-item">
                                <label>Therapist</label>
                                <span className='status-item-span'>Dr. Le Anh Khoa</span>
                            </div>
                            <div className="status-item">
                                <label>Treatment Status</label>
                                <span className='status-item-span'>{appointmentData.status}</span>
                            </div>
                            <div className="status-item">
                                <label>Appointment Time</label>
                                <span className='status-item-span'>
                                    {appointmentData.time} {appointmentData.period}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="details-card">
                        <div style={{ marginLeft: 20 }}>
                            <h3 className="app-card-title">Patient Details</h3>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <label>Type:</label>
                                <span>{appointmentData.type}</span>
                            </div>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <label>Duration:</label>
                                <span>{appointmentData.duration}</span>
                            </div>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <label>Contact:</label>
                                <span>{appointmentData.phone} | {appointmentData.email}</span>
                            </div>
                        </div>

                        {/* Therapy Notes - Editable */}
                        <div className="" style={{ padding: 16 }}>
                            <h3 className="app-card-title">Therapy Notes</h3>
                            <textarea
                                value={therapyNotes}
                                onChange={(e) => setTherapyNotes(e.target.value)}
                                className="notes-textarea"
                                placeholder="Enter therapy notes..."
                            />
                        </div>

                        {/* Clinical Notes - Editable */}
                        <div className="" style={{ padding: 16, marginTop: 10 }}>
                            <h3 className="app-card-title">Clinical Notes</h3>
                            <textarea
                                value={clinicalNotes}
                                onChange={(e) => setClinicalNotes(e.target.value)}
                                className="notes-textarea"
                                placeholder="Enter clinical notes..."
                            />
                        </div>
                    </div>

                    <div className="save-button-container">
                        <button onClick={handleSave} className="save-button">Save</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TherapyNote
