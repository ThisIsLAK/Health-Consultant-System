import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import LoginPrompt from '../../../components/LoginPrompt';
import ApiService from '../../../service/ApiService';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./SupportProgramHistory.css";

const SupportProgramHistory = () => {
    const [registeredPrograms, setRegisteredPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const programsPerPage = 6;

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchRegisteredPrograms();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchRegisteredPrograms = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getMySupportProgram();

            if (response.status === 200) {
                // Kiểm tra nếu response.data chứa result
                const programsData = Array.isArray(response.data.result) ? response.data.result : [response.data.result || response.data];
                setRegisteredPrograms(programsData.map(program => ({
                    programCode: program.programCode || '',
                    programName: program.programName || '',
                    description: program.description || '',
                    startDate: program.startDate || '',
                    endDate: program.endDate || ''
                })));
            } else {
                console.error("Failed to fetch support programs:", response.message);
                setRegisteredPrograms([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching registered programs:", error);
            setRegisteredPrograms([]);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        console.log("Formatting date:", dateString); // Thêm log để debug
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredPrograms = registeredPrograms.filter(program => {
        return program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            program.programCode.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastProgram = currentPage * programsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
    const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <LoginPrompt
                    featureName="program history"
                    title="View Your Program History"
                    message="Sign in to see all the support programs you've registered for and track your progress."
                    buttonText="Sign In to View History"
                />
                <Footer />
            </>
        );
    }

    return (
        <div className="history-page">
            <Navbar />
            <div className="history-hero">
                <div className="history-hero-content">
                    <h1>My Program History</h1>
                    <p>Track your journey through our support programs</p>
                    <div className="hero-search-container">
                        <input
                            type="text"
                            placeholder="Search your programs..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="hero-search-input"
                        />
                        <button className="hero-search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="history-main-content">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading your program history...</p>
                    </div>
                ) : (
                    <>
                        <div className="history-header-section">
                            <h2>Your Registered Programs</h2>
                            <p className="history-count">{filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}</p>
                        </div>

                        {filteredPrograms.length === 0 ? (
                            <div className="no-programs">
                                <p>No registered programs found matching your criteria.</p>
                                <Link to="/support" className="browse-programs-link">Browse Available Programs</Link>
                            </div>
                        ) : (
                            <>
                                <div className="history-grid">
                                    {currentPrograms.map((program) => {
                                        console.log("Rendering program:", program); // Thêm log để debug
                                        return (
                                            <div key={program.programCode} className="history-card">
                                                <div className="history-card-header">
                                                    <h3>{program.programName}</h3>
                                                </div>
                                                <div className="history-card-body">
                                                    <p className="program-description">
                                                        {program.description && program.description.length > 120
                                                            ? `${program.description.substring(0, 120)}...`
                                                            : program.description || "No description available."}
                                                    </p>
                                                    <div className="program-meta">
                                                        <div className="meta-item">
                                                            <span className="meta-label">Start Date:</span>
                                                            <span className="meta-value">{formatDate(program.startDate)}</span>
                                                        </div>
                                                        <div className="meta-item">
                                                            <span className="meta-label">End Date:</span>
                                                            <span className="meta-value">{formatDate(program.endDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>                                               
                                            </div>
                                        );
                                    })}
                                </div>
                                {filteredPrograms.length > programsPerPage && (
                                    <div className="pagination-container-mui">
                                        <div className="pagination-info">
                                            Showing {currentPrograms.length > 0 ? `${indexOfFirstProgram + 1}-${Math.min(indexOfLastProgram, filteredPrograms.length)}` : "0"} of {filteredPrograms.length} programs
                                        </div>
                                        <Stack spacing={2}>
                                            <Pagination
                                                count={Math.ceil(filteredPrograms.length / programsPerPage)}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                size="large"
                                                showFirstButton
                                                showLastButton
                                                siblingCount={1}
                                                className="mui-pagination"
                                            />
                                        </Stack>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SupportProgramHistory;