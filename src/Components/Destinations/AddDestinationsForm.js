// AddDestination.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddDestination = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get destination ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Dropdown data for countries - only domestic
  const [countries, setCountries] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    country_id: '',
    name: '',
    short_desc: ''
  });

  // Load countries dropdown - Only domestic countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${baseurl}/api/countries`);
      const data = await response.json();
      
      // Filter only domestic countries (is_domestic == 1)
      const domesticCountries = Array.isArray(data) 
        ? data.filter(country => country.is_domestic == 1)
        : [];
      
      setCountries(domesticCountries);
    } catch (err) {
      console.error("Countries load error", err);
      setError("Failed to load domestic countries");
    }
  };

  // Fetch destination data if in edit mode
  const fetchDestinationData = async () => {
    if (!id) return;
    
    try {
      setFetching(true);
      const response = await fetch(`${baseurl}/api/destinations/${id}`);
      const result = await response.json();

      if (response.ok) {
        setIsEditMode(true);
        setFormData({
          country_id: result.country_id || '',
          name: result.name || '',
          short_desc: result.short_desc || ''
        });

        // If we need to fetch the country info for editing, ensure it's domestic
        if (result.country_id && result.is_domestic !== 1) {
          setError("Warning: This destination is currently linked to an international country. Please select a domestic country.");
        }
      } else {
        setError(result.message || 'Failed to fetch destination data');
        setTimeout(() => navigate('/destinations'), 2000);
      }
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Error loading destination data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCountries();
    if (id) {
      fetchDestinationData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'country_id' ? Number(value) : value
    }));
  };

  const handleBack = () => navigate('/destinations');

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Destination name is required");
      return;
    }
    if (!formData.country_id) {
      alert("Please select a country");
      return;
    }

    try {
      setLoading(true);

      const url = isEditMode 
        ? `${baseurl}/api/destinations/${id}`
        : `${baseurl}/api/destinations`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        if (isEditMode) {
          alert("Destination updated successfully!");
        } else {
          alert("Destination added successfully!");
        }
        
        navigate('/destinations');
      } else {
        const errorMsg = result.message || result.error || 
          (isEditMode ? "Failed to update destination" : "Failed to add destination");
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Save destination error:", err);
      alert(`Error ${isEditMode ? 'updating' : 'adding'} destination. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit Domestic Destination' : 'Add Domestic Destination'}</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading destination data...
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destination Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Kerala, Goa, Rajasthan"
                        required
                        disabled={loading}
                      />
                      {/* <Form.Text className="text-muted">
                        Name of the domestic destination within India
                      </Form.Text> */}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Country *</Form.Label>
                      <Form.Select
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Select Domestic Country</option>
                        {countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.name} 
                          </option>
                        ))}
                      </Form.Select>
                      {/* <Form.Text className="text-muted">
                        Only domestic countries (is_domestic = 1) are shown here
                      </Form.Text> */}
                      {countries.length === 0 && (
                        <Alert variant="warning" className="mt-2 py-1">
                          <small>No domestic countries found. Please add domestic countries first.</small>
                        </Alert>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Short Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="short_desc"
                        value={formData.short_desc}
                        onChange={handleChange}
                        placeholder="Brief description of the domestic destination..."
                        disabled={loading}
                      />
                      {/* <Form.Text className="text-muted">
                        Optional: A short description about this domestic destination
                      </Form.Text> */}
                    </Form.Group>

                    {/* Information box about domestic destinations */}
                    {/* <div className="p-3 bg-light rounded mb-3">
                      <h6 className="text-success mb-2">ℹ️ Domestic Destination Information</h6>
                      <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>
                        <strong>Note:</strong> This form is for adding domestic destinations only.
                      </p>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                        Domestic destinations are locations within India (e.g., Kerala, Goa, Rajasthan).
                        For international destinations, please use the "Add International Destination" form.
                      </p>
                    </div> */}
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button variant="outline-secondary" onClick={handleBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant={isEditMode ? "warning" : "primary"} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> 
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : isEditMode ? 'Update Domestic Destination' : 'Add Domestic Destination'}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddDestination;