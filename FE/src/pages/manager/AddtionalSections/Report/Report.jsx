import React, { useState, useEffect } from 'react';
import ReportCharts from '../ReportCharts/ReportCharts';
import ApiService from '../../../../service/ApiService';

const Report = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await ApiService.getManagerDashboardData();
        if (response.status === 200 && response.data) {
          setDashboardData(response.data);
        } else {
          console.error("Failed to fetch dashboard data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">Reports</h5>
        <p>Loading dashboard data...</p>
      </div>
    </div>;
  }

  return (
    <div className='card'>
      <div className="card-body">
        <h5 className="card-title">Reports</h5>
        
        {dashboardData && (
          <div className="row mb-4">
            {/* Appointment Summary Card */}
            <div className="col-md-4">
              <div className="card info-card sales-card">
                <div className="card-body">
                  <h5 className="card-title">Appointments</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div className="ps-3">
                      <h6>Total: {dashboardData.appointmentSummary.totalAppointments}</h6>
                      <span className="text-success small pt-1 fw-bold">
                        {dashboardData.appointmentSummary.completedAppointments}
                      </span> <span className="text-muted small pt-2 ps-1">completed</span>
                      <br/>
                      <span className="text-primary small pt-1 fw-bold">
                        {dashboardData.appointmentSummary.upcomingAppointments}
                      </span> <span className="text-muted small pt-2 ps-1">upcoming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Programs Card */}
            <div className="col-md-4">
              <div className="card info-card revenue-card">
                <div className="card-body">
                  <h5 className="card-title">Support Programs</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div className="ps-3">
                      <h6>Total: {dashboardData.supportProgramSummary.totalPrograms}</h6>
                      <span className="text-success small pt-1 fw-bold">
                        {dashboardData.supportProgramSummary.totalParticipants}
                      </span> <span className="text-muted small pt-2 ps-1">participants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Surveys Card */}
            <div className="col-md-4">
              <div className="card info-card customers-card">
                <div className="card-body">
                  <h5 className="card-title">Surveys</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-clipboard-check"></i>
                    </div>
                    <div className="ps-3">
                      <h6>Total: {dashboardData.surveySummary.totalSurveys}</h6>
                      <span className="text-success small pt-1 fw-bold">
                        {dashboardData.surveySummary.totalSurveyResults}
                      </span> <span className="text-muted small pt-2 ps-1">results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ReportCharts />
      </div>
    </div>
  );
};

export default Report;
