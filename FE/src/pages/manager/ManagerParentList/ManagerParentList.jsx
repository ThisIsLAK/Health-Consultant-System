import React, { useState } from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import PageTitle from '../../../component/manager/PageTitle';
import { Pagination, InputGroup, FormControl, Button } from 'react-bootstrap';

const ManagerParentList = () => {
    const itemsPerPage = 10;
    const mockPatients = [
        { id: 1, name: 'John Doe', psychologist: 'Dr. Smith', email: 'johndoe@example.com', status: true },
        { id: 2, name: 'Jane Smith', psychologist: 'Dr. Brown', email: 'janesmith@example.com', status: false },
        { id: 3, name: 'Alice Johnson', psychologist: 'Dr. Adams', email: 'alicej@example.com', status: true },
        { id: 4, name: 'Bob Brown', psychologist: 'Dr. Lee', email: 'bobbrown@example.com', status: false },
        { id: 5, name: 'Charlie White', psychologist: 'Dr. Garcia', email: 'charliew@example.com', status: true },
        { id: 6, name: 'David Green', psychologist: 'Dr. Patel', email: 'davidg@example.com', status: true },
        { id: 7, name: 'Emma Black', psychologist: 'Dr. Kim', email: 'emmab@example.com', status: false },
        { id: 8, name: 'Frank Blue', psychologist: 'Dr. Ortiz', email: 'frankb@example.com', status: true },
        { id: 9, name: 'Grace Red', psychologist: 'Dr. Chen', email: 'gracer@example.com', status: false },
        { id: 10, name: 'Henry Yellow', psychologist: 'Dr. Wong', email: 'henryy@example.com', status: true },
        { id: 11, name: 'Isabella Pink', psychologist: 'Dr. Lopez', email: 'isabellap@example.com', status: true },
        { id: 12, name: 'James Orange', psychologist: 'Dr. Taylor', email: 'jameso@example.com', status: false },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [patients, setPatients] = useState(mockPatients);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // Filter patients based on search term
    const filteredPatients = patients.filter((patient) => {
        if (searchTerm === '') return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
            patient.name.toLowerCase().includes(lowerSearch) ||
            patient.email.toLowerCase().includes(lowerSearch)
        );
    });

    // Sort patients by name
    const sortedPatients = [...filteredPatients].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    const indexOfLastPatient = currentPage * itemsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
    const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
    const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />

            <main id="main" className="main">
                <PageTitle page="Parent List" />

                <section className="section dashboard">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Header with total patients */}
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-sm-6 mb-3 mb-md-0">
                                            <div className="card border-0 bg-light">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-3 bg-primary-light rounded-circle p-3">
                                                            <i className="bi bi-people-fill text-primary fs-4"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">Total Parents</h6>
                                                            <h4 className="mb-0">{patients.length}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search and sort section */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-body p-3">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-white">
                                                            <i className="bi bi-search"></i>
                                                        </InputGroup.Text>
                                                        <FormControl
                                                            placeholder="Search parents by name or email..."
                                                            className="border-start-0"
                                                            value={searchTerm}
                                                            onChange={(e) => {
                                                                setSearchTerm(e.target.value);
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                        {searchTerm && (
                                                            <Button
                                                                variant="outline-secondary"
                                                                onClick={() => setSearchTerm('')}
                                                                title="Clear search"
                                                            >
                                                                <i className="bi bi-x"></i>
                                                            </Button>
                                                        )}
                                                    </InputGroup>
                                                </div>
                                                <div className="col-md-2">
                                                    <Button
                                                        variant="white"
                                                        className="w-100 border d-flex align-items-center justify-content-between small-text"
                                                        onClick={toggleSortOrder}
                                                    >
                                                        <span>
                                                            <i className="bi bi-sort-alpha-down me-2"></i>
                                                            Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                                        </span>
                                                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    {currentPatients.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle border-bottom">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="py-3" style={{ width: '50%' }}>Parents</th>
                                                        <th className="py-3" style={{ width: '50%' }}>Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentPatients.map((patient) => (
                                                        <tr key={patient.id} className="border-bottom">
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        className="avatar text-white d-flex align-items-center justify-content-center me-3"
                                                                        style={{
                                                                            width: '40px',
                                                                            height: '40px',
                                                                            borderRadius: '8px',
                                                                            background: `hsl(${(patient.id * 31) % 360}, 70%, 60%)`,
                                                                            fontSize: '16px',
                                                                        }}
                                                                    >
                                                                        {patient.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0">{patient.name}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{patient.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center my-5 py-5">
                                            <div className="fs-1 text-muted mb-3">
                                                <i className="bi bi-search"></i>
                                            </div>
                                            <h5 className="mb-2">No Parents found</h5>
                                            <p className="text-muted">Try adjusting your search to find what you're looking for.</p>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Clear search
                                            </Button>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {currentPatients.length > 0 && (
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <p className="mb-0 text-muted">
                                                Showing{' '}
                                                <span className="fw-bold">
                                                    {sortedPatients.length > 0
                                                        ? `${indexOfFirstPatient + 1}-${Math.min(
                                                            indexOfLastPatient,
                                                            sortedPatients.length
                                                        )}`
                                                        : '0'}
                                                </span>{' '}
                                                of <span className="fw-bold">{sortedPatients.length}</span> parents
                                            </p>

                                            {totalPages > 1 && (
                                                <div className="d-flex justify-content-center">
                                                    <nav>
                                                        <ul className="pagination">
                                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(1)}>
                                                                    <i className="bi bi-chevron-double-left"></i>
                                                                </button>
                                                            </li>
                                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                                >
                                                                    <i className="bi bi-chevron-left"></i>
                                                                </button>
                                                            </li>

                                                            {totalPages <= 5 ? (
                                                                Array.from({ length: totalPages }, (_, i) => (
                                                                    <li
                                                                        key={i + 1}
                                                                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                                                    >
                                                                        <button
                                                                            className="page-link"
                                                                            onClick={() => setCurrentPage(i + 1)}
                                                                        >
                                                                            {i + 1}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    {currentPage > 2 && (
                                                                        <li className="page-item">
                                                                            <button className="page-link" onClick={() => setCurrentPage(1)}>
                                                                                1
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    {currentPage > 3 && (
                                                                        <li className="page-item disabled">
                                                                            <span className="page-link">...</span>
                                                                        </li>
                                                                    )}
                                                                    {currentPage > 1 && (
                                                                        <li className="page-item">
                                                                            <button
                                                                                className="page-link"
                                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                                            >
                                                                                {currentPage - 1}
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    <li className="page-item active">
                                                                        <span className="page-link">{currentPage}</span>
                                                                    </li>
                                                                    {currentPage < totalPages && (
                                                                        <li className="page-item">
                                                                            <button
                                                                                className="page-link"
                                                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                                            >
                                                                                {currentPage + 1}
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    {currentPage < totalPages - 2 && (
                                                                        <li className="page-item disabled">
                                                                            <span className="page-link">...</span>
                                                                        </li>
                                                                    )}
                                                                    {currentPage < totalPages - 1 && (
                                                                        <li className="page-item">
                                                                            <button
                                                                                className="page-link"
                                                                                onClick={() => setCurrentPage(totalPages)}
                                                                            >
                                                                                {totalPages}
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                </>
                                                            )}

                                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                                >
                                                                    <i className="bi bi-chevron-right"></i>
                                                                </button>
                                                            </li>
                                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(totalPages)}
                                                                >
                                                                    <i className="bi bi-chevron-double-right"></i>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ManagerParentList;