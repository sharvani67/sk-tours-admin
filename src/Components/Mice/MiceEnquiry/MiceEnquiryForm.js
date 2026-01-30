import React, { useState } from 'react';

const MiceEnquiryForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    participants: '',
    budget: '',
    destination: '',
    requirements: '',
    hearAboutUs: ''
  });

  const eventTypes = ['Conference', 'Meeting', 'Incentive', 'Exhibition', 'Seminar', 'Workshop', 'Summit'];
  const destinations = ['Domestic', 'International - Dubai', 'International - UK', 'International - Spain', 
    'International - Germany', 'International - China', 'International - Thailand', 'International - Singapore'];
  const hearAboutUs = ['Search Engine', 'Social Media', 'Referral', 'Advertisement', 'Previous Client', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('MICE Enquiry Submitted:', formData);
    alert('Thank you for your MICE enquiry! We will contact you shortly.');
    
    // Reset form
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      participants: '',
      budget: '',
      destination: '',
      requirements: '',
      hearAboutUs: ''
    });
  };

  return (
    <div className="mice-enquiry-form">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">MICE Enquiry Form</h3>
          <p className="mb-0">Fill in your details for MICE event planning assistance</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Company/Organization *</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Event Type *</label>
                <select
                  className="form-select"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Expected Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-4 mb-3">
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
                <label className="form-label fw-semibold">Estimated Budget *</label>
                <input
                  type="number"
                  className="form-control"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Estimated budget in ₹"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Preferred Destination *</label>
                <select
                  className="form-select"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest, index) => (
                    <option key={index} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Specific Requirements</label>
              <textarea
                className="form-control"
                rows="4"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Please provide any specific requirements, preferences, or additional information..."
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">How did you hear about us? *</label>
              <select
                className="form-select"
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                {hearAboutUs.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="fas fa-paper-plane me-2"></i>Submit Enquiry
              </button>
              <button type="reset" className="btn btn-secondary btn-lg">
                <i className="fas fa-redo me-2"></i>Reset Form
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer bg-light">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            We will contact you within 24 hours to discuss your MICE requirements.
          </small>
        </div>
      </div>
    </div>
  );
};

export default MiceEnquiryForm;