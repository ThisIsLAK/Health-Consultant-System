import React, { useState } from 'react';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import { Pagination, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminUserList = () => {
    const itemsPerPage = 12;
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'Patient', classroom: 'Class A', psychologist: 'Dr. Smith', status: true },
        { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', role: 'Admin', classroom: '-', psychologist: '-', status: true },
        { id: 3, name: 'Alice Johnson', email: 'alicej@example.com', role: 'Manager', classroom: 'Class B', psychologist: '-', status: false },
        { id: 4, name: 'Bob Brown', email: 'bobbrown@example.com', role: 'Psychologist', classroom: '-', psychologist: '-', status: true },
        { id: 5, name: 'Charlie White', email: 'charliew@example.com', role: 'Parents', classroom: 'Class C', psychologist: '-', status: false },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState(mockUsers);
    const [roleFilter, setRoleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

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

    // Lọc users theo role và tìm kiếm
    const filteredUsers = users.filter((u) => {
        const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === '' ||
            u.name.toLowerCase().includes(lowerSearch) ||
            String(u.id).includes(lowerSearch) ||
            (u.classroom && u.classroom.toLowerCase().includes(lowerSearch));
        return matchesRole && matchesSearch;
    });

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const navigate = useNavigate();

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page='User List' />

                <div className="user-table-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <InputGroup style={{ width: '60%' }}>
                            <FormControl
                                placeholder="Search by name, student code or classroom..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </InputGroup>
                        <Dropdown onSelect={(eventKey) => { setRoleFilter(eventKey); setCurrentPage(1); }}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {roleFilter === 'All' ? 'Filter by Role' : roleFilter}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                                <Dropdown.Item eventKey="Patient">Patient</Dropdown.Item>
                                <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                                <Dropdown.Item eventKey="Manager">Manager</Dropdown.Item>
                                <Dropdown.Item eventKey="Psychologist">Psychologist</Dropdown.Item>
                                <Dropdown.Item eventKey="Parents">Parents</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="mb-3">
                        <span>{`Showing ${filteredUsers.length} user(s)`}</span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-borderless datatable">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Classroom</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <th scope="row">
                                            <a href="#" className="custom-link">
                                                {user.id}
                                            </a>
                                        </th>
                                        <td>{user.name}</td>
                                        <td>{user.classroom}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span className={`badge bg-${user.status ? 'success' : 'danger'}`}>
                                                {user.status ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td className="d-flex align-items-center">
                                            <FaEye
                                                onClick={() => navigate('/userdetail')}
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
                                                        {user.status ? 'Ban' : 'Unban'}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDeleteUser(user)} className="text-danger">
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

export default AdminUserList;
