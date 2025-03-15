import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import './SurveyDetail.css';

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch survey data - replace with your actual API call
    fetchSurveyDetail(id);
  }, [id]);

  const fetchSurveyDetail = (surveyId) => {
    // This is a mock API call - replace with your actual API
    setLoading(true);
    
    // Mock data for demonstration purposes
    setTimeout(() => {
      const mockSurvey = {
        id: surveyId,
        title: "Employee Satisfaction Survey",
        description: "This survey helps us understand employee satisfaction and identify areas for improvement.",
        questions: [
          {
            id: 1,
            question: "How satisfied are you with your work environment?",
            answers: [
              { id: 1, text: "Very Dissatisfied", points: 1 },
              { id: 2, text: "Dissatisfied", points: 2 },
              { id: 3, text: "Neutral", points: 3 },
              { id: 4, text: "Satisfied", points: 4 },
              { id: 5, text: "Very Satisfied", points: 5 }
            ]
          },
          {
            id: 2,
            question: "How would you rate your work-life balance?",
            answers: [
              { id: 1, text: "Poor", points: 1 },
              { id: 2, text: "Fair", points: 2 },
              { id: 3, text: "Good", points: 3 },
              { id: 4, text: "Very Good", points: 4 },
              { id: 5, text: "Excellent", points: 5 }
            ]
          },
          {
            id: 3,
            question: "How likely are you to recommend our company as a place to work?",
            answers: [
              { id: 1, text: "Not likely at all", points: 0 },
              { id: 2, text: "Somewhat unlikely", points: 3 },
              { id: 3, text: "Neutral", points: 5 },
              { id: 4, text: "Somewhat likely", points: 8 },
              { id: 5, text: "Extremely likely", points: 10 }
            ]
          }
        ]
      };
      
      setSurvey(mockSurvey);
      setLoading(false);
    }, 500);
  };

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/admin/surveys/edit/${id}`);
  };

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <AdminSidebar />
        <main id='main' className='main'>
          <PageTitle title='Survey Detail' />
          <div className="survey-detail-container">
            <div className="loading-spinner">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main id='main' className='main'>
        <PageTitle title='Survey Detail' />
        
        <div className="survey-detail-container">
          {/* Basic Survey Information */}
          <div className="survey-info-section">
            <div className="survey-header">
              <h1 className="survey-title">{survey.title}</h1>
            </div>
            <div className="survey-description">
              <p>{survey.description}</p>
            </div>
          </div>
          
          {/* Questions & Answers */}
          <div className="questions-section">
            <h2 className="detailsection-title">Questions</h2>
            
            {survey.questions.map((question, qIndex) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h3 className="question-number">Question {qIndex + 1}</h3>
                  <h3 className="question-text">{question.question}</h3>
                </div>
                
                <div className="answers-container">
                  <table className="answers-table">
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Answer</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.answers.map((answer, aIndex) => (
                        <tr key={answer.id} className="answer-row">
                          <td className="answer-option">{String.fromCharCode(65 + aIndex)}</td>
                          <td className="answer-text">{answer.text}</td>
                          <td className="answer-points">{answer.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="survey-actions">
            <button 
              className="btn btn-edit"
              onClick={handleEdit}
            >
              Edit Survey
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SurveyDetail;