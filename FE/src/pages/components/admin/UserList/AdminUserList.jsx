import React, { useState, useEffect } from 'react';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import { Pagination, InputGroup, FormControl, Dropdown, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaEye, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../../../service/ApiService';

const AdminUserList = () => {
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ApiService.getAllUsers();
            if (response.status === 200) {
                // Handle the new API response format with code, message, result
                if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
                    console.log("Processed users data:", response.data.result);
                    setUsers(response.data.result);
                } else if (Array.isArray(response.data)) {
                    // Fallback for old format
                    console.log("Processed users data (old format):", response.data);
                    setUsers(response.data);
                } else {
                    throw new Error('Invalid data format received from API');
                }
            } else {
                setError(response.message || 'Failed to fetch users');
                toast.error(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            const errorMsg = 'An unexpected error occurred';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error("Error details:", err);
            // Set users to empty array to prevent filter errors
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa user
    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete user ${user.name || user.email}?`)) {
            try {
                const response = await ApiService.deleteUserById(user.id);
                
                if (response.status === 200) {
                    // Remove the user from the local state
                    const updatedUsers = users.filter((u) => u.id !== user.id);
                    setUsers(updatedUsers);
                    toast.success('User deleted successfully!');
                } else {
                    toast.error(response.message || 'Failed to delete user');
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error('An error occurred while deleting the user');
            }
        }
    };

    // Handler for Add User button
    const handleAddUserClick = () => {
        navigate('/createuser');
    };

    // Lọc users theo role và tìm kiếm - with safeguards
    const filteredUsers = Array.isArray(users) ? users.filter((u) => {
        if (!u) return false;
        
        // Handle role object structure
        const roleMatches = () => {
            if (roleFilter === 'All') return true;
            
            if (!u.role) return false;
            
            // Check if role is an object with roleName property (new schema)
            if (typeof u.role === 'object' && u.role.roleName) {
                return u.role.roleName.toUpperCase() === roleFilter.toUpperCase();
            }
            
            // If role is a string (old schema)
            if (typeof u.role === 'string') {
                return u.role.toUpperCase() === roleFilter.toUpperCase();
            }
            
            return false;
        };
        
        if (!roleMatches()) return false;
        
        if (searchTerm === '') return true;
        
        const lowerSearch = searchTerm.toLowerCase();
        const nameMatches = u.name ? u.name.toLowerCase().includes(lowerSearch) : false;
        const firstNameMatches = u.firstName ? u.firstName.toLowerCase().includes(lowerSearch) : false;
        const lastNameMatches = u.lastName ? u.lastName.toLowerCase().includes(lowerSearch) : false;
        const emailMatches = u.email ? u.email.toLowerCase().includes(lowerSearch) : false;
        const idMatches = u.id ? String(u.id).includes(lowerSearch) : false;
        
        return nameMatches || firstNameMatches || lastNameMatches || emailMatches || idMatches;
    }) : [];

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;

    // Helper function to get user's name
    const getUserName = (user) => {
        if (!user) return 'Unknown';
        if (user.name) return user.name;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'Unknown';
    };

    // Helper function to get user's role name
    const getUserRole = (user) => {
        if (!user) return 'Unknown';
        if (!user.role) return 'Unknown';
        
        // Check if role matches the new schema
        if (typeof user.role === 'object' && user.role !== null) {
            return user.role.roleName || 'Unknown';
        }
        
        // If role is a string
        return String(user.role) || 'Unknown';
    };

    // Helper function to determine user status
    const getUserStatus = (user) => {
        if (!user) return false;
        
        // New schema has direct active property as boolean
        if (user.active !== undefined) {
            return user.active === true || user.active === 1;
        }
        
        // Fallback to status for backward compatibility
        return user.status !== undefined ? user.status : true;
    };

    // Map role filter options to match API data
    const roleFilterOptions = [
        { key: 'All', label: 'All' },
        { key: 'ADMIN', label: 'Admin' },
        { key: 'PSYCHOLOGIST', label: 'Psychologist' },
        { key: 'MANAGER', label: 'Manager' },
        { key: 'USER', label: 'Student' },
        { key: 'PARENT', label: 'Parent' }
    ];

    // Remove status filter
    // const [statusFilter, setStatusFilter] = useState('All');
    // const statusOptions = [
    //     { key: 'All', label: 'All Status' },
    //     { key: 'Active', label: 'Active' },
    //     { key: 'Inactive', label: 'Inactive' }
    // ];

    // Final filtered users without status filtering
    const finalFilteredUsers = filteredUsers;

    // Sort users by name
    const [sortOrder, setSortOrder] = useState('asc');
    const sortedUsers = [...finalFilteredUsers].sort((a, b) => {
        const nameA = getUserName(a).toLowerCase();
        const nameB = getUserName(b).toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    // Get role-specific color
    const getRoleBadgeColor = (role) => {
        const roleStr = String(role).toUpperCase();
        switch (roleStr) {
            case 'ADMIN': return 'danger';
            case 'PSYCHOLOGIST': return 'success';
            case 'MANAGER': return 'warning';
            case 'USER': return 'info';
            case 'PARENT': return 'primary';
            default: return 'secondary';
        }
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page='User Management' />

                <section className="section dashboard">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Header with simplified stats - removed active/inactive counts */}
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-sm-6 mb-3 mb-md-0">
                                            <div className="card border-0 bg-light">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-3 bg-primary-light rounded-circle p-3">
                                                            <i className="bi bi-people-fill text-primary fs-4"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">Total Users</h6>
                                                            <h4 className="mb-0">{users.length}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <div className="card h-100 border-0 bg-primary bg-opacity-10 border-start border-5 border-primary">
                                                <div className="card-body d-flex flex-column justify-content-center">
                                                    <h6 className="text-primary mb-2">Need to add a new user?</h6>
                                                    <Button 
                                                        variant="primary" 
                                                        className="d-flex align-items-center justify-content-center"
                                                        onClick={handleAddUserClick}
                                                    >
                                                        <FaUserPlus className="me-2" /> Add New User
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search and filter section */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-body p-3">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-white">
                                                            <i className="bi bi-search"></i>
                                                        </InputGroup.Text>
                                                        <FormControl
                                                            placeholder="Search users by name, email or ID..."
                                                            className="border-start-0"
                                                            value={searchTerm}
                                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                                                <div className="col-md-3">
                                                    <Dropdown onSelect={(eventKey) => { setRoleFilter(eventKey); setCurrentPage(1); }}>
                                                        <Dropdown.Toggle variant="white" className="w-100 text-start d-flex align-items-center justify-content-between border">
                                                            <span>
                                                                <i className="bi bi-filter me-2"></i>
                                                                {roleFilter === 'All' ? 'All Roles' : 
                                                                roleFilterOptions.find(opt => opt.key === roleFilter)?.label || roleFilter}
                                                            </span>
                                                            <i className="bi bi-chevron-down"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="w-100">
                                                            {roleFilterOptions.map(option => (
                                                                <Dropdown.Item key={option.key} eventKey={option.key}>
                                                                    {option.label}
                                                                </Dropdown.Item>
                                                            ))}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="col-md-2">
                                                    <Button 
                                                        variant="white" 
                                                        className="w-100 border d-flex align-items-center justify-content-between"
                                                        onClick={toggleSortOrder}
                                                    >
                                                        <span>
                                                            <i className="bi bi-sort-alpha-down me-2"></i>
                                                            Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                                        </span>
                                                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                    </Button>
                                                </div>
                                                <div className="col-md-1">
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        className="w-100 h-100"
                                                        onClick={fetchUsers}
                                                        title="Refresh"
                                                    >
                                                        <i className="bi bi-arrow-clockwise"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center my-5 py-5">
                                            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3 text-muted">Loading users data...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <div>
                                                {error} <a href="#" onClick={(e) => { e.preventDefault(); fetchUsers(); }} className="alert-link">Try again</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="fs-6">
                                                    Showing <span className="fw-bold">{Math.min(sortedUsers.length, indexOfFirstUser + 1)}-{Math.min(indexOfLastUser, sortedUsers.length)}</span> of <span className="fw-bold">{sortedUsers.length}</span> users
                                                </span>
                                            </div>

                                            {currentUsers.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle border-bottom">
                                                        <thead className="bg-light">
                                                            <tr>
                                                                <th className="py-3" style={{width: "5%"}}>ID</th>
                                                                <th className="py-3" style={{width: "35%"}}>User</th>
                                                                <th className="py-3" style={{width: "30%"}}>Email</th>
                                                                <th className="py-3" style={{width: "15%"}}>Role</th>
                                                                <th className="py-3 text-center" style={{width: "15%"}}>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentUsers.map(user => (
                                                                <tr key={user.id || Math.random()} className="border-bottom">
                                                                    <td>{user.id || 'Unknown'}</td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="avatar text-white d-flex align-items-center justify-content-center me-3"
                                                                                style={{
                                                                                    width: '40px', 
                                                                                    height: '40px', 
                                                                                    borderRadius: '8px',
                                                                                    background: `hsl(${(user.id * 31) % 360}, 70%, 60%)`,
                                                                                    fontSize: '16px'
                                                                                }}>
                                                                                {getUserName(user).charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <h6 className="mb-0">{getUserName(user)}</h6>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>{user.email || 'No email'}</td>
                                                                    <td>
                                                                        <Badge bg={getRoleBadgeColor(getUserRole(user))} 
                                                                              className="rounded-pill px-3 py-2">
                                                                            {getUserRole(user)}
                                                                        </Badge>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex justify-content-center gap-2">
                                                                            <Button 
                                                                                variant="outline-primary" 
                                                                                size="sm"
                                                                                onClick={() => navigate(`/userdetail/${encodeURIComponent(user.email || '')}`)}
                                                                                title="View Details"
                                                                            >
                                                                                <FaEye />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="outline-danger" 
                                                                                size="sm"
                                                                                onClick={() => handleDeleteUser(user)}
                                                                                title="Delete User"
                                                                            >
                                                                                <i className="bi bi-trash"></i>
                                                                            </Button>
                                                                        </div>
                                                                    </td>
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
                                                    <h5 className="mb-2">No users found</h5>
                                                    <p className="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm" 
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            setRoleFilter('All');
                                                        }}
                                                    >
                                                        Clear all filters
                                                    </Button>
                                                </div>
                                            )}

                                            {totalPages > 1 && (
                                                <div className="d-flex justify-content-center mt-4">
                                                    <nav>
                                                        <ul className="pagination">
                                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(1)}>
                                                                    <i className="bi bi-chevron-double-left"></i>
                                                                </button>
                                                            </li>
                                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                                                    <i className="bi bi-chevron-left"></i>
                                                                </button>
                                                            </li>
                                                            
                                                            {totalPages <= 5 ? (
                                                                Array.from({ length: totalPages }, (_, i) => (
                                                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                                            {i + 1}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    {currentPage > 2 && (
                                                                        <li className="page-item">
                                                                            <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
                                                                        </li>
                                                                    )}
                                                                    
                                                                    {currentPage > 3 && (
                                                                        <li className="page-item disabled">
                                                                            <span className="page-link">...</span>
                                                                        </li>
                                                                    )}
                                                                    
                                                                    {currentPage > 1 && (
                                                                        <li className="page-item">
                                                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                                                                {currentPage - 1}
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    
                                                                    <li className="page-item active">
                                                                        <span className="page-link">{currentPage}</span>
                                                                    </li>
                                                                    
                                                                    {currentPage < totalPages && (
                                                                        <li className="page-item">
                                                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
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
                                                                            <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                                                                                {totalPages}
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                </>
                                                            )}
                                                            
                                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                                                    <i className="bi bi-chevron-right"></i>
                                                                </button>
                                                            </li>
                                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                                                                    <i className="bi bi-chevron-double-right"></i>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                            )}
                                        </>
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

export default AdminUserList;
