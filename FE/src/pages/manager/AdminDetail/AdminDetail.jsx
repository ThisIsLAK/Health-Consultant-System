import React from 'react';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';
import PageTitle from '../../../component/manager/PageTitle';

const AdminDetail = () => {
  return (
    <div>
      <ManagerHeader />
      <ManagerSidebar />

      <main id="main" className="main">
        <PageTitle page="Admin Details" />

        <section className="section dashboard">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body pt-3">
                  {/* Header with admin info */}
                  <div className="row mb-4">
                    <div className="col-md-6 col-sm-6 mb-3 mb-md-0">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="avatar text-white d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '8px',
                                background: `hsl(${1 * 31 % 360}, 70%, 60%)`, // Static ID-based color
                                fontSize: '20px',
                              }}
                            >
                              T {/* First letter of "Tran Binh Nam" */}
                            </div>
                            <div>
                              <h2 className="mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                Tran Binh Nam
                              </h2>
                              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                Admin ID: SE****
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Details */}
                  <div className="card shadow-sm mb-4">
                    <div className="card-body p-3">
                      <h3 className="mb-3" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Account Details
                      </h3>
                      <div className="detail-row mb-3 d-flex align-items-center">
                        <i className="bi bi-person-fill me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                        <label style={{ width: '150px', fontWeight: '500' }}>Role:</label>
                        <span>Admin</span>
                      </div>
                      <div className="detail-row mb-3 d-flex align-items-center">
                        <i className="bi bi-calendar-fill me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                        <label style={{ width: '150px', fontWeight: '500' }}>Since:</label>
                        <span>01/01/2025</span>
                      </div>
                      <div className="detail-row mb-3 d-flex align-items-center">
                        <i className="bi bi-envelope-fill me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                        <label style={{ width: '150px', fontWeight: '500' }}>Personal Email:</label>
                        <span>abc@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDetail;