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
                categories: ['Total', 'Active', 'Completed/Canceled', 'Upcoming/Ending Soon']
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
                        appointmentSummary.activeAppointments,
                        appointmentSummary.cancelledAppointments,
                        appointmentSummary.upcomingAppointments
                    ]
                },
                {
                    name: 'Programs',
                    data: [
                        supportProgramSummary.totalPrograms,
                        supportProgramSummary.activePrograms,
                        0, // No "completed" data in API response
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
            ]
        });
    };

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    return (
        <div>
            {dashboardData ? (
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type={chartData.options.chart.type}
                    height={chartData.options.chart.height}
                />
            ) : (
                <div>No dashboard data available</div>
            )}
        </div>
    );
};

export default ReportCharts;
