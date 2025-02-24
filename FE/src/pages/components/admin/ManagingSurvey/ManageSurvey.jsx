import React, { useState } from 'react';
import './ManageSurvey.css';

const initialSurvey = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  questions: []
};

const ManageSurvey = () => {
  const [survey, setSurvey] = useState(initialSurvey);

  // Xử lý thay đổi các trường thông tin chính
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };

  // Thêm một câu hỏi mới
  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      questionType: 'text', // các kiểu: text, multiple_choice, checkbox
      options: [] // chỉ dùng nếu là multiple_choice hoặc checkbox
    };
    setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
  };

  // Cập nhật dữ liệu cho từng câu hỏi
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = survey.questions.map((q, idx) =>
      idx === index ? { ...q, [field]: value } : q
    );
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Xóa câu hỏi
  const removeQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, idx) => idx !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Submit form (hiện tại chỉ log ra console)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey Data:", survey);
    alert("Survey saved (mock)!");
  };

  return (
    <div className="survey-editor">
      <h2>Tạo / Chỉnh sửa Khảo sát</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tiêu đề:</label>
          <input 
            type="text" 
            name="title" 
            value={survey.title} 
            onChange={handleInputChange} 
            placeholder="Nhập tiêu đề khảo sát"
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả:</label>
          <textarea 
            name="description" 
            value={survey.description} 
            onChange={handleInputChange} 
            placeholder="Nhập mô tả khảo sát"
          />
        </div>
        <div className="form-group">
          <label>Ngày bắt đầu:</label>
          <input 
            type="date" 
            name="startDate" 
            value={survey.startDate} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input 
            type="date" 
            name="endDate" 
            value={survey.endDate} 
            onChange={handleInputChange} 
            required
          />
        </div>
        
        <h3>Các câu hỏi</h3>
        {survey.questions.map((question, index) => (
          <div key={index} className="question">
            <div className="form-group">
              <label>Nội dung câu hỏi:</label>
              <input 
                type="text" 
                value={question.questionText} 
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                placeholder="Nhập nội dung câu hỏi"
                required
              />
            </div>
            <div className="form-group">
              <label>Kiểu câu hỏi:</label>
              <select 
                value={question.questionType} 
                onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
              >
                <option value="text">Trả lời tự do</option>
                <option value="multiple_choice">Trắc nghiệm</option>
                <option value="checkbox">Chọn nhiều</option>
              </select>
            </div>
            {(question.questionType === 'multiple_choice' || question.questionType === 'checkbox') && (
              <div className="form-group">
                <label>Các lựa chọn (cách nhau bởi dấu phẩy):</label>
                <input 
                  type="text"
                  value={question.options.join(',')}
                  onChange={(e) => 
                    handleQuestionChange(index, 'options', e.target.value.split(',').map(opt => opt.trim()))
                  }
                  placeholder="Ví dụ: Tùy chọn 1, Tùy chọn 2"
                />
              </div>
            )}
            <button type="button" onClick={() => removeQuestion(index)} className="btn-remove">
              Xóa câu hỏi
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="btn-add">
          Thêm câu hỏi
        </button>
        <br />
        <button type="submit" className="btn-submit">
          Lưu khảo sát
        </button>
      </form>
    </div>
  );
};

export default ManageSurvey;
