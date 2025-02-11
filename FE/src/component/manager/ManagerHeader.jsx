import React from 'react'
import './ManagerHeader.css'

const ManagerHeader = () => {
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    };

  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
        <div className='d-flex align-items-center justify-content-between'>
            <a href="/" className='logo d-flex align-items-center'>
                <img src='/assets/company.png' alt="" />
            </a>
            <i className='bi bi-list toggle-sidebar-btn' onClick={handleToggleSidebar}>
            </i>        
        </div>
    </header>
  )
}

export default ManagerHeader
