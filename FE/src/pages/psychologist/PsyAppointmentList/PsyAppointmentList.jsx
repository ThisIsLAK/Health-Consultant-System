import React from 'react'
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader'
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar'
import PageTitle from '../../../component/psychologist/PageTitle'
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Phone,
    Mail,
    Link,
    FileText,
    Trash,
    Edit,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './PsyAppointmentList.css';

const PsyAppointmentList = () => {
    const statuses = [
        { id: 'all', label: 'All', isActive: true },
        { id: 'confirmed', label: 'Confirmed', isActive: false },
        { id: 'completed', label: 'Completed', isActive: false },
        { id: 'cancelled', label: 'Cancelled', isActive: false }
    ];

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const navigate = useNavigate()

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id='main' className='main'>
                <PageTitle page="Patient Details" />

                <div className="appointment-header">
                    {/* Search Bar */}
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search appointment..."
                            className="search-input"
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="status-filters">
                        {statuses.map(status => (
                            <button
                                key={status.id}
                                className={`status-button ${status.isActive ? 'active' : ''}`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>

                    {/* Date Navigation */}
                    <div className="date-navigation">
                        <button className="nav-button">
                            <ChevronLeft className="arrow-icon" />
                        </button>
                        <h2 className="current-date">{currentDate}</h2>
                        <button className="nav-button">
                            <ChevronRight className="arrow-icon" />
                        </button>
                    </div>

                    {/* Appointment Card */}
                    <div className="appointment-card">
                        <div className="time-section">
                            <div className="time">13:00</div>
                            <div className="period">AM</div>
                            <div className="duration">1 hour</div>
                        </div>

                        <div className="details-section">
                            <div className="app-header">
                                <div className="name-status">
                                    <h3 className="patient-name">Johnson Sema</h3>
                                    <span className="status waiting">Waiting</span>
                                </div>
                                <div className="appointment-type">Regular Checkup</div>
                            </div>

                            <div className="info-grid">
                                <div className="info-item">
                                    <Phone className="icon" size={16} />
                                    <span className="text">12345678919</span>
                                </div>
                                <div className="info-item">
                                    <Mail className="icon" size={16} />
                                    <span className="text">khoa@gmail.com</span>
                                </div>
                                <div className="info-item">
                                    <Link className="icon" size={16} />
                                    <span className="text">https://meet.google.com/xyz-abcd-ntr</span>
                                </div>
                                <div className="info-item">
                                    <FileText className="icon" size={16} />
                                    <span className="text">Notes: Follow-up on previous session</span>
                                </div>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="action-btn delete">
                                <Trash className="icon" size={16} />
                            </button>
                            <button className="action-btn edit">
                                <Edit className="icon" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PsyAppointmentList