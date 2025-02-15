import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import { Pagination, InputGroup, FormControl, Dropdown, Button } from 'react-bootstrap';
import PageTitle from '../../../component/manager/PageTitle';
import { FaEye } from 'react-icons/fa';
import RemoveAdminModal from '../AddtionalSections/RemoveAdminModal/RemoveAdminModal';
import { toast } from 'react-toastify';

const AdminList = () => {
  const itemsPerPage = 10;
  const navigate = useNavigate();


  // Only one mock admin
  const mockAdmin = [
    { id: 1, name: 'Nguyen Minh Hoang', email: 'admin@example.com', status: true }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState(mockAdmin);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalAction, setModalAction] = useState('ban'); // 'ban' or 'unban'

  const handleStatusAction = (reason) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === selectedAdmin.id
        ? { ...admin, status: !admin.status }
        : admin
    );
    setAdmins(updatedAdmins);
    setShowStatusModal(false);
    setSelectedAdmin(null);
    toast.success(`Admin ${modalAction === 'ban' ? 'banned' : 'unbanned'} successfully!`);
  };

  const handleStatusClick = (admin) => {
    setSelectedAdmin(admin);
    setModalAction(admin.status ? 'ban' : 'unban');
    setShowStatusModal(true);
  };

  return (
    <div>
      <ManagerHeader />
      <ManagerSidebar />

      <main id="main" className="main">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <PageTitle page="Admin List" />
          <Button
            onClick={() => navigate('/addadmin')}
            className="add-staff-button"
            style={{ textTransform: 'none', backgroundColor: '#6c63ff' }}
          >
            Add an Admin
          </Button>
        </div>

        <div className="user-table-container">
          <InputGroup className="mb-3">
            <FormControl placeholder="Search for an admin..." aria-label="Search" />
            <InputGroup.Text>{`Showing ${admins.length} admin`}</InputGroup.Text>
          </InputGroup>

          <div className="table-responsive">
            <table className="table table-borderless datatable">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Admin Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <th scope="row">
                      <a href="#" className="custom-link">
                        {admin.id}
                      </a>
                    </th>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <span className={`badge bg-${admin.status ? 'success' : 'danger'}`}>
                        {admin.status ? 'Working' : 'Banned'}
                      </span>
                    </td>
                    <td className="d-flex align-items-center">
                      <FaEye
                        onClick={() => navigate('/admindetails')}
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
                          <Dropdown.Item
                            onClick={() => navigate('/editadmin')}
                          >
                            Edit Profile
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => handleStatusClick(admin)}
                          >
                            {admin.status ? 'Ban Admin' : 'Unban Admin'}
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
            <Pagination.Item active>{1}</Pagination.Item>
          </Pagination>

          <RemoveAdminModal
            show={showStatusModal}
            handleClose={() => setShowStatusModal(false)}
            handleAction={handleStatusAction}
            actionType={modalAction}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminList;
