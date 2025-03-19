import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApiService from '../../../../service/ApiService';

const ReportCharts = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Appointments',
                data: [0, 0, 0, 0]
            },
            {
                name: 'Programs',
                data: [0, 0, 0, 0]
            },
            {
                name: 'Surveys',
                data: [0, 0, 0, 0]
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            markers: {
                size: 4,
            },
            colors: ['#4154f1', '#2eca61', '#ff771d'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.3,
                    opacityTo: 0.4,
                    stops: [0, 90, 100],
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Total', 'Active/Completed', 'Cancelled/Participants', 'Upcoming/EndingSoon/AvgScore']
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
        },
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await ApiService.getManagerDashboardData();
                if (response.status === 200 && response.data) {
                    setDashboardData(response.data);
                    updateChartData(response.data);
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

    const updateChartData = (data) => {
        const { appointmentSummary, supportProgramSummary, surveySummary } = data;
        
        setChartData({
            ...chartData,
            series: [
                {
                    name: 'Appointments',
                    data: [
                        appointmentSummary.totalAppointments,
                        appointmentSummary.completedAppointments,
                        appointmentSummary.cancelledAppointments,
                        appointmentSummary.upcomingAppointments
                    ]
                },
                {
                    name: 'Programs',
                    data: [
                        supportProgramSummary.totalPrograms,
                        supportProgramSummary.activePrograms,
                        supportProgramSummary.totalParticipants,
                        supportProgramSummary.programsEndingSoon
                    ]
                },
                {
                    name: 'Surveys',
                    data: [
                        surveySummary.totalSurveys,
                        surveySummary.activeSurveys,
                        surveySummary.totalSurveyResults,
                        surveySummary.averageScore
                    ]
                }
            ],
            options: {
                ...chartData.options,
                title: {
                    text: 'Health Dashboard Overview',
                    align: 'center',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                subtitle: {
                    text: 'Appointments, Programs, and Surveys',
                    align: 'center'
                },
                xaxis: {
                    categories: [
                        'Total', 
                        'Completed/Active', 
                        'Cancelled/Participants/Results', 
                        'Upcoming/EndingSoon/AvgScore'
                    ]
                }
            }
        });
    };

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    return (
        <div>
            <h5 className="card-title">Activity Overview</h5>
            {dashboardData ? (
                <div>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type={chartData.options.chart.type}
                        height={chartData.options.chart.height}
                    />
                    <div className="mt-3">
                        <small className="text-muted">
                            <strong>Chart Legend:</strong><br/>
                            <span className="text-primary">• Appointments:</span> Total ({dashboardData.appointmentSummary.totalAppointments}), 
                                                             Completed ({dashboardData.appointmentSummary.completedAppointments}), 
                                                             Cancelled ({dashboardData.appointmentSummary.cancelledAppointments}), 
                                                             Upcoming ({dashboardData.appointmentSummary.upcomingAppointments})<br/>
                            <span className="text-success">• Programs:</span> Total ({dashboardData.supportProgramSummary.totalPrograms}), 
                                                         Active ({dashboardData.supportProgramSummary.activePrograms}), 
                                                         Participants ({dashboardData.supportProgramSummary.totalParticipants}), 
                                                         Ending Soon ({dashboardData.supportProgramSummary.programsEndingSoon})<br/>
                            <span className="text-warning">• Surveys:</span> Total ({dashboardData.surveySummary.totalSurveys}), 
                                                        Active ({dashboardData.surveySummary.activeSurveys}), 
                                                        Results ({dashboardData.surveySummary.totalSurveyResults}), 
                                                        Average Score ({dashboardData.surveySummary.averageScore})
                        </small>
                    </div>
                </div>
            ) : (
                <div>No dashboard data available</div>
            )}
        </div>
    );
};

export default ReportCharts;
