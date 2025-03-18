import React from 'react';
import './ManagerDashboard.css';

import PageTitle from '../../../component/manager/PageTitle';
import Card from '../AddtionalSections/Card/Card';
import Report from '../AddtionalSections/Report/Report';
import RecentAppointment from '../AddtionalSections/RecentAppointment/RecentAppointment';
import ManagerHeader from '../../../component/manager/ManagerHeader';
import ManagerSidebar from '../../../component/manager/ManagerSidebar';

const ManagerDashboard = () => {
    return (
        <div>
            <ManagerHeader />
            <ManagerSidebar />
            <main id="main" className="main">
                <PageTitle page="Dashboard" />

                <section className="dashboard section">
                    <div className="row">
                        <div className="col-12">
                            <Report />
                        </div>
                        <div className="col-12">
                            <RecentAppointment />
                        </div>
                    </div>
                </section>
            </main>
        </div>

    );
};

export default ManagerDashboard;
