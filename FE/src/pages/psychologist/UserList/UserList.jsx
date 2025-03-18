import React, { useState, useEffect } from 'react';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import { Pagination, InputGroup, FormControl, Button } from 'react-bootstrap';
import ApiService from '../../../service/ApiService'; // Import the ApiService

const UserList = () => {
    const itemsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [students, setStudents] = useState([]); // Renamed from patients to students
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state

    // Fetch students when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await ApiService.getAllStudents();
                console.log('API Response:', response); // Debug the response structure
                if (response.status === 200) {
                    // Check if data is an array or nested inside a result field
                    let studentData = response.data;
                    if (Array.isArray(response.data)) {
                        studentData = response.data;
                    } else if (response.data && Array.isArray(response.data.result)) {
                        studentData = response.data.result;
                    } else {
                        throw new Error('Unexpected API response format');
                    }
                    setStudents(studentData);
                } else {
                    setError(response.message || 'Failed to fetch students');
                }
            } catch (err) {
                setError('An error occurred while fetching students');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []); // Empty dependency array to run only on mount

    // Filter students based on search term
    const filteredStudents = Array.isArray(students) ? students.filter((student) => {
        if (searchTerm === '') return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
            student.name?.toLowerCase().includes(lowerSearch) ||
            student.email?.toLowerCase().includes(lowerSearch)
        );
    }) : [];

    // Sort students by name
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        const nameA = a.name?.toLowerCase() || '';
        const nameB = b.name?.toLowerCase() || '';
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameB);
    });

    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id="main" className="main">
                <PageTitle page="Student List" />

                <section className="section dashboard">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Header with total students */}
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-sm-6 mb-3 mb-md-0">
                                            <div className="card border-0 bg-light">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-3 bg-primary-light rounded-circle p-3">
                                                            <i className="bi bi-people-fill text-primary fs-4"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">Total Students</h6>
                                                            <h4 className="mb-0">{students.length}</h4>
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
                                                            placeholder="Search students by name or email..."
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

                                    {/* Loading state */}
                                    {loading ? (
                                        <div className="text-center my-5 py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <h5 className="mt-3">Loading students...</h5>
                                        </div>
                                    ) : error ? (
                                        /* Error state */
                                        <div className="text-center my-5 py-5">
                                            <div className="fs-1 text-danger mb-3">
                                                <i className="bi bi-exclamation-triangle-fill"></i>
                                            </div>
                                            <h5 className="mb-2">Error</h5>
                                            <p className="text-muted">{error}</p>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => window.location.reload()}
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    ) : currentStudents.length > 0 ? (
                                        /* Table */
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle border-bottom">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="py-3" style={{ width: '50%' }}>Student Name</th>
                                                        <th className="py-3" style={{ width: '50%' }}>Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentStudents.map((student) => (
                                                        <tr key={student.id} className="border-bottom">
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        className="avatar text-white d-flex align-items-center justify-content-center me-3"
                                                                        style={{
                                                                            width: '40px',
                                                                            height: '40px',
                                                                            borderRadius: '8px',
                                                                            background: `hsl(${(student.id * 31) % 360}, 70%, 60%)`,
                                                                            fontSize: '16px',
                                                                        }}
                                                                    >
                                                                        {student.name?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0">{student.name}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{student.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        /* Empty state */
                                        <div className="text-center my-5 py-5">
                                            <div className="fs-1 text-muted mb-3">
                                                <i className="bi bi-search"></i>
                                            </div>
                                            <h5 className="mb-2">No Students found</h5>
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
                                    {!loading && !error && currentStudents.length > 0 && (
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <p className="mb-0 text-muted">
                                                Showing{' '}
                                                <span className="fw-bold">
                                                    {sortedStudents.length > 0
                                                        ? `${indexOfFirstStudent + 1}-${Math.min(
                                                            indexOfLastStudent,
                                                            sortedStudents.length
                                                        )}`
                                                        : '0'}
                                                </span>{' '}
                                                of <span className="fw-bold">{sortedStudents.length}</span> students
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

export default UserList;