import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../Shared/Navbar/Navbar';

const InternationalExhibitionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // International categories
  const internationalCategories = [
    { id: 'INTE00001', name: 'ATM', code: 'INTE00001' },
    { id: 'INTE00002', name: 'Gulf Food', code: 'INTE00002' },
    { id: 'INTE00003', name: 'IT & Technology', code: 'INTE00003' },
    { id: 'INTE00004', name: 'Healthcare', code: 'INTE00004' },
    { id: 'INTE00005', name: 'Automotive', code: 'INTE00005' },
    { id: 'INTE00006', name: 'Education', code: 'INTE00006' },
    { id: 'INTE00007', name: 'Real Estate', code: 'INTE00007' },
    { id: 'INTE00008', name: 'Tourism & Hospitality', code: 'INTE00008' },
    { id: 'INTE00009', name: 'Renewable Energy', code: 'INTE00009' },
    { id: 'INTE00010', name: 'Fashion & Textiles', code: 'INTE00010' },
  ];

  const countries = [
    { name: 'Dubai', flag: '🇦🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Australia', flag: '🇦🇺' },
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    startDate: '',
    endDate: '',
    selectedCategory: null
  });

  // Sample data for edit mode
  const sampleExhibitions = [
    { 
      id: 'INTE00001', 
      name: 'ATM Expo Dubai', 
      country: 'Dubai', 
      startDate: '2024-03-15', 
      endDate: '2024-03-20', 
      description: 'Leading travel technology exhibition in the Middle East, showcasing innovations in travel and tourism.' 
    },
    { 
      id: 'INTE00002', 
      name: 'Gulf Food Exhibition', 
      country: 'Dubai', 
      startDate: '2024-04-05', 
      endDate: '2024-04-10', 
      description: 'World\'s largest annual food and hospitality trade show in the Middle East.' 
    },
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
          country: exhibitionToEdit.country,
          startDate: exhibitionToEdit.startDate,
          endDate: exhibitionToEdit.endDate,
          selectedCategory: internationalCategories[0] // Default to first category for demo
        });
      }
    } else {
      // Add mode
      setEditMode(false);
      setFormData({
        name: '',
        description: '',
        country: '',
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

  const handleCountrySelect = (country) => {
    setFormData(prev => ({ ...prev, country: country.name }));
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
                    {editMode ? 'Edit International Exhibition' : 'Add International Exhibition'}
                  </li>
                </ol>
              </nav>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                  <i className="bi bi-globe-americas me-2 text-success"></i>
                  {editMode ? 'Edit International Exhibition' : 'Add New International Exhibition'}
                </h2>
                <div className="d-flex gap-2">
                  {formData.selectedCategory && (
                    <span className="badge bg-primary fs-6">
                      <i className="bi bi-tag me-2"></i>
                      {formData.selectedCategory.name}
                    </span>
                  )}
                  {formData.country && (
                    <span className="badge bg-success fs-6">
                      <i className="bi bi-geo-alt me-2"></i>
                      {formData.country}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted">
                {editMode 
                  ? 'Update the details of your international exhibition' 
                  : 'Fill in the details to create a new international exhibition entry'}
              </p>
            </div>
          </div>

          <div className="row">
            {/* Left Panel - Categories and Countries */}
            <div className="col-lg-4 col-md-5 mb-4">
              {/* Categories Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Product Categories
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {internationalCategories.map(category => (
                      <div
                        key={category.id}
                        className={`list-group-item list-group-item-action ${formData.selectedCategory?.id === category.id ? 'active bg-primary text-white' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                        style={{ 
                          cursor: 'pointer', 
                          borderLeft: formData.selectedCategory?.id === category.id ? '4px solid #0d6efd' : '4px solid transparent' 
                        }}
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
              </div>

              {/* Countries Card */}
              <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-flag me-2"></i>
                    Select Country
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {countries.map(country => (
                      <div
                        key={country.name}
                        className={`list-group-item list-group-item-action ${formData.country === country.name ? 'active bg-success text-white' : ''}`}
                        onClick={() => handleCountrySelect(country)}
                        style={{ 
                          cursor: 'pointer',
                          borderLeft: formData.country === country.name ? '4px solid #198754' : '4px solid transparent'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <span className="fs-5 me-3">{country.flag}</span>
                          <div>
                            <strong>{country.name}</strong>
                          </div>
                          {formData.country === country.name && (
                            <i className="bi bi-check-circle-fill ms-auto"></i>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <div className="form-text">Enter the official name of the international exhibition</div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-text-paragraph me-2"></i>
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="5"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter detailed description about the international exhibition..."
                        required
                      />
                      <div className="form-text">Describe the exhibition scope, international participation, and key highlights</div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          <i className="bi bi-globe me-2"></i>
                          Selected Country
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            {countries.find(c => c.name === formData.country)?.flag || '🌍'}
                          </span>
                          <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.country || 'Please select a country from the left panel'}
                            readOnly
                          />
                        </div>
                        <div className="form-text">Country selected for the exhibition venue</div>
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
                    {(formData.name || formData.description || formData.country) && (
                      <div className="mb-4">
                        <div className="card border-success">
                          <div className="card-header bg-success bg-opacity-10">
                            <h6 className="mb-0">
                              <i className="bi bi-eye me-2"></i>
                              International Exhibition Preview
                            </h6>
                          </div>
                          <div className="card-body">
                            <h5 className="text-success">
                              <i className="bi bi-globe-americas me-2"></i>
                              {formData.name || '[Exhibition Name]'}
                            </h5>
                            <p className="mb-3">{formData.description || '[Description will appear here]'}</p>
                            <div className="d-flex gap-3 text-muted">
                              {formData.country && (
                                <span>
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {countries.find(c => c.name === formData.country)?.flag} {formData.country}
                                </span>
                              )}
                              {formData.startDate && (
                                <span>
                                  <i className="bi bi-calendar-event me-1"></i>
                                  Starts: {formData.startDate}
                                </span>
                              )}
                              {formData.endDate && (
                                <span>
                                  <i className="bi bi-calendar-check me-1"></i>
                                  Ends: {formData.endDate}
                                </span>
                              )}
                            </div>
                            {formData.selectedCategory && (
                              <div className="mt-3">
                                <span className="badge bg-info">
                                  <i className="bi bi-tag me-1"></i>
                                  Category: {formData.selectedCategory.name}
                                </span>
                              </div>
                            )}
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
                            Book Internationally
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

export default InternationalExhibitionForm;