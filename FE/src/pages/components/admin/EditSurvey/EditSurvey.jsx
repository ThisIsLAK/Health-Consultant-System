import React, { useState } from 'react';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';

const EditSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: [{ text: '', points: 0 }],
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
    setCurrentQuestion({
      question: '',
      answers: [{ text: '', points: 0 }],
    });
  };

  // Handle adding a new answer to the current question
  const handleAddAnswer = () => {
    setCurrentQuestion({
      ...currentQuestion,
      answers: [...currentQuestion.answers, { text: '', points: 0 }],
    });
  };

  // Handle changing current question text
  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: e.target.value,
    });
  };

  // Handle changing answer text
  const handleAnswerTextChange = (index, e) => {
    const updatedAnswers = [...currentQuestion.answers];
    updatedAnswers[index].text = e.target.value;
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

  // Save the current question
  const handleSaveQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (currentQuestion.answers.some(answer => !answer.text.trim())) {
      alert('Please fill in all answers');
      return;
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setIsAddingQuestion(false);
  };

  // Remove a question
  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  // Handle creating survey
  const handleCreateSurvey = () => {
    if (!surveyTitle.trim()) {
      alert('Please enter a survey title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Here you would typically send the data to your backend
    const surveyData = {
      title: surveyTitle,
      description: surveyDescription,
      questions: questions,
    };
    
    console.log('Survey data to be submitted:', surveyData);
    alert('Survey created successfully!');
    
    // Reset form after successful creation
    setSurveyTitle('');
    setSurveyDescription('');
    setQuestions([]);
  };

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
              <label className="form-label">
                Survey Title
              </label>
              <input
                type="text"
                className="form-input"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Enter survey title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Description
              </label>
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
              {!isAddingQuestion && (
                <button
                  onClick={handleAddQuestion}
                  className="btn btn-add"
                >
                  + Edit Question
                </button>
              )}
            </div>

            {/* Display saved questions */}
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <h3 className="question-title">{q.question}</h3>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
                <div className="answer-list">
                  {q.answers.map((answer, index) => (
                    <div key={index} className="answer-item">
                      <span className="answer-number">{index + 1}</span>
                      <span className="answer-text">{answer.text} - {answer.points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add new question form */}
            {isAddingQuestion && (
              <div className="new-question-card">
                <h3 className="question-form-title">Edit Question</h3>
                <div className="form-group">
                  <label className="form-label">
                    Question
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentQuestion.question}
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
                        value={answer.text}
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
                    onClick={handleAddAnswer}
                    className="btn btn-secondary"
                  >
                    + Edit Answer
                  </button>
                  <button
                    onClick={handleSaveQuestion}
                    className="btn btn-success"
                  >
                    Save Question
                  </button>
                  <button
                    onClick={() => setIsAddingQuestion(false)}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Survey Button */}
          <div className="survey-submit-container">
            <button
              onClick={handleCreateSurvey}
              className="btn btn-submit"
            >
              Edit Survey
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSurvey;