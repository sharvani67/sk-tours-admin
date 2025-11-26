import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddCountry = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    is_domestic: 0
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const finalValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleBack = () => navigate('/countries');

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

      const response = await fetch(`${baseurl}/api/countries/add-country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          is_domestic: formData.is_domestic ? 1 : 0
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Country added successfully!");

        setTimeout(() => {
          navigate('/countries');
        }, 1500);
      } else {
        setError(result.message || result.error || "Failed to add country");
      }
    } catch (err) {
      console.error("Add country error:", err);
      setError("Error adding country. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Add Country</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
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
                      placeholder="Enter country name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="is_domestic"
                      label="This is a domestic country (e.g., India)"
                      checked={formData.is_domestic}
                      onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Check this if it's a domestic country. Usually only India should be marked as domestic.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : "Add Country"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddCountry;