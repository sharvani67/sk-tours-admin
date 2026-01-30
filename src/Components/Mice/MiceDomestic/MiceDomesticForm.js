import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MiceDomesticForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // Domestic data
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Goa', 'Jaipur', 'Kochi'];
  const categories = ['Conference', 'Meeting', 'Incentive', 'Exhibition', 'Seminar', 'Workshop'];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    city: '',
    startDate: '',
    endDate: '',
    participants: '',
    venue: '',
    organizer: '',
    budget: ''
  });

  // Sample data for edit mode
  const sampleEvents = [
    { 
      id: 'MD001', 
      name: 'Corporate Conference Mumbai', 
      city: 'Mumbai', 
      startDate: '2024-04-15', 
      endDate: '2024-04-17', 
      description: 'Annual corporate conference for IT companies',
      category: 'Conference',
      participants: '500',
      venue: 'Taj Hotel',
      organizer: 'Tech Corp',
      budget: '500000'
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
          category: eventToEdit.category || '',
          city: eventToEdit.city || '',
          startDate: eventToEdit.startDate || '',
          endDate: eventToEdit.endDate || '',
          participants: eventToEdit.participants || '',
          venue: eventToEdit.venue || '',
          organizer: eventToEdit.organizer || '',
          budget: eventToEdit.budget || ''
        });
      }
    } else {
      // Add mode
      setEditMode(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        city: '',
        startDate: '',
        endDate: '',
        participants: '',
        venue: '',
        organizer: '',
        budget: ''
      });
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
          <h2 className="mt-2">{editMode ? 'Edit Domestic MICE Event' : 'Add New Domestic MICE Event'}</h2>
        </div>
      </div>

      <div className="row">
        {/* Left Panel - Categories */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5>MICE Categories</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {categories.map((category, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-calendar-alt me-2 text-info"></i>
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-info text-white">
              <h5>Cities</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {cities.map((city, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-city me-2 text-info"></i>
                    {city}
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
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">City *</label>
                    <select
                      className="form-select"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select city</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Budget (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Estimated budget"
                    />
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

export default MiceDomesticForm;