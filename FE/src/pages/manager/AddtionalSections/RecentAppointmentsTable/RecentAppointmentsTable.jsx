import React, { useState, useEffect } from 'react';
import ApiService from '../../../../service/ApiService';

const RecentAppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // This is a placeholder - in a real implementation, you would add an API endpoint to fetch recent appointments
    useEffect(() => {
        // Simulating API call with the mock data for now
        // In a real implementation, replace this with an actual API call
        setLoading(true);
        setTimeout(() => {
            setAppointments(mockItems);
            setLoading(false);
        }, 500);

        // Real implementation would look like:
        // const fetchRecentAppointments = async () => {
        //   try {
        //     const response = await ApiService.getRecentAppointments();
        //     if (response.status === 200) {
        //       setAppointments(response.data);
        //     }
        //   } catch (error) {
        //     console.error("Error fetching appointments:", error);
        //   } finally {
        //     setLoading(false);
        //   }
        // };
        // fetchRecentAppointments();
    }, []);

    const mockItems = [
        {
            _id: '1',
            number: '#2644',
            customer: 'Nguyễn Minh Hoàng',
            service: 'Mental Health Consultation',
            time: '2023-11-20 14:00',
            status: 'Confirmed',
        },
        {
            _id: '2',
            number: '#2457',
            customer: 'Ngô Chí Kiên',
            service: 'Depression Screening',
            time: '2023-11-21 09:30',
            status: 'Pending',
        },
        {
            _id: '3',
            number: '#2147',
            customer: 'Trần Phương Khánh',
            service: 'Anxiety Treatment',
            time: '2023-11-19 15:45',
            status: 'Cancelled',
        },
        {
            _id: '4',
            number: '#2049',
            customer: 'Tô Triều Vỹ',
            service: 'Psychological Assessment',
            time: '2023-11-22 11:15',
            status: 'Confirmed',
        },
        {
            _id: '5',
            number: '#3592',
            customer: 'Nguyễn Phương Nam',
            service: 'Mental Wellness Checkup',
            time: '2023-11-23 16:30',
            status: 'Pending',
        },
    ];

    const handleStatus = status => {
        switch (status) {
            case 'Confirmed':
                return 'success';
            case 'Pending':
                return 'warning';
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
        <table className="table table-borderless datatable">
            <thead className="table-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Service</th>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {appointments.map(item => (
                    <tr key={item._id}>
                        <th scope="row">
                            <a href="#">{item.number}</a>
                        </th>
                        <td>{item.customer}</td>
                        <td>
                            <a href="#" className="text-primary fw-bold">
                                {item.service}
                            </a>
                        </td>
                        <td>{item.time}</td>
                        <td>
                            <span className={`badge bg-${handleStatus(item.status)}`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RecentAppointmentsTable;
