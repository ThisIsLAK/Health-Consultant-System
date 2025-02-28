import React, { useState } from 'react'
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/adminheader';
import { useNavigate } from 'react-router-dom';
import './AdminSurvey.css';

const AdminSurvey = () => {
    const navigate = useNavigate();

    // Sample data - replace with your actual data fetching logic
    const [surveys, setSurveys] = useState([
        {
            id: 1,
            name: 'Khảo sát về trải nghiệm người dùng',
            description: 'Khảo sát này nhằm thu thập ý kiến của người dùng về trải nghiệm sử dụng sản phẩm của chúng tôi.',
            startDate: '2025-02-15',
            endDate: '2025-03-15'
        },
        {
            id: 2,
            name: 'Đánh giá dịch vụ khách hàng',
            description: 'Mục đích của khảo sát này là đánh giá chất lượng dịch vụ khách hàng và tìm cách cải thiện.',
            startDate: '2025-02-20',
            endDate: '2025-03-20'
        },
        {
            id: 3,
            name: 'Khảo sát về nhu cầu sản phẩm mới',
            description: 'Khảo sát này giúp chúng tôi hiểu thêm về nhu cầu của khách hàng đối với các tính năng và sản phẩm mới.',
            startDate: '2025-02-10',
            endDate: '2025-04-10'
        }
    ]);

    const handleEdit = (id) => {
        navigate(`/editsurvey/${id}`);
    };

    const handleCreate = () => {
        navigate('/editsurvey');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };


    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="survey-content">
                    <div className="survey-header">
                        <h1>Quản lý khảo sát</h1>
                        <button className="create-button" onClick={handleCreate}>
                            + Tạo khảo sát mới
                        </button>
                    </div>
                    <div className="survey-list">
                        {surveys.map(survey => (
                            <div className="survey-card" key={survey.id}>
                                <div className="survey-card-content">
                                    <h2 className="survey-name">{survey.name}</h2>
                                    <p className="survey-description">{survey.description}</p>
                                    <div className="survey-dates">
                                        <div className="date-item">
                                            <span className="date-label">Ngày bắt đầu:</span>
                                            <span className="date-value">{formatDate(survey.startDate)}</span>
                                        </div>
                                        <div className="date-item">
                                            <span className="date-label">Ngày kết thúc:</span>
                                            <span className="date-value">{formatDate(survey.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="survey-card-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(survey.id)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminSurvey
