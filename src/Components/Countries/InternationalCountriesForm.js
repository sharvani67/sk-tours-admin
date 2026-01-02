// AddInternationalCountry.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddInternationalCountry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state - International countries always have is_domestic = 0
  const [formData, setFormData] = useState({
    name: '',
    is_domestic: 0 // Always 0 for international
  });

  // Fetch country data if in edit mode
  useEffect(() => {
    if (id) {
      fetchCountryData();
    }
  }, [id]);

  const fetchCountryData = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${baseurl}/api/countries/${id}`);
      const result = await response.json();

      if (response.ok) {
        setIsEditMode(true);
        setFormData({
          name: result.name || '',
          is_domestic: result.is_domestic || 0
        });
      } else {
        setError(result.message || 'Failed to fetch country data');
        setTimeout(() => navigate('/intl-countries'), 2000);
      }
    } catch (err) {
      console.error('Error fetching country:', err);
      setError('Error loading country data');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => navigate('/international-countries');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError("Country name is required");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const url = isEditMode 
        ? `${baseurl}/api/countries/${id}`
        : `${baseurl}/api/countries/add-country`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          is_domestic: 0 // Always international
        })
      });

      const result = await response.json();

      if (response.ok) {
        const message = isEditMode 
          ? "International country updated successfully!" 
          : "International country added successfully!";
        
        setSuccess(message);

        setTimeout(() => {
          navigate('/international-countries');
        }, 1500);
      } else {
        setError(result.message || result.error || 
          (isEditMode ? "Failed to update country" : "Failed to add country"));
      }
    } catch (err) {
      console.error("Save country error:", err);
      setError(`Error ${isEditMode ? 'updating' : 'adding'} country. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit International Country' : 'Add International Country'}</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading country data...
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter international country name (e.g., USA, UK, Australia)"
                        required
                        disabled={loading}
                      />
                      <Form.Text className="text-muted">
                        This will be marked as international country (is_domestic = 0) automatically.
                      </Form.Text>
                    </Form.Group>

                    {/* Hidden field to show info about international status */}
                    <div className="mb-3 p-2 bg-light rounded">
                      <small className="text-info">
                        <strong>Note:</strong> This country will be saved as an international country.
                      </small>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button variant="outline-secondary" onClick={handleBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant={isEditMode ? "warning" : "primary"} disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> 
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : isEditMode ? 'Update Country' : 'Add Country'}
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

export default AddInternationalCountry;