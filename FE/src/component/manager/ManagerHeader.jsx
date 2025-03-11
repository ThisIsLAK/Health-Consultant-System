import React from 'react'
import './ManagerHeader.css'

const ManagerHeader = () => {
  const handleToggleSidebar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };

  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
      <div className='d-flex align-items-center justify-content-between'>
        <i className='bi bi-list toggle-sidebar-btn' onClick={handleToggleSidebar}>
        </i>
      </div>
    </header>
  )
}

export default ManagerHeader
