// AddInternationalDestination.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddInternationalDestination = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Dropdown data for international countries only
  const [countries, setCountries] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    country_id: '',
    name: '',
    short_desc: ''
  });

  // Load international countries dropdown
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${baseurl}/api/countries/international`);
      const data = await response.json();
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("International countries load error", err);
      setError("Failed to load international countries");
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
      } else {
        setError(result.message || 'Failed to fetch destination data');
        setTimeout(() => navigate('/intl-destinations'), 2000);
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

  const handleBack = () => navigate('/intl-destinations');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError("Destination name is required");
      return;
    }
    if (!formData.country_id) {
      setError("Please select an international country");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

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
        const message = isEditMode 
          ? "International destination updated successfully!" 
          : "International destination added successfully!";
        
        setSuccess(message);

        setTimeout(() => {
          navigate('/intl-destinations');
        }, 1500);
      } else {
        setError(result.message || result.error || 
          (isEditMode ? "Failed to update destination" : "Failed to add destination"));
      }
    } catch (err) {
      console.error("Save destination error:", err);
      setError(`Error ${isEditMode ? 'updating' : 'adding'} destination. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit International Destination' : 'Add International Destination'}</h2>
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
                        placeholder="e.g., Bangkok, Paris, Dubai"
                        required
                        disabled={loading}
                      />
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
                        <option value="">Select International Country</option>
                        {countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.name} (International)
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Only international countries are shown here
                      </Form.Text>
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
                        placeholder="Brief description of the international destination..."
                        disabled={loading}
                      />
                      <Form.Text className="text-muted">
                        Optional: A short description about this destination
                      </Form.Text>
                    </Form.Group>
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
                    ) : isEditMode ? 'Update Destination' : 'Add Destination'}
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

export default AddInternationalDestination;