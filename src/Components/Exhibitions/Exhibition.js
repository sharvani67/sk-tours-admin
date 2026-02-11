import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl'; // Your base URL
import './Exhibition.css';

function Exhibition() {
  const [activeTab, setActiveTab] = useState('about');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for data
  const [aboutExhibition, setAboutExhibition] = useState(null);
  const [domesticExhibitions, setDomesticExhibitions] = useState([]);
  const [internationalExhibitions, setInternationalExhibitions] = useState([]);

  // Form states
  const [aboutForm, setAboutForm] = useState({
    bannerImage: null,
    bannerImagePreview: '',
    questions: [{ id: Date.now(), question: '', answer: '' }]
  });

  const [domesticForm, setDomesticForm] = useState({
    countries: ['']
  });

  const [internationalForm, setInternationalForm] = useState({
    countries: ['']
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch about exhibition
      const aboutResponse = await fetch(`${baseurl}/api/exhibitions/about`);
      if (aboutResponse.ok) {
        const aboutData = await aboutResponse.json();
        setAboutExhibition(aboutData);
      }

      // Fetch domestic exhibitions
      const domesticResponse = await fetch(`${baseurl}/api/exhibitions/domestic`);
      if (domesticResponse.ok) {
        const domesticData = await domesticResponse.json();
        setDomesticExhibitions(domesticData);
      }

      // Fetch international exhibitions
      const intlResponse = await fetch(`${baseurl}/api/exhibitions/international`);
      if (intlResponse.ok) {
        const intlData = await intlResponse.json();
        setInternationalExhibitions(intlData);
      }
    } catch (err) {
      console.error('Error fetching exhibition data:', err);
      setError('Error fetching exhibition data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle About Exhibition form changes
  const handleAboutFormChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...aboutForm.questions];
    
    if (name === 'question' || name === 'answer') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [name]: value
      };
      setAboutForm({ ...aboutForm, questions: updatedQuestions });
    }
  };

  const addNewQuestion = () => {
    const newQuestion = { id: Date.now(), question: '', answer: '' };
    setAboutForm({
      ...aboutForm,
      questions: [...aboutForm.questions, newQuestion]
    });
  };

  const removeQuestion = (index) => {
    if (aboutForm.questions.length > 1) {
      const updatedQuestions = aboutForm.questions.filter((_, i) => i !== index);
      setAboutForm({ ...aboutForm, questions: updatedQuestions });
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutForm({
          ...aboutForm,
          bannerImage: file,
          bannerImagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Domestic form changes
  const handleDomesticCountryChange = (index, value) => {
    const updatedCountries = [...domesticForm.countries];
    updatedCountries[index] = value;
    setDomesticForm({ ...domesticForm, countries: updatedCountries });
  };

  const addDomesticCountry = () => {
    setDomesticForm({
      ...domesticForm,
      countries: [...domesticForm.countries, '']
    });
  };

  const removeDomesticCountry = (index) => {
    if (domesticForm.countries.length > 1) {
      const updatedCountries = domesticForm.countries.filter((_, i) => i !== index);
      setDomesticForm({ ...domesticForm, countries: updatedCountries });
    }
  };

  // Handle International form changes
  const handleInternationalCountryChange = (index, value) => {
    const updatedCountries = [...internationalForm.countries];
    updatedCountries[index] = value;
    setInternationalForm({ ...internationalForm, countries: updatedCountries });
  };

  const addInternationalCountry = () => {
    setInternationalForm({
      ...internationalForm,
      countries: [...internationalForm.countries, '']
    });
  };

  const removeInternationalCountry = (index) => {
    if (internationalForm.countries.length > 1) {
      const updatedCountries = internationalForm.countries.filter((_, i) => i !== index);
      setInternationalForm({ ...internationalForm, countries: updatedCountries });
    }
  };

  // Form submission handlers
const handleAboutSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const formData = new FormData();
  
  // Only add banner image if a new one is selected
  if (aboutForm.bannerImage) {
    formData.append('bannerImage', aboutForm.bannerImage);
  }
  
  // Add questions as JSON
  const validQuestions = aboutForm.questions.filter(q => 
    q.question.trim() !== '' && q.answer.trim() !== ''
  );
  
  // Add mode flag to indicate if we're editing or creating
  formData.append('isEdit', aboutExhibition ? 'true' : 'false');
  formData.append('questions', JSON.stringify(validQuestions));

  try {
    console.log('Submitting to:', `${baseurl}/api/exhibitions/about`);
    console.log('Is edit mode:', aboutExhibition ? 'true' : 'false');
    console.log('Has banner image:', aboutForm.bannerImage ? 'yes' : 'no');
    
    const response = await fetch(`${baseurl}/api/exhibitions/about`, {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    console.log('Response text (first 500 chars):', responseText.substring(0, 500));

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Full response:', responseText);
      setError('Server returned invalid response. Please check the console.');
      return;
    }

    if (response.ok) {
      alert(result.message || 'About Exhibition saved successfully!');
      fetchData();
      resetForms();
      setShowForm(false);
    } else {
      setError(result.error || 'Error saving About Exhibition');
    }
  } catch (err) {
    console.error('Network or other error:', err);
    setError('Error submitting form. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleDomesticSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validCountries = domesticForm.countries
      .filter(country => country.trim() !== '')
      .map(country => country.trim());

    if (validCountries.length === 0) {
      setError('Please enter at least one country name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/domestic/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countries: validCountries })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Domestic countries added successfully!');
        fetchData(); // Refresh data
        resetForms();
        setShowForm(false);
      } else {
        setError(result.error || 'Error adding domestic countries');
      }
    } catch (err) {
      console.error('Error submitting domestic countries:', err);
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInternationalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validCountries = internationalForm.countries
      .filter(country => country.trim() !== '')
      .map(country => country.trim());

    if (validCountries.length === 0) {
      setError('Please enter at least one country name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/international/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countries: validCountries })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'International countries added successfully!');
        fetchData(); // Refresh data
        resetForms();
        setShowForm(false);
      } else {
        setError(result.error || 'Error adding international countries');
      }
    } catch (err) {
      console.error('Error submitting international countries:', err);
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteDomestic = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domestic country?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/domestic/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Domestic country deleted successfully');
        fetchData(); // Refresh data
      } else {
        alert(result.error || 'Failed to delete domestic country');
      }
    } catch (err) {
      console.error('Error deleting domestic country:', err);
      alert('Error deleting domestic country. Please try again.');
    }
  };

  const handleDeleteInternational = async (id) => {
    if (!window.confirm('Are you sure you want to delete this international country?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/international/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'International country deleted successfully');
        fetchData(); // Refresh data
      } else {
        alert(result.error || 'Failed to delete international country');
      }
    } catch (err) {
      console.error('Error deleting international country:', err);
      alert('Error deleting international country. Please try again.');
    }
  };

  const resetForms = () => {
    setAboutForm({
      bannerImage: null,
      bannerImagePreview: '',
      questions: [{ id: Date.now(), question: '', answer: '' }]
    });
    setDomesticForm({
      countries: ['']
    });
    setInternationalForm({
      countries: ['']
    });
  };

  const handleAddNew = () => {
    resetForms();
    
    // If editing About Exhibition and it exists, populate form
    if (activeTab === 'about' && aboutExhibition) {
     setAboutForm({
  bannerImage: null,
 bannerImagePreview: `${baseurl}/uploads/exhibition/${aboutExhibition.banner_image}`,
  questions: aboutExhibition.questions.length > 0 
    ? aboutExhibition.questions.map((q, index) => ({
        id: Date.now() + index,
        question: q.question,
        answer: q.answer
      }))
    : [{ id: Date.now(), question: '', answer: '' }]
});
    }
    
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForms();
    setShowForm(false);
  };

  // Function to render appropriate table based on active tab
  const renderTable = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading exhibition data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger">
          {error}
        </Alert>
      );
    }

    switch (activeTab) {
      case 'about':
        return (
          <div className="table-container">
            <div className="table-header">
              <h3>About Exhibition</h3>
              <Button variant="success" onClick={handleAddNew}>
                {aboutExhibition ? 'Edit About Exhibition' : 'Add About Exhibition'}
              </Button>
            </div>
            
            {aboutExhibition ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Banner Image</th>
                    <th>Questions</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                     <img 
                          src={`${baseurl}/uploads/exhibition/${aboutExhibition.banner_image}`}  // Changed from /exhibition/ to /uploads/exhibition/
                          alt="Banner" 
                          style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                        />
                    </td>
                    <td>{aboutExhibition.questions.length}</td>
                    <td>{new Date(aboutExhibition.updated_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={handleAddNew}
                        className="edit-btn"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-5">
                <p>No About Exhibition data found.</p>
                <Button variant="primary" onClick={handleAddNew}>
                  Create About Exhibition
                </Button>
              </div>
            )}
          </div>
        );

      case 'domestic':
        return (
          <div className="table-container">
            <div className="table-header">
              <h3>Domestic Exhibitions</h3>
              <Button variant="success" onClick={handleAddNew}>
                + Add Domestic Countries
              </Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Country Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domesticExhibitions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.country_name}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteDomestic(item.id)}
                        className="delete-btn"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'international':
        return (
          <div className="table-container">
            <div className="table-header">
              <h3>International Exhibitions</h3>
              <Button variant="success" onClick={handleAddNew}>
                + Add International Countries
              </Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Country Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {internationalExhibitions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.country_name}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteInternational(item.id)}
                        className="delete-btn"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  // Sidebar Navigation Component
  const Sidebar = () => (
    <Card className="mb-4">
      <Card.Body className="p-3">
        <h5 className="mb-3">Exhibition Management</h5>
        <nav className="nav flex-column">
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('about');
              setShowForm(false);
              resetForms();
            }}
          >
            About Exhibition
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'domestic' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('domestic');
              setShowForm(false);
              resetForms();
            }}
          >
            Domestic Exhibition
          </button>
          <button
            className={`nav-link text-start ${activeTab === 'international' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('international');
              setShowForm(false);
              resetForms();
            }}
          >
            International Exhibition
          </button>
        </nav>
      </Card.Body>
    </Card>
  );

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Exhibition Management</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row>
          {/* Sidebar for desktop */}
          <Col md={3} lg={2} className="d-none d-md-block">
            <Sidebar />
          </Col>
          
          {/* Main Content */}
          <Col md={9} lg={10}>
            {/* Mobile Tabs */}
            <div className="d-md-none mb-4">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('about');
                    setShowForm(false);
                    resetForms();
                  }}
                >
                  About
                </button>
                <button 
                  className={`tab ${activeTab === 'domestic' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('domestic');
                    setShowForm(false);
                    resetForms();
                  }}
                >
                  Domestic
                </button>
                <button 
                  className={`tab ${activeTab === 'international' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('international');
                    setShowForm(false);
                    resetForms();
                  }}
                >
                  International
                </button>
              </div>
            </div>

            {/* Render Table or Form based on showForm state */}
            {!showForm ? (
              renderTable()
            ) : (
              <div className="form-container">
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </div>
                )}
                
                {/* About Exhibition Form */}
                {activeTab === 'about' && (
                  <>
                    <h2>{aboutExhibition ? 'Edit About Exhibition' : 'Add About Exhibition'}</h2>
                    <form onSubmit={handleAboutSubmit}>
                      {/* Banner Image Upload */}
                      {/* Banner Image Upload */}
<div className="form-group">
  <label htmlFor="bannerImage">
    Banner Image {!aboutExhibition && '*'}
  </label>
  <input
    type="file"
    id="bannerImage"
    accept="image/*"
    onChange={handleBannerImageChange}
    required={!aboutExhibition} // Only required for new records
  />
  {aboutForm.bannerImagePreview && (
    <div className="image-preview">
      <img 
        src={aboutForm.bannerImagePreview} 
        alt="Banner Preview" 
        style={{ maxWidth: '300px', maxHeight: '200px' }}
      />
    </div>
  )}
  {aboutExhibition && !aboutForm.bannerImagePreview && !aboutForm.bannerImage && (
    <div className="mt-2">
      <p className="text-muted small">Current image:</p>
      <img 
        src={`${baseurl}/uploads/exhibition/${aboutExhibition.banner_image}`}
        alt="Current Banner" 
        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
      />
      <p className="text-muted small mt-1">Leave empty to keep current image</p>
    </div>
  )}
</div>

                      {/* Questions and Answers */}
                      <div className="form-group">
                        <div className="qa-header">
                          <label>Questions & Answers</label>
                          <button 
                            type="button" 
                            onClick={addNewQuestion}
                            className="add-btn"
                          >
                            + Add New Question
                          </button>
                        </div>
                        {aboutForm.questions.map((item, index) => (
                          <div key={item.id} className="qa-item">
                            <div className="qa-header">
                              <span>Question {index + 1}</span>
                              {aboutForm.questions.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => removeQuestion(index)}
                                  className="remove-btn"
                                >
                                  Remove Question
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Enter question"
                              value={item.question}
                              onChange={(e) => handleAboutFormChange(e, index)}
                              name="question"
                              required
                            />
                            <textarea
                              placeholder="Enter answer"
                              value={item.answer}
                              onChange={(e) => handleAboutFormChange(e, index)}
                              name="answer"
                              rows="3"
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {aboutExhibition ? 'Update' : 'Save'} About Exhibition
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Domestic Form */}
                {activeTab === 'domestic' && (
                  <>
                    <h2>Add Domestic Countries</h2>
                    <form onSubmit={handleDomesticSubmit}>
                      <div className="form-group">
                        <label>Add Country Names (Domestic)</label>
                        {domesticForm.countries.map((country, index) => (
                          <div key={index} className="country-input-group">
                            <input
                              type="text"
                              placeholder="Enter country name"
                              value={country}
                              onChange={(e) => handleDomesticCountryChange(index, e.target.value)}
                              required
                            />
                            {domesticForm.countries.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeDomesticCountry(index)}
                                className="remove-btn"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={addDomesticCountry}
                          className="add-btn"
                        >
                          + Add Another Country
                        </button>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          Save Domestic Countries
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* International Form */}
                {activeTab === 'international' && (
                  <>
                    <h2>Add International Countries</h2>
                    <form onSubmit={handleInternationalSubmit}>
                      <div className="form-group">
                        <label>Add Country Names (International)</label>
                        {internationalForm.countries.length === 0 && (
                          <p className="hint">Click "Add Country" to start adding countries</p>
                        )}
                        {internationalForm.countries.map((country, index) => (
                          <div key={index} className="country-input-group">
                            <input
                              type="text"
                              placeholder="Enter country name"
                              value={country}
                              onChange={(e) => handleInternationalCountryChange(index, e.target.value)}
                              required
                            />
                            {internationalForm.countries.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeInternationalCountry(index)}
                                className="remove-btn"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={addInternationalCountry}
                          className="add-btn"
                        >
                          + Add Country
                        </button>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          Save International Countries
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Exhibition;