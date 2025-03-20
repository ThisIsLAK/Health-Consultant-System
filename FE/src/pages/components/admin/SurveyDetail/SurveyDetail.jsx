import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import ApiService from '../../../../service/ApiService';
import './SurveyDetail.css';

const SurveyDetail = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Survey ID from params:", surveyId);
    fetchSurveyDetail(surveyId);
  }, [surveyId]);

  const fetchSurveyDetail = async (surveyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getSurveyById(surveyId);
      if (response.status === 200) {
        const surveys = response.data.result || response.data;
        let apiSurvey;

        if (Array.isArray(surveys)) {
          apiSurvey = surveys.find(survey => survey.surveyId === surveyId);
          if (!apiSurvey) {
            throw new Error(`Survey with ID ${surveyId} not found`);
          }
        } else {
          apiSurvey = surveys;
        }

        const formattedSurvey = {
          id: apiSurvey.surveyId,
          surveyCode: apiSurvey.surveyCode || "No code available",
          title: apiSurvey.title || "Untitled Survey",
          description: apiSurvey.description || "No description available",
          questions: apiSurvey.questions
            .map(q => ({
              id: q.questionId,
              question: q.questionText,
              answers: q.answerOptions
                .map(a => ({
                  id: a.optionId,
                  text: a.optionText,
                  points: a.score,
                }))
                .sort((a, b) => a.id - b.id), // Sắp xếp answers theo optionId
            }))
            .sort((a, b) => a.id - b.id), // Sắp xếp questions theo questionId
        };
        setSurvey(formattedSurvey);
      } else {
        throw new Error("Failed to fetch survey details");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching survey details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/editsurvey/${surveyId}`);
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

  if (error) {
    return (
      <div>
        <AdminHeader />
        <AdminSidebar />
        <main id='main' className='main'>
          <PageTitle title='Survey Detail' />
          <div className="survey-detail-container">
            <div className="error-message">{error}</div>
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
          <div className="survey-info-section">
            <div className="survey-header">
              <h1 className="survey-title">{survey.title}</h1>
              <p className="survey-code">Survey Code: {survey.surveyCode}</p>
            </div>
            <div className="survey-description">
              <p>{survey.description}</p>
            </div>
          </div>
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
          <div className="survey-actions">
            <button className="btn btn-edit" onClick={handleEdit}>
              Edit Survey
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SurveyDetail;