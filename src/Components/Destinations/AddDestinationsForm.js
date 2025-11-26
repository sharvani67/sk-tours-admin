import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddDestination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dropdown data for countries
  const [countries, setCountries] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    country_id: '',
    name: '',
    short_desc: ''
  });

  // Load countries dropdown
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${baseurl}/api/countries`);
      const data = await response.json();
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Countries load error", err);
      setError("Failed to load countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

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
      setError("Destination name is required");
      return;
    }
    if (!formData.country_id) {
      setError("Please select a country");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${baseurl}/api/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess("Destination added successfully!");
        
        // Reset form
        setFormData({
          country_id: '',
          name: '',
          short_desc: ''
        });

        setTimeout(() => {
          navigate('/destinations');
        }, 1500);
      } else {
        const errData = await response.json();
        setError(errData.message || errData.error || "Failed to add destination");
      }
    } catch (err) {
      console.error("Add destination error:", err);
      setError("Error adding destination. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Add Destination</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
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
                      placeholder="e.g., Kerala, Bangkok, Paris"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Country *</Form.Label>
                    <Form.Select
                      name="country_id"
                      value={formData.country_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.name} {country.is_domestic ? "(Domestic)" : "(International)"}
                        </option>
                      ))}
                    </Form.Select>
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
                      placeholder="Brief description of the destination..."
                    />
                    <Form.Text className="text-muted">
                      Optional: A short description about this destination
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Saving..." : "Add Destination"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddDestination;