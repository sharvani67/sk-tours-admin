import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';

const PassportForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form state for all passport fields - all empty strings
  const [formData, setFormData] = useState({
    applicant_for: '',
    application_type: '',
    passport_booklet: '',
    name: '',
    middle_name: '',
    surname: '',
    dob: '',
    place_of_birth: '',
    cell_no: '',
    email: '',
    pan_no: '',
    aadhaar_no: '',
    qualification: '',
    profession: '',
    govt_employee: '',
    visible_mark: '',
    
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    
    father_name: '',
    father_middle: '',
    father_surname: '',
    mother_name: '',
    mother_middle: '',
    mother_surname: '',
    spouse_name: '',
    spouse_middle: '',
    spouse_surname: '',
    guardian_name: '',
    guardian_middle: '',
    guardian_surname: '',
    
    emergency_name: '',
    emergency_cell: '',
    emergency_email: '',
    emergency_address: '',
    emergency_city: '',
    emergency_pincode: '',
    emergency_state: '',
    emergency_country: '',
    
    criminal_case: '',
    post_office: '',
    police_station: ''
  });

  useEffect(() => {
    if (id) {
      fetchPassportData();
    } else {
      setIsEditMode(false);
    }
  }, [id]);

  const fetchPassportData = async () => {
    try {
      setFetching(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/passport/passport/${id}`);
      const result = await response.json();

      if (response.ok && result) {
        setIsEditMode(true);
        
        let formattedDob = result.dob || '';
        if (result.dob && result.dob.includes('/')) {
          const [day, month, year] = result.dob.split('/');
          formattedDob = `${year}-${month}-${day}`;
        }
        
        setFormData({
          applicant_for: result.applicant_for || '',
          application_type: result.application_type || '',
          passport_booklet: result.passport_booklet || '',
          name: result.name || '',
          middle_name: result.middle_name || '',
          surname: result.surname || '',
          dob: formattedDob,
          place_of_birth: result.place_of_birth || '',
          cell_no: result.cell_no || '',
          email: result.email || '',
          pan_no: result.pan_no || '',
          aadhaar_no: result.aadhaar_no || '',
          qualification: result.qualification || '',
          profession: result.profession || '',
          govt_employee: result.govt_employee || '',
          visible_mark: result.visible_mark || '',
          address: result.address || '',
          city: result.city || '',
          pincode: result.pincode || '',
          state: result.state || '',
          country: result.country || '',
          father_name: result.father_name || '',
          father_middle: result.father_middle || '',
          father_surname: result.father_surname || '',
          mother_name: result.mother_name || '',
          mother_middle: result.mother_middle || '',
          mother_surname: result.mother_surname || '',
          spouse_name: result.spouse_name || '',
          spouse_middle: result.spouse_middle || '',
          spouse_surname: result.spouse_surname || '',
          guardian_name: result.guardian_name || '',
          guardian_middle: result.guardian_middle || '',
          guardian_surname: result.guardian_surname || '',
          emergency_name: result.emergency_name || '',
          emergency_cell: result.emergency_cell || '',
          emergency_email: result.emergency_email || '',
          emergency_address: result.emergency_address || '',
          emergency_city: result.emergency_city || '',
          emergency_pincode: result.emergency_pincode || '',
          emergency_state: result.emergency_state || '',
          emergency_country: result.emergency_country || '',
          criminal_case: result.criminal_case || '',
          post_office: result.post_office || '',
          police_station: result.police_station || ''
        });
      } else {
        setError(result.message || 'Failed to fetch passport data');
      }
    } catch (err) {
      console.error('Error fetching passport:', err);
      setError('Error loading passport data');
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

  const handleBack = () => navigate('/passport');

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) { setError("Applicant name is required"); return; }
  if (!formData.cell_no.trim()) { setError("Mobile number is required"); return; }
  if (!formData.email.trim()) { setError("Email is required"); return; }

  try {
    setLoading(true);
    setError('');
    setSuccess('');

    const url = isEditMode
      ? `${baseurl}/api/passport/passport/${id}`
      : `${baseurl}/api/passport/passport`;

    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    // ✅ Always parse response, even on error
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Server returned an invalid response");
    }

    // ✅ Check both HTTP status AND result.success
    if (response.ok && result.success) {
      setSuccess(isEditMode
        ? "Passport application updated successfully!"
        : "Passport application added successfully!"
      );
      setTimeout(() => navigate('/passport'), 1500);
    } else {
      setError(result.message || "Operation failed. Please try again.");
    }

  } catch (err) {
    console.error("Save passport error:", err);
    setError(`Error ${isEditMode ? 'updating' : 'adding'} application: ${err.message}`);
  } finally {
    setLoading(false); // ✅ Always runs, button never stays stuck
  }
};

  // Select options
  const applicantForOptions = ['Fresh', 'Reissue', 'Re-issue', 'Lost/Damage'];
  const applicationTypeOptions = ['Normal', 'Tatkaal'];
  const bookletOptions = ['36', '60'];
  const yesNoOptions = ['Yes', 'No'];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit Passport Application' : 'New Passport Application'}</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="shadow-sm">
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary" className="me-2" />
                Loading application data...
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  {/* Personal Information Tab */}
                  <Tab eventKey="personal" title="Personal Information">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Applicant For *</Form.Label>
                          <Form.Select
                            name="applicant_for"
                            value={formData.applicant_for}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select Applicant For</option>
                            {applicantForOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Application Type *</Form.Label>
                          <Form.Select
                            name="application_type"
                            value={formData.application_type}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select Application Type</option>
                            {applicationTypeOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Passport Booklet *</Form.Label>
                          <Form.Select
                            name="passport_booklet"
                            value={formData.passport_booklet}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select Passport Booklet</option>
                            {bookletOptions.map(opt => (
                              <option key={opt} value={opt}>{opt} Pages</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            required
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Surname</Form.Label>
                          <Form.Control
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Enter surname"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth *</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Place of Birth</Form.Label>
                          <Form.Control
                            type="text"
                            name="place_of_birth"
                            value={formData.place_of_birth}
                            onChange={handleChange}
                            placeholder="Enter place of birth"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Visible Mark</Form.Label>
                          <Form.Control
                            type="text"
                            name="visible_mark"
                            value={formData.visible_mark}
                            onChange={handleChange}
                            placeholder="Enter visible identification mark"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="cell_no"
                            value={formData.cell_no}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            required
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
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
                        <Form.Group className="mb-3">
                          <Form.Label>PAN Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="pan_no"
                            value={formData.pan_no}
                            onChange={handleChange}
                            placeholder="Enter PAN number"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Aadhaar Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="aadhaar_no"
                            value={formData.aadhaar_no}
                            onChange={handleChange}
                            placeholder="Enter Aadhaar number"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Qualification</Form.Label>
                          <Form.Control
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="Enter qualification"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Profession</Form.Label>
                          <Form.Control
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            placeholder="Enter profession"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Government Employee</Form.Label>
                          <Form.Select
                            name="govt_employee"
                            value={formData.govt_employee}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select</option>
                            {yesNoOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Address Information Tab */}
                  <Tab eventKey="address" title="Address Information">
                    <Row className="mt-3">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter residential address"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
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
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Enter pincode"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
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
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
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
                  </Tab>

                  {/* Family Information Tab */}
                  <Tab eventKey="family" title="Family Information">
                    <h5 className="mt-3">Father's Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father's First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="father_name"
                            value={formData.father_name}
                            onChange={handleChange}
                            placeholder="Enter father's first name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father's Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="father_middle"
                            value={formData.father_middle}
                            onChange={handleChange}
                            placeholder="Enter father's middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father's Surname</Form.Label>
                          <Form.Control
                            type="text"
                            name="father_surname"
                            value={formData.father_surname}
                            onChange={handleChange}
                            placeholder="Enter father's surname"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mt-3">Mother's Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother's First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                            placeholder="Enter mother's first name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother's Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="mother_middle"
                            value={formData.mother_middle}
                            onChange={handleChange}
                            placeholder="Enter mother's middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother's Surname</Form.Label>
                          <Form.Control
                            type="text"
                            name="mother_surname"
                            value={formData.mother_surname}
                            onChange={handleChange}
                            placeholder="Enter mother's surname"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mt-3">Spouse's Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Spouse's First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="spouse_name"
                            value={formData.spouse_name}
                            onChange={handleChange}
                            placeholder="Enter spouse's first name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Spouse's Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="spouse_middle"
                            value={formData.spouse_middle}
                            onChange={handleChange}
                            placeholder="Enter spouse's middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Spouse's Surname</Form.Label>
                          <Form.Control
                            type="text"
                            name="spouse_surname"
                            value={formData.spouse_surname}
                            onChange={handleChange}
                            placeholder="Enter spouse's surname"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mt-3">Guardian's Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Guardian's First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="guardian_name"
                            value={formData.guardian_name}
                            onChange={handleChange}
                            placeholder="Enter guardian's first name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Guardian's Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="guardian_middle"
                            value={formData.guardian_middle}
                            onChange={handleChange}
                            placeholder="Enter guardian's middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Guardian's Surname</Form.Label>
                          <Form.Control
                            type="text"
                            name="guardian_surname"
                            value={formData.guardian_surname}
                            onChange={handleChange}
                            placeholder="Enter guardian's surname"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Emergency Contact Tab */}
                  <Tab eventKey="emergency" title="Emergency Contact">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergency_name"
                            value={formData.emergency_name}
                            onChange={handleChange}
                            placeholder="Enter emergency contact name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="emergency_cell"
                            value={formData.emergency_cell}
                            onChange={handleChange}
                            placeholder="Enter emergency contact number"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="emergency_email"
                            value={formData.emergency_email}
                            onChange={handleChange}
                            placeholder="Enter emergency contact email"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="emergency_address"
                            value={formData.emergency_address}
                            onChange={handleChange}
                            placeholder="Enter emergency contact address"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergency_city"
                            value={formData.emergency_city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergency_pincode"
                            value={formData.emergency_pincode}
                            onChange={handleChange}
                            placeholder="Enter pincode"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergency_state"
                            value={formData.emergency_state}
                            onChange={handleChange}
                            placeholder="Enter state"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergency_country"
                            value={formData.emergency_country}
                            onChange={handleChange}
                            placeholder="Enter country"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Additional Information Tab */}
                  <Tab eventKey="additional" title="Additional Info">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Criminal Case Pending?</Form.Label>
                          <Form.Select
                            name="criminal_case"
                            value={formData.criminal_case}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select</option>
                            {yesNoOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Post Office</Form.Label>
                          <Form.Control
                            type="text"
                            name="post_office"
                            value={formData.post_office}
                            onChange={handleChange}
                            placeholder="Enter post office name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Police Station</Form.Label>
                          <Form.Control
                            type="text"
                            name="police_station"
                            value={formData.police_station}
                            onChange={handleChange}
                            placeholder="Enter police station"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="outline-secondary" onClick={handleBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant={isEditMode ? "warning" : "primary"} disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : isEditMode ? 'Update Application' : 'Save Application'}
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

export default PassportForm;