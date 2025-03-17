import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { Pagination, InputGroup, FormControl } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import { FaEye } from 'react-icons/fa';

const AppointmentHistory = () => {
    const itemsPerPage = 12;
    const mockAppointments = [
        { id: 1, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 2, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 4, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 5, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 6, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 7, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 8, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 9, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 10, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
        { id: 11, patientName: 'Nguyen Minh Hoang', classroom: '12A16', dateTime: '10/01/2025', psychologist: 'Thai Binh Duong', status: 'Complete' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [appointments, setAppointments] = useState(mockAppointments);

    const indexOfLastAppointment = currentPage * itemsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    const navigate = useNavigate();


    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="Appointment History" />
                <div className="user-table-container">
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Search for an appointment..." aria-label="Search" />
                        <InputGroup.Text>{`Showing ${appointments.length} appointment(s)`}</InputGroup.Text>
                    </InputGroup>
                    <div className="table-responsive">
                        <table className="table table-borderless datatable">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Patient Name</th>
                                    <th scope="col">Classroom</th>
                                    <th scope="col">Date & Time</th>
                                    <th scope="col">Psychologist</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <th scope="row">
                                            <a href="#" className="custom-link">
                                                {appointment.id}
                                            </a>
                                        </th>
                                        <td>{appointment.patientName}</td>
                                        <td>{appointment.classroom}</td>
                                        <td>{appointment.dateTime}</td>
                                        <td>{appointment.psychologist}</td>
                                        <td>
                                            <span className="badge bg-success">{appointment.status}</span>
                                        </td>
                                        <td>
                                            <FaEye onClick={() => navigate('/appdetails')} className="custom-icon text-dark" style={{ cursor: 'pointer' }} title="View Detail" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination className="justify-content-center">
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </main>
        </div>
    );
};

export default AppointmentHistory;
