import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { Calendar, Search, ChevronDown, User, Clock, Edit, Eye, AlertTriangle } from 'lucide-react';
import './ManagingAppointment.css';
import AdminHeader from '../../../../component/admin/AdminHeader';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';

const ManagingAppointment = () => {
    const [psychologists, setPsychologists] = useState([]);
    const [selectedPsychologist, setSelectedPsychologist] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch psychologists on component mount
    useEffect(() => {
        const fetchPsychologists = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Endpoint to get all psychologists
                const response = await axios.get('http://localhost:8080/identity/admin/getAllActiveUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && Array.isArray(response.data.result)) {
                    setPsychologists(response.data.result);
                    // Auto-select first psychologist if available
                    if (response.data.result.length > 0) {
                        setSelectedPsychologist(response.data.result[0]);
                    }
                } else {
                    setError("Failed to load psychologists. Invalid response format.");
                }
            } catch (err) {
                console.error("Error fetching psychologists:", err);
                setError("Failed to load psychologists. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPsychologists();
    }, []);

    // Fetch appointments when selected psychologist changes
    useEffect(() => {
        if (!selectedPsychologist) return;
        
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Use the provided endpoint with the selected psychologist's ID
                const response = await axios.get(
                    `http://localhost:8080/identity/admin/psyappointment/${selectedPsychologist.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && Array.isArray(response.data.result)) {
                    // Process the appointment data according to the schema
                    const formattedAppointments = response.data.result.map(appointment => {
                        const appointmentDate = parseISO(appointment.appointmentDate);
                        
                        return {
                            ...appointment,
                            formattedDate: format(appointmentDate, 'EEEE, MMMM d, yyyy'),
                            formattedTime: format(appointmentDate, 'h:mm a')
                        };
                    });
                    
                    // Sort appointments by date (newest first)
                    formattedAppointments.sort((a, b) => 
                        new Date(b.appointmentDate) - new Date(a.appointmentDate)
                    );
                    
                    setAppointments(formattedAppointments);
                } else {
                    setAppointments([]);
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError(`Failed to load appointments for ${selectedPsychologist.name}. Please try again.`);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedPsychologist]);

    // Handle psychologist selection
    const handlePsychologistSelect = (psychologist) => {
        setSelectedPsychologist(psychologist);
        setDropdownOpen(false);
    };

    // Filter and search appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesFilter = 
            filter === 'all' || 
            (filter === 'upcoming' && new Date(appointment.appointmentDate) >= new Date()) ||
            (filter === 'past' && new Date(appointment.appointmentDate) < new Date());
        
        const matchesSearch = 
            searchQuery === "" || 
            appointment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // View user details function
    const viewUserDetails = (userId) => {
        // Navigate to user profile or show modal with user details
        console.log("View user details for:", userId);
        // Implementation depends on your admin routing/UI structure
    };

    // View appointment details function
    const viewAppointmentDetails = (appointmentId) => {
        // Navigate to appointment details or show modal with appointment details
        console.log("View appointment details for:", appointmentId);
        // Implementation depends on your admin routing/UI structure
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            
            <main className="main admin-main">
                <div className="admin-appointment-container">
                    <div className="appointment-management-header">
                        <h1>Manage Psychologist Appointments</h1>
                        <p>View and manage appointments for your psychologists</p>
                    </div>
                    
                    <div className="controls-container">
                        {/* Psychologist Selector Dropdown */}
                        <div className="psychologist-selector">
                            <label>Select Psychologist:</label>
                            <div className="dropdown-wrapper">
                                <button 
                                    className="psychologist-dropdown-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {selectedPsychologist ? selectedPsychologist.name : 'Select a Psychologist'}
                                    <ChevronDown size={16} />
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        {psychologists.map(psy => (
                                            <div 
                                                key={psy.id} 
                                                className={`dropdown-item ${selectedPsychologist?.id === psy.id ? 'active' : ''}`}
                                                onClick={() => handlePsychologistSelect(psy)}
                                            >
                                                <div className="psy-name">{psy.name}</div>
                                                <div className="psy-email">{psy.email}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Filter and Search */}
                        <div className="filter-search-container">
                            <div className="filter-buttons">
                                <button 
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                                    onClick={() => setFilter('upcoming')}
                                >
                                    Upcoming
                                </button>
                                <button 
                                    className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                                    onClick={() => setFilter('past')}
                                >
                                    Past
                                </button>
                            </div>
                            
                            <div className="search-container">
                                <Search size={16} className="search-icon" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search by student ID or appointment ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Appointments Content */}
                    <div className="appointments-content">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading appointments...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <AlertTriangle size={32} />
                                <p>{error}</p>
                                <button 
                                    onClick={() => setSelectedPsychologist(selectedPsychologist)} 
                                    className="retry-btn"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="empty-state">
                                <Calendar size={40} strokeWidth={1.5} />
                                <h3>No appointments found</h3>
                                <p>
                                    {filter !== 'all' 
                                        ? `There are no ${filter} appointments for this psychologist.` 
                                        : searchQuery 
                                            ? "No appointments match your search." 
                                            : "This psychologist has no appointments scheduled."}
                                </p>
                            </div>
                        ) : (
                            <div className="appointments-table-container">
                                <table className="appointments-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time Slot</th>
                                            <th>Student ID</th>
                                            <th>Appointment ID</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map(appointment => (
                                            <tr key={appointment.appointmentId} className={
                                                new Date(appointment.appointmentDate) < new Date() ? 'past' : 'upcoming'
                                            }>
                                                <td className="date-cell">
                                                    <Calendar size={16} className="cell-icon" />
                                                    {appointment.formattedDate}
                                                </td>
                                                <td className="time-slot-cell">
                                                    <Clock size={16} className="cell-icon" />
                                                    {appointment.timeSlot}
                                                </td>
                                                <td className="student-cell">
                                                    <User size={16} className="cell-icon" />
                                                    {appointment.userId}
                                                </td>
                                                <td className="appointment-id-cell">
                                                    <span className="appointment-id">
                                                        {appointment.appointmentId.slice(0, 8)}...
                                                    </span>
                                                </td>
                                                <td className="actions-cell">
                                                    <button 
                                                        className="action-btn view-user"
                                                        onClick={() => viewUserDetails(appointment.userId)}
                                                        title="View Student Details"
                                                    >
                                                        <User size={16} />
                                                    </button>
                                                    <button 
                                                        className="action-btn view-appointment"
                                                        onClick={() => viewAppointmentDetails(appointment.appointmentId)}
                                                        title="View Appointment Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagingAppointment;
