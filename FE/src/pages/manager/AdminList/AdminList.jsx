import React, { useState } from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import PageTitle from '../../../component/manager/PageTitle';
import { Pagination, InputGroup, FormControl, Button } from 'react-bootstrap';

const AdminList = () => {
  const itemsPerPage = 10; // Aligned with previous updates
  const mockAdmins = [
    { id: 1, name: 'Nguyen Minh Hoang', email: 'admin@example.com', status: true },
    { id: 2, name: 'Tran Binh Nam', email: 'tranbinhnam@example.com', status: true },
    { id: 3, name: 'Le Thi Hong', email: 'lethihong@example.com', status: true },
    { id: 4, name: 'Pham Van Anh', email: 'phamvananh@example.com', status: true },
    { id: 5, name: 'Hoang Duc Minh', email: 'hoangducminh@example.com', status: true },
    { id: 6, name: 'Nguyen Thi Lan', email: 'nguyenthilan@example.com', status: true },
    { id: 7, name: 'Vu Quang Huy', email: 'vuquanghuy@example.com', status: true },
    { id: 8, name: 'Doan Minh Tu', email: 'doanminhtu@example.com', status: true },
    { id: 9, name: 'Bui Thi Mai', email: 'buithimai@example.com', status: true },
    { id: 10, name: 'Trinh Van Long', email: 'trinhvanlong@example.com', status: true },
    { id: 11, name: 'Dang Thi Hoa', email: 'dangthihoa@example.com', status: true },
    { id: 12, name: 'Ngo Van Khoa', email: 'ngovankhoa@example.com', status: true },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState(mockAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter admins based on search term
  const filteredAdmins = admins.filter((admin) => {
    if (searchTerm === '') return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      admin.name.toLowerCase().includes(lowerSearch) ||
      admin.email.toLowerCase().includes(lowerSearch)
    );
  });

  // Sort admins by name
  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const indexOfLastAdmin = currentPage * itemsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage;
  const currentAdmins = sortedAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <ManagerHeader />
      <ManagerSidebar />

      <main id="main" className="main">
        <PageTitle page="Admin List" />

        <section className="section dashboard">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body pt-3">
                  {/* Header with total admins */}
                  <div className="row mb-4">
                    <div className="col-md-6 col-sm-6 mb-3 mb-md-0">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3 bg-primary-light rounded-circle p-3">
                              <i className="bi bi-people-fill text-primary fs-4"></i>
                            </div>
                            <div>
                              <h6 className="mb-0">Total Admins</h6>
                              <h4 className="mb-0">{admins.length}</h4>
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
                              placeholder="Search admins by name or email..."
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
                  {currentAdmins.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle border-bottom">
                        <thead className="bg-light">
                          <tr>
                            <th className="py-3" style={{ width: '50%' }}>Admin Name</th>
                            <th className="py-3" style={{ width: '50%' }}>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAdmins.map((admin) => (
                            <tr key={admin.id} className="border-bottom">
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="avatar text-white d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '8px',
                                      background: `hsl(${(admin.id * 31) % 360}, 70%, 60%)`,
                                      fontSize: '16px',
                                    }}
                                  >
                                    {admin.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{admin.name}</h6>
                                  </div>
                                </div>
                              </td>
                              <td>{admin.email}</td>
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
                      <h5 className="mb-2">No admins found</h5>
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
                  {currentAdmins.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <p className="mb-0 text-muted">
                        Showing{' '}
                        <span className="fw-bold">
                          {sortedAdmins.length > 0
                            ? `${indexOfFirstAdmin + 1}-${Math.min(indexOfLastAdmin, sortedAdmins.length)}`
                            : '0'}
                        </span>{' '}
                        of <span className="fw-bold">{sortedAdmins.length}</span> admins
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

export default AdminList;