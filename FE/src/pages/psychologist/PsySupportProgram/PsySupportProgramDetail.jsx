import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PsySupportProgramDetail.css';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';

const PsySupportProgramDetail = () => {
  const { programCode } = useParams();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [surveyResults, setSurveyResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loadingParticipant, setLoadingParticipant] = useState(false);

  // Fetch program details using the updated endpoint
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/identity/psychologists/findprogrambycode/${programCode}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.result) {
          setProgram(response.data.result);
          // If program has participants, store them
          if (response.data.result.participants && Array.isArray(response.data.result.participants)) {
            setParticipants(response.data.result.participants);
          }
        } else {
          setError('Program details not found');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching program details:", err);
        setError("Failed to load program details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programCode]);

  // Function to fetch survey results for a participant
  const fetchSurveyResults = async (userId) => {
    if (surveyResults[userId]) {
      setSelectedParticipant(userId);
      return; // Already fetched results for this user
    }
    
    setLoadingParticipant(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/identity/psychologists/surveyresultsbyid/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.result) {
        // Store results in the state, indexed by userId
        setSurveyResults(prev => ({
          ...prev,
          [userId]: response.data.result
        }));
      }
      
      setSelectedParticipant(userId);
      setLoadingParticipant(false);
    } catch (err) {
      console.error(`Error fetching survey results for user ${userId}:`, err);
      setLoadingParticipant(false);
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate program status based on active flag and dates
  const getProgramStatus = () => {
    if (!program) return 'Unknown';
    
    // If the program has an active flag, use it as the primary indicator
    if (program.active === false) return 'Inactive';
    
    const now = new Date();
    const startDate = new Date(program.startDate);
    const endDate = new Date(program.endDate);
    
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Completed';
    return 'Active';
  };

  // Group survey questions by survey
  const groupSurveyResults = (results) => {
    if (!results || !Array.isArray(results)) return {};
    
    const grouped = {};
    
    results.forEach(answer => {
      if (!answer.surveyQuestion || !answer.surveyQuestion.survey) return;
      
      const surveyId = answer.surveyQuestion.survey.surveyId;
      const surveyTitle = answer.surveyQuestion.survey.title;
      
      if (!grouped[surveyId]) {
        grouped[surveyId] = {
          title: surveyTitle,
          description: answer.surveyQuestion.survey.description || '',
          answers: []
        };
      }
      
      grouped[surveyId].answers.push({
        questionText: answer.surveyQuestion.questionText,
        answerText: answer.surveyAnswerOption ? answer.surveyAnswerOption.optionText : 'No answer',
        score: answer.surveyAnswerOption ? answer.surveyAnswerOption.score : 0
      });
    });
    
    return grouped;
  };

  // Handle back button
  const handleBack = () => {
    navigate('/psysupport');
  };

  // Get user name
  const getUserName = (userId) => {
    const participant = participants.find(p => p.id === userId);
    return participant ? participant.name : `User ${userId}`;
  };

  return (
    <>
      <PsychologistHeader />
      <PsychologistSidebar />
      <div className="psy-program-detail-container">
        {loading ? (
          <div className="psy-loading-detail">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading program details...</p>
          </div>
        ) : error ? (
          <div className="psy-error-detail">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <p>{error}</p>
            <button className="psy-back-btn" onClick={handleBack}>
              Back to Programs
            </button>
          </div>
        ) : program ? (
          <>
            <div className="psy-program-detail-header">
              <button className="psy-back-btn" onClick={handleBack}>
                <i className="bi bi-arrow-left"></i> Back to Programs
              </button>
              <h1>{program.programName}</h1>
              <div className="psy-program-status">
                <span className={`status-badge status-${getProgramStatus().toLowerCase()}`}>
                  {getProgramStatus()}
                </span>
              </div>
            </div>

            <div className="psy-program-detail-tabs">
              <button 
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <i className="bi bi-info-circle"></i> Program Details
              </button>
              <button 
                className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                <i className="bi bi-people"></i> Participants ({participants.length})
              </button>
            </div>

            {activeTab === 'details' && (
              <div className="psy-program-detail-content">
                <div className="psy-detail-section">
                  <h3>Description</h3>
                  <p>{program.description || 'No description available.'}</p>
                </div>
                
                <div className="psy-detail-grid">
                  <div className="psy-detail-card">
                    <h3>Program Information</h3>
                    <div className="psy-detail-item">
                      <div className="psy-detail-label">
                        <i className="bi bi-calendar-event"></i> Start Date
                      </div>
                      <div className="psy-detail-value">
                        {formatDate(program.startDate)}
                      </div>
                    </div>
                    <div className="psy-detail-item">
                      <div className="psy-detail-label">
                        <i className="bi bi-calendar-check"></i> End Date
                      </div>
                      <div className="psy-detail-value">
                        {formatDate(program.endDate)}
                      </div>
                    </div>
                    <div className="psy-detail-item">
                      <div className="psy-detail-label">
                        <i className="bi bi-people"></i> Registered Users
                      </div>
                      <div className="psy-detail-value">
                        {program.registeredUsers || 0}
                      </div>
                    </div>
                    <div className="psy-detail-item">
                      <div className="psy-detail-label">
                        <i className="bi bi-code"></i> Program Code
                      </div>
                      <div className="psy-detail-value">
                        {program.programCode}
                      </div>
                    </div>
                    <div className="psy-detail-item">
                      <div className="psy-detail-label">
                        <i className="bi bi-toggle-on"></i> Status
                      </div>
                      <div className="psy-detail-value">
                        {program.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="psy-participants-content">
                <div className="psy-participants-container">
                  <div className="psy-participants-list">
                    <h3>Program Participants</h3>
                    
                    {participants.length === 0 ? (
                      <div className="psy-no-participants">
                        <i className="bi bi-people"></i>
                        <p>No participants have joined this program yet.</p>
                      </div>
                    ) : (
                      <div className="psy-participant-cards">
                        {participants.map(participant => (
                          <div 
                            key={participant.id} 
                            className={`psy-participant-card ${selectedParticipant === participant.id ? 'selected' : ''}`}
                            onClick={() => fetchSurveyResults(participant.id)}
                          >
                            <div className="psy-participant-info">
                              <div className="psy-participant-avatar">
                                <i className="bi bi-person-circle"></i>
                              </div>
                              <div className="psy-participant-details">
                                <h4>{participant.name}</h4>
                                <p>{participant.email}</p>
                              </div>
                            </div>
                            <div className="psy-view-results">
                              <i className="bi bi-clipboard-data"></i>
                              {surveyResults[participant.id] ? 'View Results' : 'Load Results'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="psy-survey-results">
                    <h3>Survey Results</h3>
                    
                    {!selectedParticipant ? (
                      <div className="psy-select-participant">
                        <i className="bi bi-arrow-left-circle"></i>
                        <p>Select a participant to view their survey results</p>
                      </div>
                    ) : loadingParticipant ? (
                      <div className="psy-loading-results">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading results...</p>
                      </div>
                    ) : !surveyResults[selectedParticipant] || surveyResults[selectedParticipant].length === 0 ? (
                      <div className="psy-no-results">
                        <i className="bi bi-clipboard-x"></i>
                        <p>No survey results found for {getUserName(selectedParticipant)}</p>
                      </div>
                    ) : (
                      <div className="psy-results-container">
                        <h4>Results for {getUserName(selectedParticipant)}</h4>
                        
                        {Object.entries(groupSurveyResults(surveyResults[selectedParticipant])).map(([surveyId, survey]) => (
                          <div key={surveyId} className="psy-survey-result-card">
                            <h5>{survey.title}</h5>
                            {survey.description && <p className="psy-survey-description">{survey.description}</p>}
                            
                            <div className="psy-answers-list">
                              {survey.answers.map((answer, index) => (
                                <div key={index} className="psy-answer-item">
                                  <div className="psy-question">
                                    <span className="psy-question-number">Q{index + 1}:</span> 
                                    {answer.questionText}
                                  </div>
                                  <div className="psy-answer">
                                    <span className="psy-answer-label">Answer:</span> 
                                    {answer.answerText}
                                    {typeof answer.score === 'number' && (
                                      <span className="psy-score">Score: {answer.score}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default PsySupportProgramDetail;
