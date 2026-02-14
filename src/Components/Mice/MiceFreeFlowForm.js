import React from 'react';
import { Spinner } from 'react-bootstrap';
import { baseurl } from '../../Api/Baseurl';

const FreeFlowForm = ({ 
  miceFreeFlow, 
  freeFlowForm, 
  setFreeFlowForm, 
  getImageUrl,
  loading, 
  handleCancel, 
  fetchData, 
  setShowForm, 
  setError, 
  setSuccessMessage, 
  resetForms 
}) => {
  const handleFreeFlowChange = (e) => {
    const { name, value } = e.target;
    setFreeFlowForm({
      ...freeFlowForm,
      [name]: value
    });
  };

  const handleFreeFlowImageChange = (e) => {
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
        setFreeFlowForm({
          ...freeFlowForm,
          image: file,
          imagePreview: reader.result
        });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFreeFlowSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!freeFlowForm.meetingText.trim() || !freeFlowForm.incentivesText.trim() || 
        !freeFlowForm.conferenceText.trim() || !freeFlowForm.eventsText.trim()) {
      setError('All text fields are required');
      return;
    }

    if (!freeFlowForm.id && !freeFlowForm.image) {
      setError('Image is required for new entries');
      return;
    }

    const formData = new FormData();
    formData.append('meetingText', freeFlowForm.meetingText.trim());
    formData.append('incentivesText', freeFlowForm.incentivesText.trim());
    formData.append('conferenceText', freeFlowForm.conferenceText.trim());
    formData.append('eventsText', freeFlowForm.eventsText.trim());
    
    if (freeFlowForm.image) {
      formData.append('image', freeFlowForm.image);
    }
    
    if (freeFlowForm.id) {
      formData.append('id', freeFlowForm.id);
    }

    try {
      const response = await fetch(`${baseurl}/api/mice/freeflow`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Free Flow Entry saved successfully!');
        await fetchData();
        resetForms();
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Error saving Free Flow Entry');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      <h2>{freeFlowForm.id ? 'Edit Free Flow Entry' : 'Add Free Flow Entry'}</h2>
      <form onSubmit={handleFreeFlowSubmit}>
        <div className="form-group">
          <label>Upload Image {!freeFlowForm.id && '*'}</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFreeFlowImageChange}
          />
          {freeFlowForm.imagePreview && (
            <div className="image-preview mt-2">
              <img 
                src={freeFlowForm.imagePreview} 
                alt="Free Flow Preview" 
                style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          )}
          {freeFlowForm.id && !freeFlowForm.imagePreview && miceFreeFlow?.image && (
            <div className="mt-2">
              <p className="text-muted small">Current image:</p>
              <img 
                src={getImageUrl('freeflow', miceFreeFlow.image)}
                alt="Current" 
                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group mt-3">
          <label>Meeting Free Flow Entry *</label>
          <textarea
            className="form-control"
            name="meetingText"
            placeholder="Enter Meeting description"
            value={freeFlowForm.meetingText}
            onChange={handleFreeFlowChange}
            rows="2"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Incentives Free Flow Entry *</label>
          <textarea
            className="form-control"
            name="incentivesText"
            placeholder="Enter Incentives description"
            value={freeFlowForm.incentivesText}
            onChange={handleFreeFlowChange}
            rows="2"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Conference Free Flow Entry *</label>
          <textarea
            className="form-control"
            name="conferenceText"
            placeholder="Enter Conference description"
            value={freeFlowForm.conferenceText}
            onChange={handleFreeFlowChange}
            rows="2"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Events Free Flow Entry *</label>
          <textarea
            className="form-control"
            name="eventsText"
            placeholder="Enter Events description"
            value={freeFlowForm.eventsText}
            onChange={handleFreeFlowChange}
            rows="2"
            required
          />
        </div>

        <div className="form-actions d-flex gap-3 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : (freeFlowForm.id ? 'Update' : 'Save')}
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default FreeFlowForm;