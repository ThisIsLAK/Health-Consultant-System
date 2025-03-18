import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecentAppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentAppointments = async () => {
            try {
                // Get the authentication token from localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }
                
                const response = await axios.get('http://localhost:8080/identity/manager/allappointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data.code === 1000) {
                    // Sort appointments by date (newest first) and time slot
                    const sortedAppointments = response.data.result.sort((a, b) => {
                        // Compare appointment dates first
                        const dateComparison = new Date(b.appointmentDate) - new Date(a.appointmentDate);
                        
                        // If dates are the same, compare time slots
                        if (dateComparison === 0) {
                            // Extract hours from time slot strings (e.g., "9:00-10:00" → 9)
                            const aHour = parseInt(a.timeSlot.split(':')[0]);
                            const bHour = parseInt(b.timeSlot.split(':')[0]);
                            return bHour - aHour; // Later time slots come first
                        }
                        
                        return dateComparison;
                    });
                    
                    // Take only the first 5
                    const recentAppointments = sortedAppointments.slice(0, 5);
                    setAppointments(recentAppointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentAppointments();
    }, []);

    // Format date string to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    // Determine appointment status
    const getAppointmentStatus = (appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const currentDate = new Date();
        
        // If appointment is not active, it's cancelled
        if (!appointment.active) {
            return { label: 'Cancelled', value: 'Cancelled' };
        }
        
        // If appointment date is in the past, it's completed
        if (appointmentDate < currentDate) {
            return { label: 'Completed', value: 'Confirmed' };
        }
        
        // Otherwise it's an upcoming appointment
        return { label: 'Upcoming', value: 'Pending' };
    };

    const handleStatus = status => {
        switch (status) {
            case 'Confirmed':
                return 'success';
            case 'Pending':
                return 'success';
            case 'Cancelled':
                return 'danger';
            default:
                return 'primary';
        }
    };

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    return (
        <>
            <table className="table table-borderless datatable">
                <thead className="table-light">
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">User Email</th>
                        <th scope="col">Psychologist</th>
                        <th scope="col">Psychologist Email</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(item => {
                        const status = getAppointmentStatus(item);  
                        return (
                            <tr key={item.appointmentId}>
                                <td>{item.studentName}</td>
                                <td>{item.studentEmail}</td>
                                <td>
                                    {item.psychologistName}
                                </td>
                                <td>{item.psychologistEmail}</td>
                                <td>{formatDate(item.appointmentDate)}</td>
                                <td>{item.timeSlot}</td>
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
        </>
    );
};

export default RecentAppointmentsTable;
