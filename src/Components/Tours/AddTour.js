import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddTour = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    tour_code: '',
    title: '',
    category_id: '',
    primary_destination_id: '',
    duration_days: '',
    overview: '',
    base_price_adult: '',
    is_international: 0
  });

  // Load categories + destinations
  const fetchDropdownData = async () => {
    try {
      const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : []);

      const destRes = await fetch(`${baseurl}/api/destinations`);
      const destData = await destRes.json();
      setDestinations(Array.isArray(destData) ? destData : []);
    } catch (err) {
      console.error("Dropdown load error", err);
      setError("Failed to load dropdown values");
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Convert number fields correctly
    const finalValue =
      type === "number" || name === "category_id" || name === "primary_destination_id"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleBack = () => navigate('/tours');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!formData.title.trim()) {
      setError("Tour title is required");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${baseurl}/api/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess("Tour added successfully!");

        setTimeout(() => {
          navigate('/tours');
        }, 1500);
      } else {
        const errData = await response.json();
        setError(errData.error || "Failed to add tour");
      }
    } catch (err) {
      console.error("Add tour error:", err);
      setError("Error adding tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Add Tour</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tour Code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="tour_code"
                      value={formData.tour_code}
                      onChange={handleChange}
                      placeholder="e.g., T1001"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tour Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Primary Destination *</Form.Label>
                    <Form.Select
                      name="primary_destination_id"
                      value={formData.primary_destination_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.destination_id} value={d.destination_id}>
                          {d.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration Days *</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration_days"
                      value={formData.duration_days}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price (Adult) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="base_price_adult"
                      value={formData.base_price_adult}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>International Tour?</Form.Label>
                    <Form.Select
                      name="is_international"
                      value={formData.is_international}
                      onChange={handleChange}
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Overview</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="overview"
                      value={formData.overview}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Saving..." : "Add Tour"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddTour;
