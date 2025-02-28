import React, { useState } from 'react';
import './EditSurvey.css';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/adminheader';

const initialSurvey = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  questions: []
};

const defaultOptions = [
  { text: 'Not at all', score: 0 },
  { text: 'Several days', score: 1 },
  { text: 'More than half the days', score: 2 },
  { text: 'Nearly every day', score: 3 }
];

const EditSurvey = () => {
  const [survey, setSurvey] = useState(initialSurvey);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      questionType: 'multiple_choice',
      options: [...defaultOptions] 
    };
    setSurvey(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const handleQuestionChange = (qIndex, value) => {
    const updatedQuestions = survey.questions.map((question, index) => {
      if (index === qIndex) {
        return { ...question, questionText: value };
      }
      return question;
    });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const removeQuestion = (qIndex) => {
    const updatedQuestions = survey.questions.filter((_, index) => index !== qIndex);
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey Data:", survey);
    alert("Khảo sát đã được lưu (mock)!");
  };

  return (
    <>
      <AdminHeader/>
      <AdminSidebar />
      <div className="edit-survey">
        <h2>Tạo / Chỉnh sửa Khảo sát</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tiêu đề:</label>
            <input type="text" name="title" value={survey.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea name="description" value={survey.description} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu:</label>
            <input type="date" name="startDate" value={survey.startDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Ngày kết thúc:</label>
            <input type="date" name="endDate" value={survey.endDate} onChange={handleInputChange} required />
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
                {question.options.map((option, aIndex) => (
                  <div key={aIndex} className="answer-option">
                    <span>{option.text} ({option.score})</span>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => removeQuestion(qIndex)} className="btn-remove-question">
                Xóa câu hỏi
              </button>
            </div>
          ))}

          <div className='button-group'>
            <button type="button" onClick={addQuestion} className="btn-add-question">
              Thêm câu hỏi
            </button>
            <button type="submit" className="btn-submit">
              Lưu khảo sát
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSurvey;
