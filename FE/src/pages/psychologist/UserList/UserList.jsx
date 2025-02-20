import React, { useState } from 'react'
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader'
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar'
import { Pagination, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import PageTitle from '../../../component/psychologist/PageTitle'
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const itemsPerPage = 12;
    const mockPatients = [
        { id: 1, name: 'John Doe', classroom: 'Class A', psychologist: 'Dr. Smith', email: 'johndoe@example.com', status: true },
        { id: 2, name: 'Jane Smith', classroom: 'Class B', psychologist: 'Dr. Brown', email: 'janesmith@example.com', status: false },
        { id: 3, name: 'Alice Johnson', classroom: 'Class C', psychologist: 'Dr. Adams', email: 'alicej@example.com', status: true },
        { id: 4, name: 'Bob Brown', classroom: 'Class A', psychologist: 'Dr. Lee', email: 'bobbrown@example.com', status: false },
        { id: 5, name: 'Charlie White', classroom: 'Class B', psychologist: 'Dr. Garcia', email: 'charliew@example.com', status: true },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [patients, setPatients] = useState(mockPatients);

    const handleBanUnban = (patient) => {
        const updatedPatients = patients.map((p) =>
            p.id === patient.id ? { ...p, status: !p.status } : p
        );
        setPatients(updatedPatients);
        toast.success(`${patient.status ? 'Banned' : 'Unbanned'} successfully!`);
    };

    const handleDeletePatient = (patient) => {
        const updatedPatients = patients.filter((p) => p.id !== patient.id);
        setPatients(updatedPatients);
        toast.success('Patient deleted successfully!');
    };

    const indexOfLastPatient = currentPage * itemsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
    const totalPages = Math.ceil(patients.length / itemsPerPage);

    const navigate = useNavigate();

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id='main' className='main'>
                <PageTitle page='Patient List' />

                <div className="user-table-container">
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Search for a patient..." aria-label="Search" />
                        <InputGroup.Text>{`Showing ${patients.length} patient(s)`}</InputGroup.Text>
                    </InputGroup>

                    <div className="table-responsive">
                        <table className="table table-borderless datatable">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Patient Name</th>
                                    <th scope="col">Classroom</th>
                                    <th scope="col">Psychologist</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPatients.map((patient) => (
                                    <tr key={patient.id}>
                                        <th scope="row">
                                            <a href="#" className="custom-link">
                                                {patient.id}
                                            </a>
                                        </th>
                                        <td>{patient.name}</td>
                                        <td>{patient.classroom}</td>
                                        <td>{patient.psychologist}</td>
                                        <td>{patient.email}</td>
                                        <td>
                                            <span className={`badge bg-${patient.status ? 'success' : 'danger'}`}>
                                                {patient.status ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td className="d-flex align-items-center">
                                            <FaEye onClick={() => navigate('/patientdetail')} className="custom-icon me-3 text-dark" style={{ cursor: 'pointer' }} title="View Detail" />
                                            <Dropdown align="end">
                                                <Dropdown.Toggle variant="link" className="custom-button three-dots p-0 text-decoration-none text-dark">
                                                    &#8942;
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleBanUnban(patient)}>
                                                        {patient.status ? 'Ban' : 'Unban'}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDeletePatient(patient)} className="text-danger">
                                                        Delete
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
                </div>
            </main>
        </div>
    )
}

export default UserList
