import React, { useState, useEffect } from 'react';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import { Pagination, InputGroup, FormControl, Dropdown, Spinner, Alert, Button } from 'react-bootstrap';
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
                // Ensure we have an array of users
                const usersData = Array.isArray(response.data) ? response.data : [];
                
                console.log("Processed users data:", usersData);
                setUsers(usersData);
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

    // Hàm xử lý ban/unban user
    const handleBanUnban = (user) => {
        const updatedUsers = users.map((u) =>
            u.id === user.id ? { ...u, status: !u.status } : u
        );
        setUsers(updatedUsers);
        toast.success(`${user.status ? 'Banned' : 'Unbanned'} successfully!`);
    };

    // Hàm xử lý xóa user
    const handleDeleteUser = (user) => {
        const updatedUsers = users.filter((u) => u.id !== user.id);
        setUsers(updatedUsers);
        toast.success('User deleted successfully!');
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
            
            // Check if role is an object with roleName property
            if (typeof u.role === 'object' && u.role.roleName) {
                return u.role.roleName.toUpperCase() === roleFilter.toUpperCase();
            }
            
            // If role is a string
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
        const classroomMatches = u.classroom ? u.classroom.toLowerCase().includes(lowerSearch) : false;
        
        return nameMatches || firstNameMatches || lastNameMatches || emailMatches || idMatches || classroomMatches;
    }) : [];

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Helper function to get user's full name - with null handling
    const getUserName = (user) => {
        if (!user) return 'Unknown';
        if (user.name) return user.name;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'Unknown';
    };

    // Helper function to get user's role name - with null handling
    const getUserRole = (user) => {
        if (!user) return 'Unknown';
        if (!user.role) return 'Unknown';
        
        // Check if role is an object with a roleName property
        if (typeof user.role === 'object' && user.role !== null) {
            return user.role.roleName || 'Unknown';
        }
        
        // If role is a string
        return String(user.role) || 'Unknown';
    };

    // Helper function to determine user status - with null handling
    const getUserStatus = (user) => {
        if (!user) return false;
        return user.active !== undefined ? user.active : 
               (user.status !== undefined ? user.status : true);
    };

    // Map role filter options to match API data
    const roleFilterOptions = [
        { key: 'All', label: 'All' },
        { key: 'ADMIN', label: 'Admin' },
        { key: 'PSYCHOLOGIST', label: 'Psychologist' },
        { key: 'MANAGER', label: 'Manager' },
        { key: 'STUDENT', label: 'Student' },
        { key: 'PARENT', label: 'Parent' }
    ];

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page='User List' />

                <div className="user-table-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center" style={{ width: '60%' }}>
                            <InputGroup>
                                <FormControl
                                    placeholder="Search by name, email or ID..."
                                    aria-label="Search"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </InputGroup>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button 
                                variant="success" 
                                onClick={handleAddUserClick} 
                                className="me-2"
                                title="Add New User"
                            >
                                <FaUserPlus /> Add User
                            </Button>
                            <Dropdown onSelect={(eventKey) => { setRoleFilter(eventKey); setCurrentPage(1); }}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {roleFilter === 'All' ? 'Filter by Role' : 
                                    roleFilterOptions.find(opt => opt.key === roleFilter)?.label || roleFilter}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {roleFilterOptions.map(option => (
                                        <Dropdown.Item key={option.key} eventKey={option.key}>
                                            {option.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading users...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            {error}. <Alert.Link onClick={fetchUsers}>Try again</Alert.Link>
                        </Alert>
                    ) : (
                        <>
                            <div className="mb-3">
                                <span>{`Showing ${filteredUsers.length} user(s)`}</span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-borderless datatable">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <tr key={user.id || Math.random()}>
                                                    <th scope="row">
                                                        <a href="#" className="custom-link">
                                                            {user.id || 'Unknown'}
                                                        </a>
                                                    </th>
                                                    <td>{getUserName(user)}</td>
                                                    <td>{user.email || 'Unknown'}</td>
                                                    <td>{getUserRole(user)}</td>
                                                    <td>
                                                        <span className={`badge bg-${getUserStatus(user) ? 'success' : 'danger'}`}>
                                                            {getUserStatus(user) ? 'Active' : 'Banned'}
                                                        </span>
                                                    </td>
                                                    <td className="d-flex align-items-center">
                                                        <FaEye
                                                            onClick={() => navigate(`/userdetail/${encodeURIComponent(user.email || '')}`)}
                                                            className="custom-icon me-3 text-dark"
                                                            style={{ cursor: 'pointer' }}
                                                            title="View Detail"
                                                        />
                                                        <Dropdown align="end">
                                                            <Dropdown.Toggle variant="link" className="custom-button three-dots p-0 text-decoration-none text-dark">
                                                                &#8942;
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handleBanUnban(user)}>
                                                                    {getUserStatus(user) ? 'Ban' : 'Unban'}
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleDeleteUser(user)} className="text-danger">
                                                                    Delete
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
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
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminUserList;
