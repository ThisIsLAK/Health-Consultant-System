import React from 'react'
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';

const EditBlog = () => {
    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page="Edit Blog" />

                <div className="add-form-container">
                    <form className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Content</label>
                                <textarea rows="10"></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Add Blog</button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default EditBlog
