import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>{editMode ? 'Edit Question' : 'Add New Question'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="Enter question"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Answer</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    placeholder="Enter answer"
                    required
                  />
                </div>
                
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-3">
            <button 
              className="btn btn-link" 
              onClick={() => navigate('/exhibition')}
            >
              ← Back to Exhibition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutExhibitionForm;