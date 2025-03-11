import React from 'react'
import './PsychologistHeader.css'

const PsychologistHeader = () => {
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    };

  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
        <div className='d-flex align-items-center justify-content-between'>           
            <i className='bi bi-list toggle-sidebar-btn' onClick={handleToggleSidebar}>
            </i>        
        </div>

        <nav className='header-nav ms-auto'>
        <ul className='d-flex items-center'>
          <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-bell"></i>
              <span className="badge bg-primary badge-number">4</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
              <li className="dropdown-header">
                You have 4 new notifications
                <a href="#">
                  <span className="badge rounded-pill bg-primary p-2 ms-2">
                    View all
                  </span>
                </a>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="notification-item">
                <i className="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>bla bla bla</p>
                  <p>30 min. ago</p>
                </div>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="notification-item">
                <i className="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>bla bla bla</p>
                  <p>30 min. ago</p>
                </div>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="notification-item">
                <i className="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>bla bla bla</p>
                  <p>30 min. ago</p>
                </div>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="notification-item">
                <i className="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>bla bla bla</p>
                  <p>30 min. ago</p>
                </div>
              </li>  
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default PsychologistHeader
