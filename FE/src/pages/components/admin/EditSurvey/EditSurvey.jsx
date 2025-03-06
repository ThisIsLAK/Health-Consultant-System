import React, { useState } from 'react';
import './EditSurvey.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
import ApiService from '../../../../service/ApiService';
import { useNavigate } from 'react-router-dom';

const initialSurvey = {
  title: '',
  description: '',
  questions: []
};

const EditSurvey = () => {
  const [survey, setSurvey] = useState(initialSurvey);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: [{ optionText: '', score: 0 }]
    };
    setSurvey(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const handleQuestionChange = (qIndex, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex].questionText = value;
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex].options.push({ optionText: '', score: 0 });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const removeQuestion = (qIndex) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== qIndex)
    }));
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const surveyResponse = await ApiService.createSurvey({
        title: survey.title,
        description: survey.description,
      });

      if (surveyResponse.status !== 200) {
        throw new Error(surveyResponse.message);
      }

      const surveyId = surveyResponse.data.result.surveyId;
      for (const question of survey.questions) {
        const questionData = {
          surveyId,
          questionText: question.questionText,
          answerOptions: question.options
        };

        const questionResponse = await ApiService.createSurveyQuestion(questionData);
        if (questionResponse.status !== 200) {
          throw new Error(`Failed to create question: ${questionResponse.message}`);
        }
      }

      alert('Survey created successfully!');
      navigate('/adminsurvey');
    } catch (err) {
      setError(err.message);
      console.error('Error creating survey:', err);
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="edit-survey">
        <h2>Tạo / Chỉnh sửa Khảo sát</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tiêu đề:</label>
            <input type="text" name="title" value={survey.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea name="description" value={survey.description} onChange={handleInputChange} required />
          </div>

          <h3>Các câu hỏi</h3>
          {survey.questions.map((question, qIndex) => (
            <div key={qIndex} className="question">
              <div className="form-group">
                <label>Nội dung câu hỏi:</label>
                <input type="text" value={question.questionText} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required />
              </div>
              <div className="multiple-choice-options">
                <h4>Đáp án:</h4>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="answer-option">
                    <input type="text" placeholder="Đáp án" value={option.optionText} onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)} required />
                    <input type="number" placeholder="Điểm" value={option.score} onChange={(e) => handleOptionChange(qIndex, oIndex, 'score', e.target.value)} required />
                    <button type="button" onClick={() => removeOption(qIndex, oIndex)}>Xóa</button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(qIndex)}>Thêm đáp án</button>
              </div>
              <button type="button" onClick={() => removeQuestion(qIndex)}>Xóa câu hỏi</button>
            </div>
          ))}

          <div className='button-group'>
            <button type="button" onClick={addQuestion}>Thêm câu hỏi</button>
            <button type="submit">Lưu khảo sát</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSurvey;
