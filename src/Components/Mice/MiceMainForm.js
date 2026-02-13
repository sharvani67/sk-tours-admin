import React from 'react';
import { Spinner } from 'react-bootstrap';
import { baseurl } from '../../Api/Baseurl';

const MiceMainForm = ({ 
  miceMain, 
  mainForm, 
  setMainForm, 
  getImageUrl,
  loading, 
  handleCancel, 
  fetchData, 
  setShowForm, 
  setError, 
  setSuccessMessage, 
  resetForms 
}) => {
  const handleMainFormChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...mainForm.questions];
    
    if (name === 'question' || name === 'answer') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [name]: value
      };
      setMainForm({ ...mainForm, questions: updatedQuestions });
    }
  };

  const addNewQuestion = () => {
    const newQuestion = { id: Date.now(), question: '', answer: '' };
    setMainForm({
      ...mainForm,
      questions: [...mainForm.questions, newQuestion]
    });
  };

  const removeQuestion = (index) => {
    if (mainForm.questions.length > 1) {
      const updatedQuestions = mainForm.questions.filter((_, i) => i !== index);
      setMainForm({ ...mainForm, questions: updatedQuestions });
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainForm({
          ...mainForm,
          bannerImage: file,
          bannerImagePreview: reader.result
        });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const validQuestions = mainForm.questions.filter(q => 
      q.question && q.question.trim() !== '' && 
      q.answer && q.answer.trim() !== ''
    );

    if (validQuestions.length === 0) {
      setError('Please add at least one question with both question and answer');
      return;
    }

    const formData = new FormData();
    
    if (mainForm.bannerImage) {
      formData.append('bannerImage', mainForm.bannerImage);
    }
    
    formData.append('isEdit', miceMain ? 'true' : 'false');
    formData.append('questions', JSON.stringify(validQuestions));

    try {
      const response = await fetch(`${baseurl}/api/mice/main`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'MICE Main saved successfully!');
        await fetchData();
        resetForms();
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Error saving MICE Main');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      <h2>{miceMain ? 'Edit MICE Main Page' : 'Add MICE Main Page'}</h2>
      <form onSubmit={handleMainSubmit}>
        <div className="form-group">
          <label htmlFor="bannerImage">
            Banner Image {!miceMain && '*'}
          </label>
          <input
            type="file"
            id="bannerImage"
            accept="image/*"
            onChange={handleBannerImageChange}
            className="form-control"
          />
          {mainForm.bannerImagePreview && (
            <div className="image-preview mt-2">
              <img 
                src={mainForm.bannerImagePreview} 
                alt="Banner Preview" 
                style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          )}
          {miceMain && !mainForm.bannerImagePreview && !mainForm.bannerImage && (
            <div className="mt-2">
              <p className="text-muted small">Current image:</p>
              <img 
                src={getImageUrl('main', miceMain.banner_image)}
                alt="Current Banner" 
                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <p className="text-muted small mt-1">Leave empty to keep current image</p>
            </div>
          )}
        </div>

        <div className="form-group mt-4">
          <div className="qa-header d-flex justify-content-between align-items-center mb-3">
            <label className="fw-bold">Questions & Answers</label>
            <button type="button" onClick={addNewQuestion} className="btn btn-sm btn-outline-primary">
              + Add New Question
            </button>
          </div>
          {mainForm.questions.map((item, index) => (
            <div key={item.id} className="qa-item mb-4 p-3 border rounded">
              <div className="qa-header d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Question {index + 1}</span>
                {mainForm.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(index)} className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                )}
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter question"
                  value={item.question}
                  onChange={(e) => handleMainFormChange(e, index)}
                  name="question"
                  required
                />
              </div>
              <div>
                <textarea
                  className="form-control"
                  placeholder="Enter answer"
                  value={item.answer}
                  onChange={(e) => handleMainFormChange(e, index)}
                  name="answer"
                  rows="3"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions d-flex gap-3 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : (miceMain ? 'Update' : 'Save')}
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default MiceMainForm;