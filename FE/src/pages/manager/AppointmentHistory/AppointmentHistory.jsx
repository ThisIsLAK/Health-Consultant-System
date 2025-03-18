import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isToday } from 'date-fns'; // Add date-fns imports
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { InputGroup, FormControl, Form, Row, Col, Button } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import axios from 'axios';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    const navigate = useNavigate();

    // Add filters
    const [filters, setFilters] = useState({
        status: 'all', // 'all', 'upcoming', 'completed', 'cancelled', 'past'
        timeSlot: '', // Replace startDate/endDate with timeSlot
        psychologist: ''
    });

    // Add distinct psychologists list
    const [psychologists, setPsychologists] = useState([]);
    // Add distinct time slots list
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Get the authentication token from localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.error('No authentication token found');
                    navigate('/login'); // Redirect to login if no token exists
                    return;
                }
                
                const response = await axios.get('http://localhost:8080/identity/manager/allappointments', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Add the token to the request headers
                    }
                });
                
                if (response.data.code === 1000) {
                    const allAppointments = response.data.result;
                    setAppointments(allAppointments);
                    setFilteredAppointments(allAppointments);
                    
                    // Extract unique psychologists
                    const uniquePsychologists = [...new Set(allAppointments.map(app => app.psychologistName))];
                    setPsychologists(uniquePsychologists);
                    
                    // Extract unique time slots
                    const uniqueTimeSlots = [...new Set(allAppointments.map(app => app.timeSlot))];
                    setTimeSlots(uniqueTimeSlots);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access (token expired or invalid)
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [navigate]);

    // Apply all filters
    useEffect(() => {
        let filtered = [...appointments];
        
        // Apply name search filter
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(appointment =>
                appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(appointment => {
                const status = getAppointmentStatus(appointment);
                return status.value === filters.status.toLowerCase();
            });
        }
        
        // Apply time slot filter
        if (filters.timeSlot) {
            filtered = filtered.filter(appointment => 
                appointment.timeSlot === filters.timeSlot
            );
        }
        
        // Apply psychologist filter
        if (filters.psychologist) {
            filtered = filtered.filter(appointment => 
                appointment.psychologistName === filters.psychologist
            );
        }
        
        setFilteredAppointments(filtered);
    }, [searchTerm, filters, appointments]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setFilters({
            status: 'all',
            timeSlot: '',
            psychologist: ''
        });
    };

    // Format date string to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    // Determine appointment status
    const getAppointmentStatus = (appointment) => {
        const appointmentDate = parseISO(appointment.appointmentDate);
        const isPastAppointment = new Date(appointmentDate) < new Date() && !isToday(appointmentDate);
        
        // Determine status based on 'active' property and date:
        // - active = null -> UPCOMING
        // - active = false -> CANCELLED
        // - active = true -> COMPLETED
        // - past date (and not cancelled or completed) -> PAST
        if (appointment.active === false) {
            return { label: 'Cancelled', value: 'cancelled' };
        } else if (appointment.active === true) {
            return { label: 'Completed', value: 'completed' };
        } else if (isPastAppointment && appointment.active === null) {
            return { label: 'Past', value: 'past' };
        } else {
            return { label: 'Upcoming', value: 'upcoming' };
        }
    };

    // Update handleStatus to match the new status values
    const handleStatus = status => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'upcoming':
                return 'primary';
            case 'cancelled':
                return 'danger';
            case 'past':
                return 'secondary';
            default:
                return 'info';
        }
    };

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="Appointment History" />
                <div className="user-table-container">
                    {/* Enhanced filter section */}
                    <div className="filter-section mb-4">
                        <Row>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <FormControl 
                                        placeholder="Search by name or email..." 
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={8}>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Select 
                                                name="status" 
                                                value={filters.status}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="all">All Status</option>
                                                <option value="upcoming">Upcoming</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="past">Past</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Select 
                                                name="psychologist" 
                                                value={filters.psychologist}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">All Psychologists</option>
                                                {psychologists.map(psych => (
                                                    <option key={psych} value={psych}>{psych}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Select 
                                                name="timeSlot" 
                                                value={filters.timeSlot}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">All Time Slots</option>
                                                {timeSlots.map(slot => (
                                                    <option key={slot} value={slot}>{slot}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="text-muted">
                                            {`Showing ${filteredAppointments.length} appointment(s)`}
                                        </span>
                                    </div>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    
                    {loading ? (
                        <div className="text-center">Loading appointments...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-borderless datatable">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">User Name</th>
                                        <th scope="col">User Email</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time Slot</th>
                                        <th scope="col">Psychologist</th>
                                        <th scope="col">Psychologist Email</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map((appointment) => {
                                        const status = getAppointmentStatus(appointment);
                                        return (
                                            <tr key={appointment.appointmentId}>
                                                <td>{appointment.studentName}</td>
                                                <td>{appointment.studentEmail}</td>
                                                <td>{formatDate(appointment.appointmentDate)}</td>
                                                <td>{appointment.timeSlot}</td>
                                                <td>{appointment.psychologistName}</td>
                                                <td>{appointment.psychologistEmail}</td>
                                                <td>
                                                    <span className={`badge bg-${handleStatus(status.value)}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AppointmentHistory;
