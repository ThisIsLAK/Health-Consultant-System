import React from 'react'
import RecentAppointmentsTable from '../RecentAppointmentsTable/RecentAppointmentsTable'

const RecentAppointment = () => {

  return (
    <div className='card recent-sales overflow-auto'>
      <div className="card-body">
        <h5 className="card-title">
            Recent Appointments
        </h5>
        <RecentAppointmentsTable/>
      </div>
    </div>
  )
}

export default RecentAppointment
