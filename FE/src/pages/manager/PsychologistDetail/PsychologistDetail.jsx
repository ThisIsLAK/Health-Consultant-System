import React from 'react'
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import PageTitle from '../../../component/manager/PageTitle';
import { useNavigate } from 'react-router-dom';

const PsychologistDetail = () => {
    const navigate = useNavigate()

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="Psychologist Details" />

                <div className="appointment-container">
                    {/* Patient Name and ID */}
                    <div className="patient-header">
                        <h2 className="patient-name">Dr. Thai Binh Duong</h2>
                        <p className="patient-id">Psychologist ID: SE****</p>
                    </div>

                    {/* Appointment Status */}
                    <div className="status-card">
                        <h3 className="app-card-title">Treatent Status</h3>
                        <div className="status-grid">
                            <div className="status-item">
                                <label>Previous Patient</label>
                                <span className='status-item-span'>Le Anh Khoa</span>
                            </div>
                            <div className="status-item">
                                <label>Treatment Status</label>
                                <span className='status-item-span'>Complete</span>
                            </div>
                            <div className="status-item">
                                <label>Previous Appointment Time</label>
                                <span className='status-item-span'>1/15/2024, 2:00:00 PM</span>
                            </div>
                            <div className="status-item">
                                <label>Remaining</label>
                                <span className='status-item-span'>12 Sessions</span>
                            </div>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="details-card">
                        <div style={{ marginLeft: 20 }}>
                            <h3 className="app-card-title">Account Details</h3>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <label>Role:</label>
                                <span>Psychologist</span>
                            </div>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <label>Since:</label>
                                <span>01/01/2025</span>
                            </div>                           
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <label>Certification:</label>
                                <span>Ph.D from HCMC University of Medication</span>
                            </div>
                            <div className="detail-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <label>Personal Email:</label>
                                <span>abc@gmail.com</span>
                            </div>
                        </div>


                        {/* Clinical Notes */}
                        <div className="clinical-notes">
                            <h3 className="app-card-title">Other Notes</h3>
                            <p>I don't know what to write here ^^</p>
                        </div>
                    </div>

                    <button onClick={() => navigate('/psychologistlist')} className="return-button">Return to List</button>
                </div>
            </main>
        </div>
    )
}

export default PsychologistDetail
