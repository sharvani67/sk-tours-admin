import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../Shared/Navbar/Navbar';

const AboutMiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', question: '', answer: '' });
  const [editMode, setEditMode] = useState(false);

  // Sample questions data - in real app, this would come from API or context
  const sampleQuestions = [
    { 
      id: 'MICE001', 
      question: 'What is MICE?', 
      answer: 'MICE stands for Meetings, Incentives, Conferences, and Exhibitions. It refers to a type of tourism in which large groups, usually planned well in advance, are brought together for a particular purpose.' 
    },
    { 
      id: 'MICE002', 
      question: 'Why is MICE important for business?', 
      answer: 'MICE tourism is crucial for business as it facilitates networking, knowledge sharing, deal-making, and brand promotion on a large scale, often involving international participants.' 
    },
    { 
      id: 'MICE003', 
      question: 'What are the benefits of attending MICE events?', 
      answer: 'Benefits include networking opportunities, industry insights, partnership possibilities, brand visibility, and staying updated with market trends and innovations.' 
    },
  ];

  useEffect(() => {
    if (id) {
      // Edit mode
      setEditMode(true);
      const questionToEdit = sampleQuestions.find(q => q.id === id);
      if (questionToEdit) {
        setFormData(questionToEdit);
      }
    } else {
      // Add mode
      setEditMode(false);
      setFormData({ id: '', question: '', answer: '' });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save to API or context
    console.log('Form submitted:', formData);
    alert(editMode ? 'Question updated successfully!' : 'Question added successfully!');
    navigate('/mice');
  };

  const handleCancel = () => {
    navigate('/mice');
  };

  return (
    <AdminLayout>
      <div className="content-wrapper">
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <button 
                      className="btn btn-link text-decoration-none p-0" 
                      onClick={() => navigate('/mice')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      MICE
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {editMode ? 'Edit MICE Question' : 'Add MICE Question'}
                  </li>
                </ol>
              </nav>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                  <i className="bi bi-chat-square-text me-2 text-info"></i>
                  {editMode ? 'Edit MICE Question' : 'Add New MICE Question'}
                </h2>
                <div className="badge bg-info fs-6">
                  <i className="bi bi-question-circle me-2"></i>
                  FAQ Management
                </div>
              </div>
              <p className="text-muted">
                {editMode 
                  ? 'Update the question and answer for your MICE FAQ section' 
                  : 'Add a new frequently asked question to help users understand MICE better'}
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header bg-info text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-pencil-square me-2"></i>
                    {editMode ? 'Edit FAQ Entry' : 'New FAQ Entry'}
                  </h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-question-circle me-2"></i>
                        Question
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        placeholder="Enter question about MICE..."
                        required
                      />
                      <div className="form-text">
                        Enter a clear and concise question that users might have about MICE
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-chat-left-text me-2"></i>
                        Detailed Answer
                      </label>
                      <textarea
                        className="form-control"
                        rows="6"
                        name="answer"
                        value={formData.answer}
                        onChange={handleChange}
                        placeholder="Enter comprehensive answer..."
                        required
                      />
                      <div className="form-text">
                        Provide a detailed, informative answer that addresses the question thoroughly
                      </div>
                    </div>
                    
                    {/* Preview Section */}
                    {(formData.question || formData.answer) && (
                      <div className="mb-4">
                        <div className="card border-info">
                          <div className="card-header bg-info bg-opacity-10">
                            <h6 className="mb-0">
                              <i className="bi bi-eye me-2"></i>
                              Preview
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <h5 className="text-info">
                                <i className="bi bi-question-circle-fill me-2"></i>
                                {formData.question || '[Question preview]'}
                              </h5>
                            </div>
                            <div className="bg-light p-3 rounded">
                              <p className="mb-0">
                                <i className="bi bi-chat-left-text-fill me-2 text-success"></i>
                                {formData.answer || '[Answer preview]'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Information */}
                    <div className="mb-4">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Tips for Effective FAQs
                          </h6>
                        </div>
                        <div className="card-body">
                          <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Keep questions clear and to the point
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Provide comprehensive but concise answers
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Use simple language that all users can understand
                            </li>
                            <li>
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Focus on common questions about MICE services
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary px-4" 
                          onClick={handleCancel}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel
                        </button>
                      </div>
                      <div>
                        <button type="submit" className="btn btn-info px-4">
                          <i className="bi bi-save me-2"></i>
                          {editMode ? 'Update FAQ' : 'Save FAQ'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="mt-4">
                <button 
                  className="btn btn-link text-decoration-none" 
                  onClick={() => navigate('/mice')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to MICE Management
                </button>
              </div>

              {/* Existing FAQs Section */}
              {!editMode && (
                <div className="mt-4">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Existing FAQ Examples
                      </h6>
                    </div>
                    <div className="card-body">
                      {sampleQuestions.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="mb-3 pb-3 border-bottom">
                          <h6 className="text-primary">Q: {item.question}</h6>
                          <p className="text-muted mb-0">
                            <small>A: {item.answer.substring(0, 80)}...</small>
                          </p>
                        </div>
                      ))}
                      <div className="text-center">
                        <small className="text-muted">
                          These are example FAQs. Add your own to customize your MICE section.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutMiceForm;