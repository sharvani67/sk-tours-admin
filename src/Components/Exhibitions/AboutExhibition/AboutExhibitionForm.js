import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../Shared/Navbar/Navbar';

const AboutExhibitionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', question: '', answer: '' });
  const [editMode, setEditMode] = useState(false);

  // Sample questions data - in real app, this would come from API or context
  const sampleQuestions = [
    { id: 'AQ1', question: 'What is Travel Exhibitions??', answer: 'Travel exhibitions are events where travel companies showcase their services.' },
    { id: 'AQ2', question: 'Why Should Travel Agent Attend Travel Exhibitions??', answer: 'To network and find new business opportunities.' },
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
    navigate('/exhibition');
  };

  const handleCancel = () => {
    navigate('/exhibition');
  };

  return (
    <AdminLayout>
      <div className="content-wrapper">
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">{editMode ? 'Edit Question' : 'Add New Question'}</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Question</label>
                      <input
                        type="text"
                        className="form-control"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        placeholder="Enter question"
                        required
                      />
                      <div className="form-text">Enter the question text that will be displayed.</div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold">Answer</label>
                      <textarea
                        className="form-control"
                        rows="6"
                        name="answer"
                        value={formData.answer}
                        onChange={handleChange}
                        placeholder="Enter detailed answer"
                        required
                      />
                      <div className="form-text">Provide a comprehensive answer to the question.</div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary" 
                          onClick={handleCancel}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Cancel
                        </button>
                      </div>
                      <div>
                        <button type="submit" className="btn btn-primary px-4">
                          {editMode ? (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Update Question
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-2"></i>
                              Save Question
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Preview</h6>
                  </div>
                  <div className="card-body">
                    <h5 className="text-primary">Q: {formData.question || '[Question preview]'}</h5>
                    <p className="mt-2">{formData.answer || '[Answer preview]'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button 
                  className="btn btn-link text-decoration-none" 
                  onClick={() => navigate('/exhibition')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Exhibition Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutExhibitionForm;