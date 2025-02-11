import React, { useState } from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { Pagination, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import { FaEye } from 'react-icons/fa';

const CustomerList = () => {
  const itemsPerPage = 12;
  const mockPsychologists = [
    { id: 1, name: 'Dr. James Smith', email: 'jsmith@example.com', status: true },
    { id: 2, name: 'Dr. Sarah Johnson', email: 'sjohnson@example.com', status: false },
    { id: 3, name: 'Dr. Michael Brown', email: 'mbrown@example.com', status: true },
    { id: 4, name: 'Dr. Emily White', email: 'ewhite@example.com', status: false },
    { id: 5, name: 'Dr. Daniel Garcia', email: 'dgarcia@example.com', status: true },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [psychologists, setPsychologists] = useState(mockPsychologists);

  const handleAvailabilityToggle = (psychologist) => {
    const updatedPsychologists = psychologists.map((p) =>
      p.id === psychologist.id ? { ...p, status: !p.status } : p
    );
    setPsychologists(updatedPsychologists);
    toast.success(
      `${psychologist.status ? 'Marked as Unavailable' : 'Marked as Available'} successfully!`
    );
  };

  const handleDeletePsychologist = (psychologist) => {
    const updatedPsychologists = psychologists.filter((p) => p.id !== psychologist.id);
    setPsychologists(updatedPsychologists);
    toast.success('Psychologist deleted successfully!');
  };

  const indexOfLastPsychologist = currentPage * itemsPerPage;
  const indexOfFirstPsychologist = indexOfLastPsychologist - itemsPerPage;
  const currentPsychologists = psychologists.slice(
    indexOfFirstPsychologist,
    indexOfLastPsychologist
  );
  const totalPages = Math.ceil(psychologists.length / itemsPerPage);

  return (
    <div>
      <ManagerHeader />
      <ManagerSidebar />

      <main id="main" className="main">
        <PageTitle page="Psychologist List" />

        <div className="user-table-container">
          <InputGroup className="mb-3">
            <FormControl placeholder="Search for a psychologist..." aria-label="Search" />
            <InputGroup.Text>{`Showing ${psychologists.length} psychologist(s)`}</InputGroup.Text>
          </InputGroup>

          <div className="table-responsive">
            <table className="table table-borderless datatable">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Psychologist Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPsychologists.map((psychologist) => (
                  <tr key={psychologist.id}>
                    <th scope="row">
                      <a href="#" className="custom-link">
                        {psychologist.id}
                      </a>
                    </th>
                    <td>{psychologist.name}</td>
                    <td>{psychologist.email}</td>
                    <td>
                      <span className={`badge bg-${psychologist.status ? 'success' : 'danger'}`}>
                        {psychologist.status ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="d-flex align-items-center">
                      <FaEye
                        className="custom-icon me-3 text-dark"
                        style={{ cursor: 'pointer' }}
                        title="View Detail"
                      />
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="link"
                          className="custom-button three-dots p-0 text-decoration-none text-dark"
                        >
                          &#8942;
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleAvailabilityToggle(psychologist)}>
                            {psychologist.status ? 'Mark Unavailable' : 'Mark Available'}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleDeletePsychologist(psychologist)}
                            className="text-danger"
                          >
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
  );
};

export default CustomerList;
