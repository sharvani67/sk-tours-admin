import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';

const InsuranceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [familyMembers, setFamilyMembers] = useState([]);

  // Form state for insurance fields
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    dateOfBirth: '',
    age: '',
    cellNo: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    passportNumber: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    placeOfIssue: '',
    purposeOfTravel: '',
    anyExistingIllness: '',
    includeUSACanada: false,
    excludeUSACanada: false,
    dateOfTravel: '',
    returnDate: '',
    noOfDays: '',
    countriesToVisit: '',
    sumInsured: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineeAge: '',
    nomineeMobile: '',
    declaration: false
  });

  useEffect(() => {
    if (id) {
      fetchInsuranceData();
    } else {
      setIsEditMode(false);
    }
  }, [id]);

  const fetchInsuranceData = async () => {
    try {
      setFetching(true);
      setError('');
      
      const response = await fetch(`${baseurl}/insurance/${id}`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setIsEditMode(true);
        const insuranceData = result.data.form;
        
        // Format dates for input fields
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        setFormData({
          firstName: insuranceData.first_name || '',
          middleName: insuranceData.middle_name || '',
          lastName: insuranceData.last_name || '',
          sex: insuranceData.sex || '',
          dateOfBirth: formatDateForInput(insuranceData.date_of_birth),
          age: insuranceData.age || '',
          cellNo: insuranceData.cell_no || '',
          address: insuranceData.address || '',
          landmark: insuranceData.landmark || '',
          city: insuranceData.city || '',
          pincode: insuranceData.pincode || '',
          state: insuranceData.state || '',
          country: insuranceData.country || '',
          passportNumber: insuranceData.passport_number || '',
          dateOfIssue: formatDateForInput(insuranceData.date_of_issue),
          dateOfExpiry: formatDateForInput(insuranceData.date_of_expiry),
          placeOfIssue: insuranceData.place_of_issue || '',
          purposeOfTravel: insuranceData.purpose_of_travel || '',
          anyExistingIllness: insuranceData.any_existing_illness || '',
          includeUSACanada: insuranceData.include_usa_canada === 1,
          excludeUSACanada: insuranceData.exclude_usa_canada === 1,
          dateOfTravel: formatDateForInput(insuranceData.date_of_travel),
          returnDate: formatDateForInput(insuranceData.return_date),
          noOfDays: insuranceData.no_of_days || '',
          countriesToVisit: insuranceData.countries_to_visit || '',
          sumInsured: insuranceData.sum_insured || '',
          nomineeName: insuranceData.nominee_name || '',
          nomineeRelationship: insuranceData.nominee_relationship || '',
          nomineeAge: insuranceData.nominee_age || '',
          nomineeMobile: insuranceData.nominee_mobile || '',
          declaration: insuranceData.declaration === 1
        });
        
        setFamilyMembers(result.data.familyMembers || []);
      } else {
        setError(result.message || 'Failed to fetch insurance data');
      }
    } catch (err) {
      console.error('Error fetching insurance:', err);
      setError('Error loading insurance data');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBack = () => navigate('/insurancetable');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) { 
      setError("First name is required"); 
      return; 
    }
    if (!formData.cellNo.trim()) { 
      setError("Mobile number is required"); 
      return; 
    }
    if (!formData.dateOfTravel) { 
      setError("Date of travel is required"); 
      return; 
    }
    if (!formData.returnDate) { 
      setError("Return date is required"); 
      return; 
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const url = isEditMode
        ? `${baseurl}/insurance/${id}`
        : `${baseurl}/insurance`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        form: formData,
        familyMembers: familyMembers
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Server returned an invalid response");
      }

      if (response.ok && result.success) {
        setSuccess(isEditMode
          ? "Insurance application updated successfully!"
          : "Insurance application added successfully!"
        );
        setTimeout(() => navigate('/insurancetable'), 1500);
      } else {
        setError(result.message || "Operation failed. Please try again.");
      }

    } catch (err) {
      console.error("Save insurance error:", err);
      setError(`Error ${isEditMode ? 'updating' : 'adding'} application: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add family member
  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      name: '',
      ppNo: '',
      doi: '',
      doe: '',
      poi: '',
      dob: '',
      nominee: false,
      relation: ''
    }]);
  };

  // Update family member
  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index][field] = value;
    setFamilyMembers(updatedMembers);
  };

  // Remove family member
  const removeFamilyMember = (index) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
  };

  // Select options
  const sexOptions = ['Male', 'Female', 'Other'];
  const sumInsuredOptions = ['50,000', '1,00,000', '2,00,000', '5,00,000', '10,00,000'];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit Insurance Application' : 'New Insurance Application'}</h2>
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
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender *</Form.Label>
                          <Form.Select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select Gender</option>
                            {sexOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="cellNo"
                            value={formData.cellNo}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
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
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Landmark</Form.Label>
                          <Form.Control
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Enter landmark"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
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
                      <Col md={3}>
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
                      <Col md={3}>
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

                  {/* Passport Information Tab */}
                  <Tab eventKey="passport" title="Passport Information">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Passport Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="passportNumber"
                            value={formData.passportNumber}
                            onChange={handleChange}
                            placeholder="Enter passport number"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Issue</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfIssue"
                            value={formData.dateOfIssue}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Expiry</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfExpiry"
                            value={formData.dateOfExpiry}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Place of Issue</Form.Label>
                          <Form.Control
                            type="text"
                            name="placeOfIssue"
                            value={formData.placeOfIssue}
                            onChange={handleChange}
                            placeholder="Enter place of issue"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Travel Information Tab */}
                  <Tab eventKey="travel" title="Travel Information">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Purpose of Travel</Form.Label>
                          <Form.Control
                            type="text"
                            name="purposeOfTravel"
                            value={formData.purposeOfTravel}
                            onChange={handleChange}
                            placeholder="Enter purpose of travel"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Countries to Visit</Form.Label>
                          <Form.Control
                            type="text"
                            name="countriesToVisit"
                            value={formData.countriesToVisit}
                            onChange={handleChange}
                            placeholder="Enter countries to visit"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Sum Insured</Form.Label>
                          <Form.Select
                            name="sumInsured"
                            value={formData.sumInsured}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Select Sum Insured</option>
                            {sumInsuredOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Travel *</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfTravel"
                            value={formData.dateOfTravel}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Return Date *</Form.Label>
                          <Form.Control
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Number of Days</Form.Label>
                          <Form.Control
                            type="number"
                            name="noOfDays"
                            value={formData.noOfDays}
                            onChange={handleChange}
                            placeholder="Auto calculated"
                            
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Any Existing Illness</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="anyExistingIllness"
                            value={formData.anyExistingIllness}
                            onChange={handleChange}
                            placeholder="Enter any existing illness"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Include USA/Canada Coverage"
                            name="includeUSACanada"
                            checked={formData.includeUSACanada}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Exclude USA/Canada Coverage"
                            name="excludeUSACanada"
                            checked={formData.excludeUSACanada}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Nominee Information Tab */}
                  <Tab eventKey="nominee" title="Nominee Information">
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nominee Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="nomineeName"
                            value={formData.nomineeName}
                            onChange={handleChange}
                            placeholder="Enter nominee name"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nominee Relationship</Form.Label>
                          <Form.Control
                            type="text"
                            name="nomineeRelationship"
                            value={formData.nomineeRelationship}
                            onChange={handleChange}
                            placeholder="Enter relationship"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nominee Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="nomineeAge"
                            value={formData.nomineeAge}
                            onChange={handleChange}
                            placeholder="Age"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nominee Mobile</Form.Label>
                          <Form.Control
                            type="tel"
                            name="nomineeMobile"
                            value={formData.nomineeMobile}
                            onChange={handleChange}
                            placeholder="Mobile"
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Family Members Tab */}
                  <Tab eventKey="family" title="Family Members">
                    <div className="mt-3">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={addFamilyMember}
                        className="mb-3"
                      >
                        + Add Family Member
                      </Button>
                      
                      {familyMembers.map((member, index) => (
                        <Card key={index} className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6>Family Member {index + 1}</h6>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => removeFamilyMember(index)}
                              >
                                Remove
                              </Button>
                            </div>
                            <Row>
                              <Col md={3}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                                    placeholder="Enter name"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Passport No</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={member.ppNo}
                                    onChange={(e) => updateFamilyMember(index, 'ppNo', e.target.value)}
                                    placeholder="Passport number"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Date of Issue</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={member.doi}
                                    onChange={(e) => updateFamilyMember(index, 'doi', e.target.value)}
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Date of Expiry</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={member.doe}
                                    onChange={(e) => updateFamilyMember(index, 'doe', e.target.value)}
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Place of Issue</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={member.poi}
                                    onChange={(e) => updateFamilyMember(index, 'poi', e.target.value)}
                                    placeholder="Place of issue"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Date of Birth</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={member.dob}
                                    onChange={(e) => updateFamilyMember(index, 'dob', e.target.value)}
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group className="mb-2">
                                  <Form.Check
                                    type="checkbox"
                                    label="Is Nominee"
                                    checked={member.nominee}
                                    onChange={(e) => updateFamilyMember(index, 'nominee', e.target.checked)}
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Relation</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={member.relation}
                                    onChange={(e) => updateFamilyMember(index, 'relation', e.target.value)}
                                    placeholder="Relation with applicant"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>

                  {/* Declaration Tab */}
                  <Tab eventKey="declaration" title="Declaration">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to rejection of the insurance application."
                          name="declaration"
                          checked={formData.declaration}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                    </div>
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

export default InsuranceForm;