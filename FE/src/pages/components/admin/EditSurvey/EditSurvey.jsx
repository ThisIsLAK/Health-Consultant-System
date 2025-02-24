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

const EditSurvey = () => {
  const [survey, setSurvey] = useState(initialSurvey);

  // Xử lý thay đổi thông tin chung của khảo sát
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey(prev => ({ ...prev, [name]: value }));
  };

  // Thêm mới câu hỏi vào khảo sát
  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      questionType: 'text', // các kiểu: text, multiple_choice, checkbox
      options: [] // Dành cho multiple_choice: mảng chứa các đối tượng { text: '', score: 1 }
    };
    setSurvey(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  // Cập nhật thông tin của câu hỏi theo index
  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = survey.questions.map((question, index) => {
      if (index === qIndex) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // Xóa câu hỏi theo index
  const removeQuestion = (qIndex) => {
    const updatedQuestions = survey.questions.filter((_, index) => index !== qIndex);
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // Thêm đáp án cho câu hỏi trắc nghiệm
  const addAnswerOption = (qIndex) => {
    const updatedQuestions = survey.questions.map((question, index) => {
      if (index === qIndex) {
        const newOption = { text: '', score: 1 };
        return { ...question, options: [...(question.options || []), newOption] };
      }
      return question;
    });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // Cập nhật thông tin đáp án theo câu hỏi và vị trí đáp án
  const handleAnswerChange = (qIndex, aIndex, field, value) => {
    const updatedQuestions = survey.questions.map((question, index) => {
      if (index === qIndex) {
        const updatedOptions = question.options.map((option, optIndex) => {
          if (optIndex === aIndex) {
            return { ...option, [field]: value };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // Xóa đáp án theo câu hỏi và index của đáp án
  const removeAnswerOption = (qIndex, aIndex) => {
    const updatedQuestions = survey.questions.map((question, index) => {
      if (index === qIndex) {
        const updatedOptions = question.options.filter((_, optIndex) => optIndex !== aIndex);
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // Submit form (chỉ log dữ liệu hiện tại)
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
          {survey.questions.map((question, qIndex) => (
            <div key={qIndex} className="question">
              <div className="form-group">
                <label>Nội dung câu hỏi:</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  placeholder="Nhập nội dung câu hỏi"
                  required
                />
              </div>
              <div className="form-group">
                <label>Kiểu câu hỏi:</label>
                <select
                  value={question.questionType}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                >
                  <option value="text">Trả lời tự do</option>
                  <option value="multiple_choice">Trắc nghiệm</option>
                  <option value="checkbox">Chọn nhiều</option>
                </select>
              </div>

              {/* Nếu chọn kiểu trắc nghiệm thì hiển thị danh sách đáp án */}
              {question.questionType === 'multiple_choice' && (
                <div className="multiple-choice-options">
                  <h4>Đáp án (cho câu hỏi trắc nghiệm):</h4>
                  {question.options && question.options.map((option, aIndex) => (
                    <div key={aIndex} className="answer-option">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                        placeholder="Nhập đáp án"
                        required
                      />
                      <select
                        value={option.score}
                        onChange={(e) => handleAnswerChange(qIndex, aIndex, 'score', parseInt(e.target.value))}
                      >
                        <option value={1}>1 điểm</option>
                        <option value={2}>2 điểm</option>
                        <option value={3}>3 điểm</option>
                        <option value={4}>4 điểm</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeAnswerOption(qIndex, aIndex)}
                        className="btn-remove-answer"
                      >
                        Xóa đáp án
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addAnswerOption(qIndex)}
                    className="btn-add-answer"
                  >
                    Thêm đáp án
                  </button>
                </div>
              )}

              {question.questionType === 'checkbox' && (
                <div className="checkbox-options">
                  <p>Giao diện cho checkbox tương tự như trắc nghiệm, bạn có thể điều chỉnh sau.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="btn-remove-question"
              >
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
