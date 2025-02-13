import React from "react";
import "./NoticePage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const notices = [
  { date: "March 10, 2024", title: "New Stress Test Available!", description: "We have added a new stress assessment test for students." },
  { date: "March 8, 2024", title: "Appointment Slots Open", description: "New counseling slots available for next week." },
  { date: "March 5, 2024", title: "System Maintenance", description: "Our platform will undergo maintenance on March 15, 2024." },
];

const NoticePage = () => (
  <div>
    <Navbar/>
    <div className="notice-container">
      <div className="notice-header">
        <h1>Latest Announcements</h1>
        <p>Stay updated with our latest news and program updates.</p>
      </div>
      <div className="notice-content">
        <h2>Recent Notices</h2>
        <div className="notice-grid">
          {notices.map((notice, index) => (
            <div key={index} className="notice-card">
              <p className="notice-date">{notice.date}</p>
              <h3>{notice.title}</h3>
              <p>{notice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
  </div>
);

export default NoticePage;
