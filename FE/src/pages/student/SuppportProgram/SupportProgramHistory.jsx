import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import Sidebar from "../UserInfo/Sidebar"; // Assuming Sidebar is available
import LoginPrompt from "../../../components/LoginPrompt";
import ApiService from "../../../service/ApiService";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./SupportProgramHistory.css";

const SupportProgramHistory = () => {
    const [registeredPrograms, setRegisteredPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const programsPerPage = 4; // Limit to 4 cards per page

    useEffect(() => {
        const token = localStorage.getItem("token");
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
                const programsData = Array.isArray(response.data.result)
                    ? response.data.result
                    : [response.data.result || response.data];
                setRegisteredPrograms(
                    programsData.map((program) => ({
                        programCode: program.programCode || "",
                        programName: program.programName || "",
                        description: program.description || "",
                        startDate: program.startDate || "",
                        endDate: program.endDate || "",
                    }))
                );
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
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredPrograms = registeredPrograms.filter(
        (program) =>
            program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (program.description &&
                program.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            program.programCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProgram = currentPage * programsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
    const currentPrograms = filteredPrograms.slice(
        indexOfFirstProgram,
        indexOfLastProgram
    );

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
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                <Sidebar activeItem="support-programs" />
                <div className="profile-content">
                    <div className="profile-header-card">
                        <div className="appointment-history-header">
                            <h1>My Program History</h1>
                            <p>Track your journey through our support programs</p>
                        </div>
                        <div className="filter-controls">
                            <input
                                type="text"
                                placeholder="Search your programs..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="hero-search-input"
                            />
                        </div>
                        <div className="actions-bar">
                            <Link to="/support" className="new-appointment-btn">
                                <i className="fas fa-plus-circle"></i> Browse Programs
                            </Link>
                        </div>
                    </div>

                    <div className="profile-card appointments-card">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading your program history...</p>
                            </div>
                        ) : filteredPrograms.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="far fa-calendar"></i>
                                </div>
                                <h3>No programs found</h3>
                                <p>No registered programs match your criteria.</p>
                                <Link to="/support" className="book-now-btn">
                                    Browse Available Programs
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="program-grid">
                                    {currentPrograms.map((program) => (
                                        <div key={program.programCode} className="program-card">
                                            <div className="program-card-header">
                                                <h3>{program.programName}</h3>
                                            </div>
                                            <div className="program-card-body">
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
                                    ))}
                                </div>
                                {filteredPrograms.length > programsPerPage && (
                                    <div className="pagination-container-mui">
                                        <div className="pagination-info">
                                            Showing{" "}
                                            {currentPrograms.length > 0
                                                ? `${indexOfFirstProgram + 1}-${Math.min(
                                                    indexOfLastProgram,
                                                    filteredPrograms.length
                                                )}`
                                                : "0"}{" "}
                                            of {filteredPrograms.length} programs
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
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SupportProgramHistory;