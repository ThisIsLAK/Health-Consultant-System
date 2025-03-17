import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import ApiService from '../../../../service/ApiService';

const EditSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyCode, setSurveyCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionId: null,
    surveyId: null, // Thêm surveyId cho mỗi câu hỏi
    questionText: '',
    answers: [{ optionId: null, optionText: '', points: 0 }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch survey data on mount
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await ApiService.getSurveyById(surveyId);
        if (response.status === 200) {
          const surveyData = response.data.result || response.data;
          console.log('Fetched survey data:', surveyData);
          if (surveyData) {
            setSurveyTitle(surveyData.title || '');
            setSurveyDescription(surveyData.description || '');
            setSurveyCode(surveyData.surveyCode || '');
            setQuestions(
              surveyData.questions.map((q) => ({
                id: q.questionId || Date.now(),
                questionId: q.questionId,
                surveyId: q.surveyId || surveyId, // Lấy surveyId từ API hoặc từ params
                questionText: q.questionText,
                answers: q.answerOptions.map((a) => ({
                  id: a.optionId || Date.now(),
                  optionId: a.optionId,
                  optionText: a.optionText,
                  score: a.score,
                })),
              }))
            );
          }
        } else {
          throw new Error('Failed to fetch survey details');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching survey details');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  // Handle starting to edit a question
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setCurrentQuestion({
      questionId: question.questionId,
      surveyId: question.surveyId, // Thêm surveyId
      questionText: question.questionText,
      answers: question.answers.map((a) => ({
        optionId: a.optionId,
        optionText: a.optionText,
        points: a.score,
      })),
    });
  };

  // Handle changing current question text
  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      questionText: e.target.value,
    });
  };

  // Handle changing answer text
  const handleAnswerTextChange = (index, e) => {
    const updatedAnswers = [...currentQuestion.answers];
    updatedAnswers[index].optionText = e.target.value;
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
    });
  };

  // Handle changing answer points
  const handleAnswerPointsChange = (index, e) => {
    const updatedAnswers = [...currentQuestion.answers];
    updatedAnswers[index].points = parseInt(e.target.value) || 0;
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
    });
  };

  // Save the edited question
  const handleSaveQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.answers.some(answer => !answer.optionText.trim())) {
      alert('Please fill in all answers');
      return;
    }

    setQuestions(questions.map(q =>
      q.id === editingQuestionId ? { ...currentQuestion, id: q.id, questionId: q.questionId, surveyId: q.surveyId } : q
    ));
    setEditingQuestionId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setCurrentQuestion({
      questionId: null,
      surveyId: surveyId, // Sử dụng surveyId từ params
      questionText: '',
      answers: [{ optionId: null, optionText: '', points: 0 }],
    });
  };

  // Remove a question
  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  // Handle updating survey
  const handleUpdateSurvey = async () => {
    if (!surveyCode.trim()) {
      alert('Please enter a survey code');
      return;
    }

    if (!surveyTitle.trim()) {
      alert('Please enter a survey title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const surveyData = {
      surveyId: surveyId, // Thêm surveyId vào body
      surveyCode: surveyCode,
      title: surveyTitle,
      description: surveyDescription,
      questions: questions.map((q) => ({
        questionId: q.questionId ? String(q.questionId) : undefined,
        surveyId: q.surveyId || surveyId, // Thêm surveyId cho mỗi câu hỏi
        questionText: q.questionText,
        answerOptions: q.answers.map((answer) => ({
          optionId: answer.optionId ? String(answer.optionId) : undefined,
          optionText: answer.optionText,
          score: parseInt(answer.points),
        })),
      })),
    };

    console.log('Survey data to be updated:', JSON.stringify(surveyData, null, 2));

    try {
      const response = await ApiService.updateSurvey(surveyId, surveyData);
      if (response.status === 200) {
        alert('Survey updated successfully!');
        navigate('/adminsurvey');
      } else {
        alert(`Failed to update survey: ${response.message}`);
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      alert(`An error occurred while updating the survey: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <AdminSidebar />
        <main id='main' className='main'>
          <PageTitle page="Edit Survey" />
          <div className="addsurvey-container">
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
          <PageTitle page="Edit Survey" />
          <div className="addsurvey-container">
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
        <PageTitle page="Edit Survey" />
        
        <div className="addsurvey-container">
          {/* Basic Survey Information */}
          <div className="survey-basic-info">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-group">
              <label className="form-label">Survey Code</label>
              <input
                type="text"
                className="form-input"
                value={surveyCode}
                onChange={(e) => setSurveyCode(e.target.value)}
                placeholder="Enter survey code (e.g., SRC009)"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Survey Title</label>
              <input
                type="text"
                className="form-input"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Enter survey title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                placeholder="Enter survey description"
                rows="3"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="survey-questions-section">
            <div className="section-header">
              <h2 className="section-title">Questions</h2>
            </div>

            {/* Display and edit saved questions */}
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                {editingQuestionId === q.id ? (
                  <div className="new-question-card">
                    <h3 className="question-form-title">Edit Question</h3>
                    <div className="form-group">
                      <label className="form-label">Question</label>
                      <input
                        type="text"
                        className="form-input"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionChange}
                        placeholder="Enter question"
                      />
                    </div>

                    <h4 className="answers-title">Answers</h4>
                    {currentQuestion.answers.map((answer, index) => (
                      <div key={index} className="answer-form-group">
                        <div className="answer-input-container">
                          <input
                            type="text"
                            className="form-input answer-text-input"
                            value={answer.optionText}
                            onChange={(e) => handleAnswerTextChange(index, e)}
                            placeholder={`Answer ${index + 1}`}
                          />
                        </div>
                        <div className="answer-points-container">
                          <input
                            type="number"
                            className="form-input answer-points-input"
                            value={answer.points}
                            onChange={(e) => handleAnswerPointsChange(index, e)}
                            placeholder="Points"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="question-form-actions">
                      <button
                        onClick={handleSaveQuestion}
                        className="btn btn-success"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-danger"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="question-header">
                    <h3 className="question-title">{q.questionText}</h3>
                    <div>
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                <div className="answer-list">
                  {q.answers.map((answer, index) => (
                    <div key={index} className="answer-item">
                      <span className="answer-number">{index + 1}</span>
                      <span className="answer-text">{answer.optionText} - {answer.points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Update Survey Button */}
          <div className="survey-submit-container">
            <button
              onClick={handleUpdateSurvey}
              className="btn btn-submit"
            >
              Update Survey
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSurvey;