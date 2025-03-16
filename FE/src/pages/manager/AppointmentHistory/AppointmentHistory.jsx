import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { Pagination, InputGroup, FormControl } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import { FaEye } from 'react-icons/fa';
import ApiService from '../../../service/ApiService'; // Import ApiService

const AppointmentHistory = () => {
    const itemsPerPage = 12;
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Gọi API để lấy danh sách appointments khi component được mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await ApiService.getAllAppointments();
                console.log('API Response:', response); // Log để kiểm tra cấu trúc dữ liệu
                if (response.status === 200 && response.data && Array.isArray(response.data.result)) {
                    setAppointments(response.data.result); // Lấy mảng từ result
                } else {
                    console.error("Unexpected data format or failed to fetch appointments:", response);
                    setAppointments([]); // Đặt mảng rỗng nếu không đúng định dạng
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setAppointments([]); // Đặt mảng rỗng nếu có lỗi
            }
        };

        fetchAppointments();
    }, []); // Dependency array rỗng để chỉ gọi 1 lần khi component mount

    const indexOfLastAppointment = currentPage * itemsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    // Hàm định dạng ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }); // Định dạng thành "16/03/2025"
    };

    // CSS styles for table headers
    const tableHeaderStyle = {
        fontSize: '0.85rem',      // Reduced font size
        padding: '0.5rem',        // Reduced padding
        width: 'auto',            // Auto width to match content
        textAlign: 'left',        // Left align text (changed from center)
        whiteSpace: 'nowrap',     // Prevent text wrapping
        verticalAlign: 'middle',  // Vertical alignment
        paddingLeft: '0.75rem'    // Add left padding to shift text left
    };

    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="Appointment History" />
                <div className="user-table-container">
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Search for an appointment..." aria-label="Search" />
                        <InputGroup.Text>{`Showing ${appointments.length} appointment(s)`}</InputGroup.Text>
                    </InputGroup>
                    <div className="table-responsive">
                        <table className="table table-borderless datatable">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" style={tableHeaderStyle}>Psychologist Id</th>
                                    <th scope="col" style={tableHeaderStyle}>Appointment Id</th>
                                    <th scope="col" style={tableHeaderStyle}>User Id</th>
                                    <th scope="col" style={tableHeaderStyle}>Appointment Date</th>
                                    <th scope="col" style={tableHeaderStyle}>Time Slot</th>
                                    <th scope="col" style={tableHeaderStyle}>Status</th>
                                    <th scope="col" style={tableHeaderStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment, index) => (
                                    <tr key={appointment.appointmentId || index}>
                                        <td>{appointment.psychologistId || 'N/A'}</td>
                                        <td>{appointment.appointmentId || 'N/A'}</td>
                                        <td>{appointment.userId || 'N/A'}</td>
                                        <td>{formatDate(appointment.appointmentDate) || 'N/A'}</td>
                                        <td>{appointment.timeSlot || 'N/A'}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                {appointment.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <FaEye
                                                onClick={() => navigate('/appdetails')}
                                                className="custom-icon text-dark"
                                                style={{ cursor: 'pointer' }}
                                                title="View Detail"
                                            />
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

export default AppointmentHistory;