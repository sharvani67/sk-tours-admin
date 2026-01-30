import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../Shared/Navbar/Navbar';

const DomesticExhibitionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // Domestic products/categories
  const domesticCategories = [
    { id: 'DOME00001', name: 'Agriculture', code: 'DOME00001' },
    { id: 'DOME00002', name: 'Bathroom Fittings', code: 'DOME00002' },
    { id: 'DOME00003', name: 'Furniture', code: 'DOME00003' },
    { id: 'DOME00004', name: 'Electronics', code: 'DOME00004' },
    { id: 'DOME00005', name: 'Textiles', code: 'DOME00005' },
    { id: 'DOME00006', name: 'Automobile', code: 'DOME00006' },
    { id: 'DOME00007', name: 'Real Estate', code: 'DOME00007' },
    { id: 'DOME00008', name: 'Healthcare', code: 'DOME00008' },
    { id: 'DOME00009', name: 'Education', code: 'DOME00009' },
    { id: 'DOME00010', name: 'Food & Beverage', code: 'DOME00010' },
  ];

  // Indian cities
  const indianCities = ['Mumbai', 'New Delhi', 'Pune', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    startDate: '',
    endDate: '',
    selectedCategory: null
  });

  // Sample data for edit mode
  const sampleExhibitions = [
    { id: 'DOME00001', name: 'Agriculture Exhibition', city: 'Mumbai', startDate: '2024-03-01', endDate: '2024-03-05', description: 'Agriculture and farming exhibition showcasing latest technologies and equipment.' },
    { id: 'DOME00002', name: 'Pharmaceutical Expo', city: 'Delhi', startDate: '2024-04-10', endDate: '2024-04-15', description: 'Pharmaceutical industry exhibition with international participants.' },
  ];

  useEffect(() => {
    if (id) {
      // Edit mode
      setEditMode(true);
      const exhibitionToEdit = sampleExhibitions.find(ex => ex.id === id);
      if (exhibitionToEdit) {
        setFormData({
          name: exhibitionToEdit.name,
          description: exhibitionToEdit.description,
          city: exhibitionToEdit.city,
          startDate: exhibitionToEdit.startDate,
          endDate: exhibitionToEdit.endDate,
          selectedCategory: domesticCategories[0] // Default to first category for demo
        });
      }
    } else {
      // Add mode
      setEditMode(false);
      setFormData({
        name: '',
        description: '',
        city: '',
        startDate: '',
        endDate: '',
        selectedCategory: null
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, selectedCategory: category }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save to API or context
    console.log('Form submitted:', formData);
    alert(editMode ? 'Exhibition updated successfully!' : 'Exhibition added successfully!');
    navigate('/exhibition');
  };

  const handleCancel = () => {
    navigate('/exhibition');
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
                      onClick={() => navigate('/exhibition')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Exhibition
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {editMode ? 'Edit Domestic Exhibition' : 'Add Domestic Exhibition'}
                  </li>
                </ol>
              </nav>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                  <i className="bi bi-building me-2 text-primary"></i>
                  {editMode ? 'Edit Domestic Exhibition' : 'Add New Domestic Exhibition'}
                </h2>
                {formData.selectedCategory && (
                  <div className="badge bg-primary fs-6">
                    <i className="bi bi-tag me-2"></i>
                    {formData.selectedCategory.name}
                  </div>
                )}
              </div>
              <p className="text-muted">
                {editMode 
                  ? 'Update the details of your domestic exhibition' 
                  : 'Fill in the details to create a new domestic exhibition entry'}
              </p>
            </div>
          </div>

          <div className="row">
            {/* Left Panel - Categories */}
            <div className="col-lg-4 col-md-5 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-grid me-2"></i>
                    Product Categories
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {domesticCategories.map(category => (
                      <div
                        key={category.id}
                        className={`list-group-item list-group-item-action ${formData.selectedCategory?.id === category.id ? 'active bg-primary text-white' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                        style={{ cursor: 'pointer', borderLeft: formData.selectedCategory?.id === category.id ? '4px solid #0d6efd' : '4px solid transparent' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{category.name}</strong>
                            <small className={`d-block ${formData.selectedCategory?.id === category.id ? 'text-white-50' : 'text-muted'}`}>
                              Code: {category.code}
                            </small>
                          </div>
                          {formData.selectedCategory?.id === category.id && (
                            <i className="bi bi-check-circle-fill"></i>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <small className="text-muted">
                    {formData.selectedCategory 
                      ? `Selected: ${formData.selectedCategory.name}`
                      : 'Select a category to proceed'}
                  </small>
                </div>
              </div>
            </div>

            {/* Right Panel - Details Form */}
            <div className="col-lg-8 col-md-7">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-pencil-square me-2"></i>
                    Exhibition Details
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-card-heading me-2"></i>
                        Exhibition Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter exhibition name"
                        required
                      />
                      <div className="form-text">Enter a descriptive name for the exhibition</div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-text-paragraph me-2"></i>
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter detailed description about the exhibition..."
                        required
                      />
                      <div className="form-text">Describe the exhibition objectives, target audience, and highlights</div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          <i className="bi bi-geo-alt me-2"></i>
                          Select City
                        </label>
                        <select
                          className="form-select"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose city...</option>
                          {indianCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        <div className="form-text">Select the city where exhibition will be held</div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">
                          <i className="bi bi-calendar-date me-2"></i>
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">
                          <i className="bi bi-calendar-check me-2"></i>
                          End Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Preview Section */}
                    {(formData.name || formData.description) && (
                      <div className="mb-4">
                        <div className="card border-primary">
                          <div className="card-header bg-primary bg-opacity-10">
                            <h6 className="mb-0">
                              <i className="bi bi-eye me-2"></i>
                              Preview
                            </h6>
                          </div>
                          <div className="card-body">
                            <h5 className="text-primary">{formData.name || '[Exhibition Name]'}</h5>
                            <p className="mb-2">{formData.description || '[Description will appear here]'}</p>
                            <div className="text-muted">
                              {formData.city && <span className="me-3"><i className="bi bi-geo-alt"></i> {formData.city}</span>}
                              {formData.startDate && <span className="me-3"><i className="bi bi-calendar-event"></i> {formData.startDate}</span>}
                              {formData.endDate && <span><i className="bi bi-calendar-check"></i> {formData.endDate}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons mt-4 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary px-4" 
                          onClick={handleCancel}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel
                        </button>
                        <div className="d-flex gap-3">
                          <button type="submit" className="btn btn-primary px-4">
                            <i className="bi bi-save me-2"></i>
                            {editMode ? 'Update Exhibition' : 'Save Exhibition'}
                          </button>
                          <button type="button" className="btn btn-success px-4">
                            <i className="bi bi-credit-card me-2"></i>
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DomesticExhibitionForm;