// MicEnquiryFormEdit.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const MicEnquiryFormEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state with all fields
  const [formData, setFormData] = useState({
    company_name: '',
    reference_no: '',
    contact_person: '',
    cell_no: '',
    email: '',
    city: '',
    pin_code: '',
    state: '',
    country: '',
    num_people: 1,
    num_rooms: 1,
    single_room: 0,
    double_room: 0,
    triple_room: 0,
    suite_room: 0,
    city_type: '',
    city_name: '',
    domestic_destination: '',
    international_destination: '',
    hotel_category: '',
    budget: '',
    common_inclusion: ''
  });

  // Fetch enquiry data if in edit mode
  const fetchEnquiryData = async () => {
    if (!id) return;
    
    try {
      setFetching(true);
      const response = await fetch(`${baseurl}/api/mice/enquiry-form`);
      const result = await response.json();

      if (response.ok) {
        // Find the specific enquiry by ID
        const enquiry = Array.isArray(result) ? result.find(item => item.id === parseInt(id)) : null;
        
        if (enquiry) {
          setIsEditMode(true);
          setFormData({
            company_name: enquiry.company_name || '',
            reference_no: enquiry.reference_no || '',
            contact_person: enquiry.contact_person || '',
            cell_no: enquiry.cell_no || '',
            email: enquiry.email || '',
            city: enquiry.city || '',
            pin_code: enquiry.pin_code || '',
            state: enquiry.state || '',
            country: enquiry.country || '',
            num_people: enquiry.num_people || 1,
            num_rooms: enquiry.num_rooms || 1,
            single_room: enquiry.single_room || 0,
            double_room: enquiry.double_room || 0,
            triple_room: enquiry.triple_room || 0,
            suite_room: enquiry.suite_room || 0,
            city_type: enquiry.city_type || '',
            city_name: enquiry.city_name || '',
            domestic_destination: enquiry.domestic_destination || '',
            international_destination: enquiry.international_destination || '',
            hotel_category: enquiry.hotel_category || '',
            budget: enquiry.budget || '',
            common_inclusion: enquiry.common_inclusion || ''
          });
        } else {
          setError('Enquiry not found');
          setTimeout(() => navigate('/micenquiry-form'), 2000);
        }
      } else {
        setError('Failed to fetch enquiry data');
      }
    } catch (err) {
      console.error('Error fetching enquiry:', err);
      setError('Error loading enquiry data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEnquiryData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleCityTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      city_type: prev.city_type === type ? '' : type,
      city_name: '' // Reset city name when changing type
    }));
  };

  const handleBack = () => navigate('/mice');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.company_name.trim()) {
      setError("Company name is required");
      return;
    }
    if (!formData.contact_person.trim()) {
      setError("Contact person is required");
      return;
    }
    if (!formData.cell_no.trim()) {
      setError("Cell number is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const url = `${baseurl}/api/mice/enquiry/${id}`;
      const method = 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Enquiry updated successfully!");
        setTimeout(() => {
          navigate('/mice');
        }, 1500);
      } else {
        setError(result.message || result.error || "Failed to update enquiry");
      }
    } catch (err) {
      console.error("Save enquiry error:", err);
      setError("Error updating enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit MICE Enquiry' : 'Add MICE Enquiry'}</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading enquiry data...
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                {/* Company Information - Row 1 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Company Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Reference No</Form.Label>
                      <Form.Control
                        type="text"
                        name="reference_no"
                        value={formData.reference_no}
                        onChange={handleChange}
                        placeholder="Auto-generated or enter manually"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Contact Person *</Form.Label>
                      <Form.Control
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        placeholder="Enter contact person name"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Contact Information - Row 2 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Cell No *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cell_no"
                        value={formData.cell_no}
                        onChange={handleChange}
                        placeholder="Enter cell number"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Email ID *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Location Details - Row 3 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={handleChange}
                        placeholder="Enter pin code"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* People and Rooms - Row 4 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>No of People</Form.Label>
                      <Form.Control
                        type="number"
                        name="num_people"
                        min="1"
                        value={formData.num_people}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>No of Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="num_rooms"
                        min="1"
                        value={formData.num_rooms}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Single Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="single_room"
                        min="0"
                        value={formData.single_room}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Room Types - Row 5 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Double Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="double_room"
                        min="0"
                        value={formData.double_room}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Triple Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="triple_room"
                        min="0"
                        value={formData.triple_room}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Suite Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="suite_room"
                        min="0"
                        value={formData.suite_room}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* City Type Selection - Row 6 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City Type</Form.Label>
                      <div className="d-flex gap-3 mt-2">
                        <Form.Check
                          type="checkbox"
                          label="One City"
                          checked={formData.city_type === "one"}
                          onChange={() => handleCityTypeChange("one")}
                          disabled={loading}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Multiple Cities"
                          checked={formData.city_type === "multiple"}
                          onChange={() => handleCityTypeChange("multiple")}
                          disabled={loading}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>City Name(s)</Form.Label>
                      <Form.Control
                        type="text"
                        name="city_name"
                        value={formData.city_name}
                        onChange={handleChange}
                        placeholder={formData.city_type === "one" ? "Enter city name" : "Enter multiple cities (comma separated)"}
                        disabled={loading || !formData.city_type}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Destinations - Row 7 */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Domestic Destination</Form.Label>
                      <Form.Control
                        type="text"
                        name="domestic_destination"
                        value={formData.domestic_destination}
                        onChange={handleChange}
                        placeholder="Mention city names for domestic event"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>International Destination</Form.Label>
                      <Form.Control
                        type="text"
                        name="international_destination"
                        value={formData.international_destination}
                        onChange={handleChange}
                        placeholder="Mention city & country names for international event"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Hotel Requirements - Row 8 */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Hotel Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="hotel_category"
                        value={formData.hotel_category}
                        onChange={handleChange}
                        placeholder="e.g., 2, 3, 4, 5 star"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Budget per person</Form.Label>
                      <Form.Control
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Enter approximate budget"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Common Inclusion</Form.Label>
                      <Form.Control
                        type="text"
                        name="common_inclusion"
                        value={formData.common_inclusion}
                        onChange={handleChange}
                        placeholder="e.g., Airport Transfers, Meals, Tours"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="outline-secondary" onClick={handleBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="warning" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> 
                        Updating...
                      </>
                    ) : 'Update Enquiry'}
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

export default MicEnquiryFormEdit;