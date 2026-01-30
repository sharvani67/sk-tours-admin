import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InternationalExhibitionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // International categories
  const internationalCategories = [
    { id: 'INTE00001', name: 'ATM', code: 'INTE00001' },
    { id: 'INTE00002', name: 'Gulf Food', code: 'INTE00002' },
    // ... rest of categories
  ];

  const countries = ['Dubai', 'United Kingdom', 'Spain', 'Germany', 'China', 'Singapore'];
  
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
    { id: 'INTE00001', name: 'ATM Expo Dubai', country: 'Dubai', startDate: '2024-03-15', endDate: '2024-03-20', description: 'ATM and banking technology exhibition' },
    { id: 'INTE00002', name: 'Gulf Food Exhibition', country: 'Dubai', startDate: '2024-04-05', endDate: '2024-04-10', description: 'Food and beverage exhibition' },
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
          selectedCategory: null
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
    setFormData(prev => ({ ...prev, country }));
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 mb-3">
          <button 
            className="btn btn-link" 
            onClick={() => navigate('/exhibition')}
          >
            ← Back to Exhibition
          </button>
          <h2 className="mt-2">{editMode ? 'Edit International Exhibition' : 'Add New International Exhibition'}</h2>
        </div>
      </div>

      <div className="row">
        {/* Left Panel - Categories and Countries */}
        <div className="col-md-4">
          <div className="category-list mb-4">
            <h4>Product Categories</h4>
            <ul className="list-group">
              {internationalCategories.map(category => (
                <li
                  key={category.id}
                  className={`list-group-item list-group-item-action ${formData.selectedCategory?.id === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{category.name}</strong>
                  <small className="d-block text-muted">Code: {category.code}</small>
                </li>
              ))}
            </ul>
          </div>

          <div className="country-list">
            <h4>Countries</h4>
            <ul className="list-group">
              {countries.map(country => (
                <li
                  key={country}
                  className={`list-group-item list-group-item-action ${formData.country === country ? 'active' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                  style={{ cursor: 'pointer' }}
                >
                  {country}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel - Details Form */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Exhibition Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter exhibition name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter brief description about the international exhibition..."
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Selected Country</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={formData.country || 'Not selected'}
                      readOnly
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">End Date</label>
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

                {/* Action Buttons */}
                <div className="action-buttons">
                  <div className="d-flex justify-content-between">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <div className="btn-group">
                      <button type="submit" className="btn btn-primary me-2">
                        {editMode ? 'Update' : 'Save Details'}
                      </button>
                      <button type="button" className="btn btn-success">
                        Book Now (Payment Gateway)
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
  );
};

export default InternationalExhibitionForm;