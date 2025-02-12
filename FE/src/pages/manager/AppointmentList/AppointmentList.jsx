import React, { useState } from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { Pagination, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import { FaEye } from 'react-icons/fa';
import PsychologistModal from '../../../component/manager/PsychologistModal';

const AppointmentList = () => {
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

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleAssignPsychologist = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const handleConfirmAssign = (psychologistId) => {
        console.log(`Assigned Psychologist ${psychologistId} to Appointment ${selectedAppointment.id}`);
        setShowModal(false);
    };

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="All Appointments" />
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
                                        <td className="d-flex align-items-center">
                                            <FaEye className="custom-icon me-3 text-dark" style={{ cursor: 'pointer' }} title="View Detail" />
                                            <Dropdown align="end">
                                                <Dropdown.Toggle variant="link" className="custom-button three-dots p-0 text-decoration-none text-dark">
                                                    &#8942;
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleAssignPsychologist(appointment)}>
                                                        Assign Psychologist
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleRemoveAppointment(appointment)} className="text-danger">
                                                        Remove Appointment
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
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

                    <PsychologistModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleAssign={handleConfirmAssign}
                    />
                </div>
            </main>
        </div>
    );
};

export default AppointmentList;
