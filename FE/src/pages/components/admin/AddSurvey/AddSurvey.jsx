import React, { useState } from 'react';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import ApiService from '../../../../service/ApiService'; // Đảm bảo import ApiService
import './AddSurvey.css'; // Make sure to create this CSS file
import { useNavigate } from 'react-router-dom';

const AddSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyCode, setSurveyCode] = useState(''); // Bỏ giá trị mặc định sinh tự động
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
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
  const handleCreateSurvey = async () => {
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

    // Format survey data to match the required structure, including surveyCode
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
      // Gọi hàm createSurvey từ ApiService
      const response = await ApiService.createSurvey(surveyData);
      console.log('Survey creation response:', response);

      if (response.status === 200) {
        alert('Survey created successfully!');
        navigate('/adminsurvey');
        console.log('Created survey details:', response.data);

        // Reset form sau khi tạo thành công
        setSurveyTitle('');
        setSurveyDescription('');
        setSurveyCode(''); // Reset surveyCode
        setQuestions([]);
      } else {
        alert(`Failed to create survey: ${response.message}`);
        console.error('Failed to create survey:', response.message);
      }
    } catch (error) {
      console.error('Error during survey creation:', error);
      alert('An error occurred while creating the survey. Please try again.');
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
              <label className="form-label">
                Survey Code
              </label>
              <input
                type="text"
                className="form-input"
                value={surveyCode}
                onChange={(e) => setSurveyCode(e.target.value)}
                placeholder="Enter survey code (e.g., SRC009)"
              />
            </div>
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