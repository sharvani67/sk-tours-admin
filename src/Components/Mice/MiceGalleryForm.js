import React from 'react';
import { Spinner } from 'react-bootstrap';
import { baseurl } from '../../Api/Baseurl';

const GalleryForm = ({ 
  galleryForm, 
  setGalleryForm, 
  loading, 
  handleCancel, 
  fetchData, 
  setShowForm, 
  setError, 
  setSuccessMessage, 
  resetForms 
}) => {
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === validFiles.length) {
            setGalleryForm({
              ...galleryForm,
              images: [...galleryForm.images, ...validFiles],
              imagePreviews: [...galleryForm.imagePreviews, ...newPreviews]
            });
            setError('');
          }
        };
        reader.readAsDataURL(file);
      } else {
        setError('Some files were skipped: Only images under 10MB are allowed');
      }
    });
  };

  const removeImage = (index) => {
    const updatedImages = galleryForm.images.filter((_, i) => i !== index);
    const updatedPreviews = galleryForm.imagePreviews.filter((_, i) => i !== index);
    setGalleryForm({
      ...galleryForm,
      images: updatedImages,
      imagePreviews: updatedPreviews
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (galleryForm.images.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    const formData = new FormData();
    galleryForm.images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${baseurl}/api/mice/gallery`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Images uploaded successfully!');
        await fetchData();
        resetForms();
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Error uploading images');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      <h2>Upload Gallery Images</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Multiple Gallery Images *</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleMultipleImagesChange}
            multiple
            required
          />
          <div className="image-previews-grid d-flex flex-wrap gap-2 mt-2">
            {galleryForm.imagePreviews.map((preview, index) => (
              <div key={index} className="preview-item position-relative">
                <img 
                  src={preview} 
                  alt={`Gallery ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)} 
                  className="remove-image-btn position-absolute top-0 end-0 btn btn-sm btn-danger"
                  style={{ borderRadius: '50%', width: '25px', height: '25px', padding: '0' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions d-flex gap-3 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Upload Images'}
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default GalleryForm;