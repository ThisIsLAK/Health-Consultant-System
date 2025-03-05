import React, { useState } from 'react';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import { Search, Phone, Mail, Link, FileText, Trash, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import './PsyAppointmentList.css';
import { useNavigate } from 'react-router-dom';

const PsyAppointmentList = () => {
    const navigate = useNavigate()

    const [selectedStatus, setSelectedStatus] = useState('all');

    // Function to handle editing appointment
    const handleEdit = (appointmentId) => {
        // Pass the appointment data through navigation state
        const appointmentToEdit = appointments.find(app => app.id === appointmentId);
        navigate('/therapynote', { state: { appointment: appointmentToEdit } });
    };

    const statuses = [
        { id: 'all', label: 'All' },
        { id: 'waiting', label: 'waiting' },
        { id: 'completed', label: 'completed' },
    ];

    const appointments = [
        { id: 1, time: '13:00', period: 'AM', duration: '1 hour', name: 'Johnson Sema', status: 'waiting', type: 'Regular Checkup', phone: '12345678919', email: 'khoa@gmail.com', link: 'https://meet.google.com/xyz-abcd-ntr', notes: 'Follow-up on previous session' },
        { id: 2, time: '14:00', period: 'PM', duration: '30 mins', name: 'Emma Watson', status: 'completed', type: 'Therapy Session', phone: '9876543210', email: 'emma@gmail.com', link: 'https://meet.google.com/abc-defg-hij', notes: 'New patient consultation' },
        { id: 3, time: '15:00', period: 'PM', duration: '45 mins', name: 'David Smith', status: 'completed', type: 'Mental Health Check', phone: '1112223334', email: 'david@gmail.com', link: 'https://meet.google.com/xyz-1234-567', notes: 'Final evaluation' },
        { id: 4, time: '16:00', period: 'AM', duration: '40 mins', name: 'John Doe', status: 'waiting', type: 'Regular Checkup', phone: '12345678919', email: 'john@gmail.com', link: 'https://meet.google.com/xyz-1234-567', notes: 'Follow-up on previous session' }
    ];

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const filteredAppointments = selectedStatus === 'all'
        ? appointments
        : appointments.filter(app => app.status === selectedStatus);

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id='main' className='main'>
                <PageTitle page="Appointments" />
                {/* Add the namespace container class to prevent CSS conflicts */}
                <div className="psy-appointment-container">
                    <div className="appointment-header">
                        {/* Status Filter Buttons */}
                        <div className="status-filters">
                            {statuses.map(status => (
                                <button
                                    key={status.id}
                                    className={`status-button ${selectedStatus === status.id ? 'active' : ''}`}
                                    onClick={() => setSelectedStatus(status.id)}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>

                        <div className="date-navigation">
                            <button className="nav-button">
                                <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="current-date">{currentDate}</h2>
                            <button className="nav-button">
                                <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Appointment List */}
                    {filteredAppointments.map(app => (
                        <div className="appointment-card" key={app.id}>
                            <div className="time-section">
                                <div className="time">{app.time}</div>
                                <div className="period">{app.period}</div>
                                <div className="duration">{app.duration}</div>
                            </div>
                            <div className="details-section">
                                <div className="app-header">
                                    <div className="name-status">
                                        <h3 className="patient-name">{app.name}</h3>
                                        <span className={`status ${app.status}`}>{app.status}</span>
                                    </div>
                                    <div className="appointment-type">{app.type}</div>
                                </div>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <Phone className="icon" size={16} />
                                        <span className="text">{app.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <Mail className="icon" size={16} />
                                        <span className="text">{app.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <Link className="icon" size={16} />
                                        <span className="text">{app.link}</span>
                                    </div>
                                    <div className="info-item">
                                        <FileText className="icon" size={16} />
                                        <span className="text">{app.notes}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                <button className="action-btn edit">
                                    <Edit
                                        onClick={() => handleEdit(app.id)}
                                        className="icon"
                                        size={16}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default PsyAppointmentList;