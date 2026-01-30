import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MiceInternationalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // International data
  const countries = ['Dubai', 'United Kingdom', 'Spain', 'Germany', 'China', 'Thailand', 'Singapore', 'Malaysia', 'USA', 'France'];
  const categories = ['Conference', 'Meeting', 'Incentive', 'Exhibition', 'Seminar', 'Workshop', 'Summit', 'Forum'];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    category: '',
    startDate: '',
    endDate: '',
    participants: '',
    venue: '',
    organizer: '',
    budget: '',
    visaRequired: false,
    accommodation: ''
  });

  // Sample data for edit mode
  const sampleEvents = [
    { 
      id: 'MI001', 
      name: 'Global Tech Summit Dubai', 
      country: 'Dubai', 
      startDate: '2024-06-10', 
      endDate: '2024-06-12', 
      description: 'International technology conference',
      category: 'Conference',
      participants: '2000',
      venue: 'Dubai World Trade Centre',
      organizer: 'Tech Global',
      budget: '1000000',
      visaRequired: true,
      accommodation: 'Burj Al Arab'
    },
  ];

  useEffect(() => {
    if (id) {
      // Edit mode
      setEditMode(true);
      const eventToEdit = sampleEvents.find(event => event.id === id);
      if (eventToEdit) {
        setFormData({
          name: eventToEdit.name || '',
          description: eventToEdit.description || '',
          country: eventToEdit.country || '',
          category: eventToEdit.category || '',
          startDate: eventToEdit.startDate || '',
          endDate: eventToEdit.endDate || '',
          participants: eventToEdit.participants || '',
          venue: eventToEdit.venue || '',
          organizer: eventToEdit.organizer || '',
          budget: eventToEdit.budget || '',
          visaRequired: eventToEdit.visaRequired || false,
          accommodation: eventToEdit.accommodation || ''
        });
      }
    } else {
      // Add mode
      setEditMode(false);
      setFormData({
        name: '',
        description: '',
        country: '',
        category: '',
        startDate: '',
        endDate: '',
        participants: '',
        venue: '',
        organizer: '',
        budget: '',
        visaRequired: false,
        accommodation: ''
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save to API or context
    console.log('Form submitted:', formData);
    alert(editMode ? 'Event updated successfully!' : 'Event added successfully!');
    navigate('/mice');
  };

  const handleCancel = () => {
    navigate('/mice');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 mb-3">
          <button 
            className="btn btn-link" 
            onClick={() => navigate('/mice')}
          >
            ← Back to MICE
          </button>
          <h2 className="mt-2">{editMode ? 'Edit International MICE Event' : 'Add New International MICE Event'}</h2>
        </div>
      </div>

      <div className="row">
        {/* Left Panel - Countries and Categories */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h5>Countries</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {countries.map((country, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-globe me-2 text-warning"></i>
                    {country}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5>Event Types</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {categories.map((category, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-calendar-check me-2 text-warning"></i>
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Details Form */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Event Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Country *</label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Participants *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      placeholder="Number of participants"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">End Date *</label>
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

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed event description..."
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Venue</label>
                    <input
                      type="text"
                      className="form-control"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="Event venue"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Organizer</label>
                    <input
                      type="text"
                      className="form-control"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      placeholder="Event organizer"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Budget ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Estimated budget in USD"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Accommodation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="accommodation"
                      value={formData.accommodation}
                      onChange={handleChange}
                      placeholder="Hotel/Resort name"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="visaRequired"
                        checked={formData.visaRequired}
                        onChange={handleChange}
                        id="visaRequired"
                      />
                      <label className="form-check-label fw-semibold" htmlFor="visaRequired">
                        Visa Required
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons mt-4">
                  <div className="d-flex justify-content-between">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCancel}
                    >
                      <i className="fas fa-times me-2"></i>Cancel
                    </button>
                    
                    <div className="btn-group">
                      <button type="submit" className="btn btn-primary me-2">
                        <i className="fas fa-save me-2"></i>
                        {editMode ? 'Update Event' : 'Save Event'}
                      </button>
                      <button type="button" className="btn btn-success me-2">
                        <i className="fas fa-download me-2"></i>Download Info
                      </button>
                      <button type="button" className="btn btn-info me-2">
                        <i className="fas fa-envelope me-2"></i>Email Details
                      </button>
                      <button type="button" className="btn btn-warning">
                        <i className="fas fa-credit-card me-2"></i>Book Now (Payment)
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

export default MiceInternationalForm;