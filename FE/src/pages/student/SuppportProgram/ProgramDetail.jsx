import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProgramDetail.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

// Mock data - replace with actual API call in production
const programDetails = {
  "one-on-one-counseling": {
    id: 1,
    title: "One-on-One Counseling",
    description: "Schedule a session with a professional psychologist.",
    fullDescription: "Our one-on-one counseling sessions provide a safe, confidential space for you to discuss your concerns with a licensed professional. Each session is tailored to your specific needs, helping you develop coping strategies and improve your mental wellbeing.",
    duration: "50 minutes per session",
    availability: "Monday-Friday, 9:00 AM - 5:00 PM",
    location: "Student Wellness Center, Room 204",
    benefits: [
      "Personalized attention and support",
      "Confidential environment",
      "Evidence-based therapeutic approaches",
      "Flexible scheduling options"
    ],
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  "group-support": {
    id: 2,
    title: "Group Support",
    description: "Join support groups to discuss mental health topics.",
    fullDescription: "Our group support sessions bring together students facing similar challenges in a supportive, facilitated environment. These groups offer a unique opportunity to connect with peers, share experiences, and learn from others.",
    duration: "90 minutes per session",
    availability: "Tuesdays and Thursdays, 6:00 PM - 7:30 PM",
    location: "Student Center, Conference Room B",
    benefits: [
      "Sense of community and belonging",
      "Peer support and understanding",
      "Learn from others' experiences",
      "Develop social skills in a safe environment"
    ],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"
  },
  "self-help-resources": {
    id: 3,
    title: "Self-Help Resources",
    description: "Access blogs, e-books, and mindfulness exercises.",
    fullDescription: "Our comprehensive collection of self-help resources is designed to support you whenever and wherever you need it. From guided meditations to informative articles and workbooks, these tools can help you build resilience and improve your wellbeing at your own pace.",
    duration: "Self-paced",
    availability: "24/7 online access",
    location: "Digital platform",
    benefits: [
      "Access anytime, anywhere",
      "Learn at your own pace",
      "Wide variety of topics and formats",
      "Evidence-based content from mental health experts"
    ],
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"
  }
};

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  const program = programDetails[programId];

  useEffect(() => {
    if (!program) {
      navigate("/support");
    }
  }, [program, navigate]);

  if (!program) return null;

  const handleBookAppointment = () => {
    // Navigate to booking page with program ID as parameter
    navigate(`/booking/${programId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="program-detail-container">
        <div className="program-detail-header">
          <h1>{program.title}</h1>
          <p className="program-detail-subtitle">{program.description}</p>
        </div>

        <div className="program-detail-content">
          <div className="program-detail-info">
            <div className="program-detail-image">
              <img src={program.image} alt={program.title} />
            </div>
            <div className="program-detail-text">
              <h2>About This Program</h2>
              <p>{program.fullDescription}</p>
              
              <div className="program-detail-specs">
                <div className="spec-item">
                  <h3>Duration</h3>
                  <p>{program.duration}</p>
                </div>
                <div className="spec-item">
                  <h3>Availability</h3>
                  <p>{program.availability}</p>
                </div>
                <div className="spec-item">
                  <h3>Location</h3>
                  <p>{program.location}</p>
                </div>
              </div>
              
              <h3>Benefits</h3>
              <ul className="benefits-list">
                {program.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="program-booking">
            <h2>Interested in this program?</h2>
            <p>Book an appointment to get started. You'll be able to select a date and time slot that works for you.</p>
            <button 
              className="book-button"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
          </div>
        </div>
        
        <div className="back-to-programs">
          <button onClick={() => navigate("/support")}>
            ← Back to all programs
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProgramDetail;
