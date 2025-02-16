import React, { useState } from 'react'
import ReportCharts from '../ReportCharts/ReportCharts';

const Report = () => {

  return (
    <div className='card'>
      <div className="card-body">
        <h5 className="card-title">
            Reports
        </h5>
        <ReportCharts/>
      </div>
    </div>
  )
}

export default Report;
