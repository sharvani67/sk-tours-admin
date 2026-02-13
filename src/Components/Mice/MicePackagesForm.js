import React from 'react';
import { Spinner } from 'react-bootstrap';
import { baseurl } from '../../Api/Baseurl';

const PackagesForm = ({ 
  packageForm, 
  setPackageForm, 
  loading, 
  handleCancel, 
  fetchData, 
  setShowForm, 
  setError, 
  setSuccessMessage, 
  resetForms 
}) => {
  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageForm({
      ...packageForm,
      [name]: value
    });
  };

  const handlePackageImagesChange = (e) => {
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
            setPackageForm({
              ...packageForm,
              images: [...packageForm.images, ...validFiles],
              imagePreviews: [...packageForm.imagePreviews, ...newPreviews]
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

  const removePackageImage = (index) => {
    const updatedImages = packageForm.images.filter((_, i) => i !== index);
    const updatedPreviews = packageForm.imagePreviews.filter((_, i) => i !== index);
    setPackageForm({
      ...packageForm,
      images: updatedImages,
      imagePreviews: updatedPreviews
    });
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!packageForm.days || packageForm.days <= 0) {
      setError('Please enter a valid number of days');
      return;
    }

    if (!packageForm.price || packageForm.price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!packageForm.id && packageForm.images.length === 0) {
      setError('At least one image is required for new packages');
      return;
    }

    const formData = new FormData();
    formData.append('days', packageForm.days);
    formData.append('price', packageForm.price);
    
    packageForm.images.forEach(image => {
      formData.append('images', image);
    });
    
    if (packageForm.id) {
      formData.append('id', packageForm.id);
    }

    try {
      const response = await fetch(`${baseurl}/api/mice/packages`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Package saved successfully!');
        await fetchData();
        resetForms();
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Error saving package');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      <h2>{packageForm.id ? 'Edit Package' : 'Add New Package'}</h2>
      <form onSubmit={handlePackageSubmit}>
        <div className="form-group">
          <label>Number of Days *</label>
          <input
            type="number"
            className="form-control"
            name="days"
            placeholder="Enter days (e.g., 3)"
            value={packageForm.days}
            onChange={handlePackageChange}
            min="1"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Price (₹) *</label>
          <input
            type="number"
            className="form-control"
            name="price"
            placeholder="Enter price"
            value={packageForm.price}
            onChange={handlePackageChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Upload Package Images {!packageForm.id && '*'}</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handlePackageImagesChange}
            multiple
          />
          <div className="image-previews-grid d-flex flex-wrap gap-2 mt-2">
            {packageForm.imagePreviews.map((preview, index) => (
              <div key={index} className="preview-item position-relative">
                <img 
                  src={preview} 
                  alt={`Package ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button 
                  type="button" 
                  onClick={() => removePackageImage(index)} 
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
            {loading ? <Spinner size="sm" /> : (packageForm.id ? 'Update' : 'Save')}
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default PackagesForm;