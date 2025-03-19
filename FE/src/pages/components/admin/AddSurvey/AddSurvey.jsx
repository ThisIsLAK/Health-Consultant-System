import React, { useState } from 'react';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import ApiService from '../../../../service/ApiService';
import './AddSurvey.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyCode, setSurveyCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: [{ text: '', points: 0 }],
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Handle adding a new question with limit
  const handleAddQuestion = () => {
    if (questions.length >= 9) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Reached',
        text: 'You have reached the maximum limit of 9 questions.',
      });
      return;
    }
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
      Swal.fire({
        icon: 'error',
        title: 'Missing Question',
        text: 'Please enter a question.',
      });
      return;
    }

    if (currentQuestion.answers.some(answer => !answer.text.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Answers',
        text: 'Please fill in all answers.',
      });
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
  const handleCreateSurvey = async () => {
    if (!surveyCode.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Survey Code',
        text: 'Please enter a survey code.',
      });
      return;
    }

    if (!surveyTitle.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Title',
        text: 'Please enter a survey title.',
      });
      return;
    }

    if (questions.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Questions',
        text: 'Please add at least one question.',
      });
      return;
    }

    const surveyData = {
      surveyCode: surveyCode,
      title: surveyTitle,
      description: surveyDescription,
      questions: questions.map((q) => ({
        questionText: q.question,
        answerOptions: q.answers.map((answer) => ({
          optionText: answer.text,
          score: answer.points,
        })),
      })),
    };

    console.log('Survey data to be submitted:', surveyData);

    try {
      const response = await ApiService.createSurvey(surveyData);
      console.log('Survey creation response:', response);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Survey created successfully!',
        }).then(() => {
          navigate('/adminsurvey');
        });
        console.log('Created survey details:', response.data);

        setSurveyTitle('');
        setSurveyDescription('');
        setSurveyCode('');
        setQuestions([]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: `Failed to create survey: ${response.message}`,
        });
        console.error('Failed to create survey:', response.message);
      }
    } catch (error) {
      console.error('Error during survey creation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while creating the survey. Please try again.',
      });
    }
  };

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main id='main' className='main'>
        <PageTitle page="Create Survey" />

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
              {!isAddingQuestion && (
                <button
                  onClick={handleAddQuestion}
                  className="btn btn-add"
                >
                  + Add Question
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
                <h3 className="question-form-title">Add New Question</h3>
                <div className="form-group">
                  <label className="form-label">Question</label>
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
                    + Add Answer
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
              Create Survey
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddSurvey;