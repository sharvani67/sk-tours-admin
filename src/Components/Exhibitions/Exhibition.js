import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import './Exhibition.css';
import { FaTrash, FaEdit, FaEye, FaPlus, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Exhibition() {
  const [activeTab, setActiveTab] = useState('about');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
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
    id: null,
    domestic_category_name: '',
    cities: []
  });

  const [internationalForm, setInternationalForm] = useState({
    id: null,
    international_category_name: '',
    cities: []
  });

  // City form state for dynamic addition
  const [cityEntries, setCityEntries] = useState([]);
  const [showCitySection, setShowCitySection] = useState(false);

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

  // Fetch single domestic exhibition for editing
  const fetchDomesticExhibition = async (id) => {
    try {
      const response = await fetch(`${baseurl}/api/exhibitions/domestic/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDomesticForm({
          id: data.id,
          domestic_category_name: data.domestic_category_name
        });
        
        // Convert cities to cityEntries format if they exist
        if (data.cities && data.cities.length > 0) {
          const entries = data.cities.map(city => ({
            id: city.id,
            stateName: city.state_name || '',
            cityName: city.city_name,
            price: city.price,
            image: null,
            imagePreview: city.image ? `${baseurl}/uploads/exhibition/${city.image}` : '',
            existingImage: city.image || ''
          }));
          setCityEntries(entries);
          setShowCitySection(true);
        } else {
          setCityEntries([]);
          setShowCitySection(false);
        }
        
        setActiveTab('domestic');
        setShowForm(true);
      }
    } catch (err) {
      console.error('Error fetching domestic exhibition:', err);
      setError('Error fetching exhibition data. Please try again.');
    }
  };

  // Fetch single international exhibition for editing
  const fetchInternationalExhibition = async (id) => {
    try {
      const response = await fetch(`${baseurl}/api/exhibitions/international/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInternationalForm({
          id: data.id,
          international_category_name: data.international_category_name
        });
        
        if (data.cities && data.cities.length > 0) {
          const entries = data.cities.map(city => ({
            id: city.id,
            countryName: city.country_name || '',
            cityName: city.city_name,
            price: city.price,
            image: null,
            imagePreview: city.image ? `${baseurl}/uploads/exhibition/${city.image}` : '',
            existingImage: city.image || ''
          }));
          setCityEntries(entries);
          setShowCitySection(true);
        } else {
          setCityEntries([]);
          setShowCitySection(false);
        }
        
        setActiveTab('international');
        setShowForm(true);
      }
    } catch (err) {
      console.error('Error fetching international exhibition:', err);
      setError('Error fetching exhibition data. Please try again.');
    }
  };

  // View exhibition details
  const viewExhibition = (exhibition) => {
    setSelectedExhibition(exhibition);
    setShowViewModal(true);
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

  // Handle city entries
  const addCityEntry = () => {
    if (activeTab === 'domestic') {
      setCityEntries([
        ...cityEntries,
        { id: Date.now(), stateName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }
      ]);
    } else {
      setCityEntries([
        ...cityEntries,
        { id: Date.now(), countryName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }
      ]);
    }
  };

  const removeCityEntry = (id) => {
    if (cityEntries.length > 1) {
      setCityEntries(cityEntries.filter(entry => entry.id !== id));
    } else {
      setCityEntries([]);
      setShowCitySection(false);
    }
  };

  const handleCityChange = (id, field, value) => {
    setCityEntries(cityEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleCityImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCityEntries(cityEntries.map(entry => 
          entry.id === id ? { 
            ...entry, 
            image: file, 
            imagePreview: reader.result,
            existingImage: ''
          } : entry
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle category name change
  const handleCategoryChange = (e, type) => {
    const { value } = e.target;
    if (type === 'domestic') {
      setDomesticForm({ ...domesticForm, domestic_category_name: value });
    } else {
      setInternationalForm({ ...internationalForm, international_category_name: value });
    }
  };

  // Toggle city section
  const toggleCitySection = () => {
    if (!showCitySection) {
      if (activeTab === 'domestic') {
        setCityEntries([{ id: Date.now(), stateName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }]);
      } else {
        setCityEntries([{ id: Date.now(), countryName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }]);
      }
    } else {
      setCityEntries([]);
    }
    setShowCitySection(!showCitySection);
  };

  // Form submission handlers
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    
    if (aboutForm.bannerImage) {
      formData.append('bannerImage', aboutForm.bannerImage);
    }
    
    const validQuestions = aboutForm.questions.filter(q => 
      q.question.trim() !== '' && q.answer.trim() !== ''
    );
    
    formData.append('isEdit', aboutExhibition ? 'true' : 'false');
    formData.append('questions', JSON.stringify(validQuestions));

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/about`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'About Exhibition saved successfully!');
        fetchData();
        resetForms();
        setShowForm(false);
      } else {
        setError(result.error || 'Error saving About Exhibition');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDomesticSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!domesticForm.domestic_category_name.trim()) {
      setError('Please enter category name');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('domestic_category_name', domesticForm.domestic_category_name.trim());
    
    // Handle cities if they exist
    if (showCitySection && cityEntries.length > 0) {
      const validEntries = cityEntries.filter(entry => 
        entry.cityName.trim() !== '' && entry.price > 0
      );

      if (validEntries.length === 0) {
        setError('Please fill in city details or disable cities section');
        setLoading(false);
        return;
      }

      if (!domesticForm.id) {
        const missingImages = validEntries.some(entry => !entry.image && !entry.existingImage);
        if (missingImages) {
          setError('Please upload an image for each city');
          setLoading(false);
          return;
        }
      }

      const stateNames = validEntries.map(entry => entry.stateName.trim());
      const cityNames = validEntries.map(entry => entry.cityName.trim());
      const prices = validEntries.map(entry => entry.price);
      const existingImages = validEntries.map(entry => entry.existingImage || '').filter(img => img !== '');
      const existingCityIds = validEntries.map(entry => entry.id).filter(id => typeof id === 'number');
      
      formData.append('stateNames', JSON.stringify(stateNames));
      formData.append('cityNames', JSON.stringify(cityNames));
      formData.append('prices', JSON.stringify(prices));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('existingCityIds', JSON.stringify(existingCityIds));
      
      validEntries.forEach(entry => {
        if (entry.image) {
          formData.append('images', entry.image);
        }
      });
    } else {
      formData.append('cityNames', JSON.stringify([]));
      formData.append('prices', JSON.stringify([]));
    }

    try {
      let response;
      
      if (domesticForm.id) {
        response = await fetch(`${baseurl}/api/exhibitions/domestic/${domesticForm.id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch(`${baseurl}/api/exhibitions/domestic`, {
          method: 'POST',
          body: formData
        });
      }

      const result = await response.json();

      if (response.ok) {
        alert(domesticForm.id ? 'Exhibition updated successfully!' : 'Exhibition added successfully!');
        fetchData();
        resetForms();
        setShowForm(false);
        
        if (!domesticForm.id && result.id) {
          navigate(`/exhibition/details/${result.id}/domestic`);
        } else if (domesticForm.id) {
          navigate(`/exhibition/details/${domesticForm.id}/domestic`);
        }
      } else {
        setError(result.error || 'Error processing request');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInternationalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!internationalForm.international_category_name.trim()) {
      setError('Please enter category name');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('international_category_name', internationalForm.international_category_name.trim());
    
    if (showCitySection && cityEntries.length > 0) {
      const validEntries = cityEntries.filter(entry => 
        entry.cityName.trim() !== '' && entry.price > 0
      );

      if (validEntries.length === 0) {
        setError('Please fill in city details or disable cities section');
        setLoading(false);
        return;
      }

      if (!internationalForm.id) {
        const missingImages = validEntries.some(entry => !entry.image && !entry.existingImage);
        if (missingImages) {
          setError('Please upload an image for each city');
          setLoading(false);
          return;
        }
      }

      const countryNames = validEntries.map(entry => entry.countryName.trim());
      const cityNames = validEntries.map(entry => entry.cityName.trim());
      const prices = validEntries.map(entry => entry.price);
      const existingImages = validEntries.map(entry => entry.existingImage || '').filter(img => img !== '');
      const existingCityIds = validEntries.map(entry => entry.id).filter(id => typeof id === 'number');
      
      formData.append('countryNames', JSON.stringify(countryNames));
      formData.append('cityNames', JSON.stringify(cityNames));
      formData.append('prices', JSON.stringify(prices));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('existingCityIds', JSON.stringify(existingCityIds));
      
      validEntries.forEach(entry => {
        if (entry.image) {
          formData.append('images', entry.image);
        }
      });
    } else {
      formData.append('cityNames', JSON.stringify([]));
      formData.append('prices', JSON.stringify([]));
    }

    try {
      let response;
      
      if (internationalForm.id) {
        response = await fetch(`${baseurl}/api/exhibitions/international/${internationalForm.id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch(`${baseurl}/api/exhibitions/international`, {
          method: 'POST',
          body: formData
        });
      }

      const result = await response.json();

      if (response.ok) {
        alert(internationalForm.id ? 'Exhibition updated successfully!' : 'Exhibition added successfully!');
        fetchData();
        resetForms();
        setShowForm(false);
        
        if (!internationalForm.id && result.id) {
          navigate(`/exhibition/details/${result.id}/international`);
        } else if (internationalForm.id) {
          navigate(`/exhibition/details/${internationalForm.id}/international`);
        }
      } else {
        setError(result.error || 'Error processing request');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteDomestic = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/domestic/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Exhibition deleted successfully');
        fetchData();
      } else {
        alert(result.error || 'Failed to delete exhibition');
      }
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      alert('Error deleting exhibition. Please try again.');
    }
  };

  const handleDeleteInternational = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/exhibitions/international/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Exhibition deleted successfully');
        fetchData();
      } else {
        alert(result.error || 'Failed to delete exhibition');
      }
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      alert('Error deleting exhibition. Please try again.');
    }
  };

  const resetForms = () => {
    setAboutForm({
      bannerImage: null,
      bannerImagePreview: '',
      questions: [{ id: Date.now(), question: '', answer: '' }]
    });
    setDomesticForm({
      id: null,
      domestic_category_name: ''
    });
    setInternationalForm({
      id: null,
      international_category_name: ''
    });
    setCityEntries([]);
    setShowCitySection(false);
  };

  const handleAddNew = () => {
    resetForms();
    
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

  const goToDetails = (id, type) => {
    navigate(`/exhibition/basic/${id}/${type}`);
  };

  // Render table based on active tab
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
                        src={`${baseurl}/uploads/exhibition/${aboutExhibition.banner_image}`}
                        alt="Banner" 
                        style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{aboutExhibition.questions?.length || 0}</td>
                    <td>{new Date(aboutExhibition.updated_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={handleAddNew}
                        className="edit-btn me-2"
                      >
                        <FaEdit />
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
                + Add Domestic Exhibition
              </Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Cities</th>
                  <th>Total Cities</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domesticExhibitions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><strong>{item.domestic_category_name}</strong></td>
                    <td>
                      {item.cities && item.cities.length > 0 ? (
                        <div className="city-tags">
                          {item.cities.slice(0, 3).map((city, idx) => (
                            <span key={idx} className="city-tag" title={`${city.state_name ? city.state_name + ', ' : ''}${city.city_name} - ₹${city.price}`}>
                              {city.state_name ? `${city.state_name} - ` : ''}{city.city_name} (₹{city.price})
                            </span>
                          ))}
                          {item.cities.length > 3 && (
                            <span className="city-tag more">+{item.cities.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No cities</span>
                      )}
                    </td>
                    <td>{item.cities?.length || 0}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => viewExhibition({...item, type: 'domestic'})}
                        className="view-btn me-2"
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => goToDetails(item.id, 'domestic')}
                        className="edit-btn me-2"
                        title="Edit Full Details"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteDomestic(item.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <FaTrash />
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
                + Add International Exhibition
              </Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Cities</th>
                  <th>Total Cities</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {internationalExhibitions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><strong>{item.international_category_name}</strong></td>
                    <td>
                      {item.cities && item.cities.length > 0 ? (
                        <div className="city-tags">
                          {item.cities.slice(0, 3).map((city, idx) => (
                            <span key={idx} className="city-tag" title={`${city.country_name ? city.country_name + ', ' : ''}${city.city_name} - ₹${city.price}`}>
                              {city.country_name ? `${city.country_name} - ` : ''}{city.city_name} (₹{city.price})
                            </span>
                          ))}
                          {item.cities.length > 3 && (
                            <span className="city-tag more">+{item.cities.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No cities</span>
                      )}
                    </td>
                    <td>{item.cities?.length || 0}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => viewExhibition({...item, type: 'international'})}
                        className="view-btn me-2"
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => goToDetails(item.id, 'international')}
                        className="edit-btn me-2"
                        title="Edit Full Details"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteInternational(item.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <FaTrash />
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

  return (
    <Navbar>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Exhibition Management</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Horizontal Tabs */}
        <div className="horizontal-tabs-container mb-4">
          <div className="tabs-wrapper">
            <button
              className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('about');
                setShowForm(false);
                resetForms();
              }}
            >
              About Exhibition
            </button>
            <button
              className={`tab-btn ${activeTab === 'domestic' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('domestic');
                setShowForm(false);
                resetForms();
              }}
            >
              Domestic Exhibition
            </button>
            <button
              className={`tab-btn ${activeTab === 'international' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('international');
                setShowForm(false);
                resetForms();
              }}
            >
              International Exhibition
            </button>
          </div>
        </div>

        {/* Content Area */}
        <Row>
          <Col xs={12}>
            {!showForm ? (
              renderTable()
            ) : (
              <div className="form-container">
                {loading && (
                  <div className="text-center mb-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </div>
                )}
                
                {/* About Exhibition Form */}
                {activeTab === 'about' && (
                  <>
                    <h2>{aboutExhibition ? 'Edit About Exhibition' : 'Add About Exhibition'}</h2>
                    <form onSubmit={handleAboutSubmit}>
                      <div className="form-group">
                        <label htmlFor="bannerImage">
                          Banner Image {!aboutExhibition && '*'}
                        </label>
                        <input
                          type="file"
                          id="bannerImage"
                          accept="image/*"
                          onChange={handleBannerImageChange}
                          required={!aboutExhibition}
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
                                  Remove
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
                    <h2>
                      {domesticForm.id ? 'Edit Domestic Exhibition' : 'Add Domestic Exhibition'}
                    </h2>
                    <form onSubmit={handleDomesticSubmit} encType="multipart/form-data">
                      <div className="form-group">
                        <label>Category Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Agriculture, Pharmaceutical, Furniture"
                          value={domesticForm.domestic_category_name}
                          onChange={(e) => handleCategoryChange(e, 'domestic')}
                          required
                        />
                      </div>

                      <div className="city-toggle-section">
                        <Button 
                          type="button" 
                          variant={showCitySection ? "danger" : "primary"}
                          onClick={toggleCitySection}
                          className="mb-3"
                        >
                          {showCitySection ? 'Remove Cities Section' : '+ Add Cities with Details'}
                        </Button>
                        {showCitySection && (
                          <p className="text-muted small">Add cities with state name, city name, image, and price (optional)</p>
                        )}
                      </div>

                      {showCitySection && (
                        <div className="cities-section">
                          <div className="section-header">
                            <h4>Cities with State Name, Image and Price</h4>
                            <button type="button" onClick={addCityEntry} className="add-btn">
                              <FaPlus /> Add City
                            </button>
                          </div>

                          {cityEntries.map((entry, index) => (
                            <div key={entry.id} className="city-entry-card">
                              <div className="city-entry-header">
                                <h5>City {index + 1}</h5>
                                {cityEntries.length > 1 && (
                                  <button 
                                    type="button" 
                                    onClick={() => removeCityEntry(entry.id)}
                                    className="remove-btn"
                                  >
                                    Remove City
                                  </button>
                                )}
                              </div>
                              
                              <div className="city-entry-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>State Name *</label>
                                      <input
                                        type="text"
                                        placeholder="Enter state name"
                                        value={entry.stateName}
                                        onChange={(e) => handleCityChange(entry.id, 'stateName', e.target.value)}
                                        required={showCitySection}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>City Name *</label>
                                      <input
                                        type="text"
                                        placeholder="Enter city name"
                                        value={entry.cityName}
                                        onChange={(e) => handleCityChange(entry.id, 'cityName', e.target.value)}
                                        required={showCitySection}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Price (₹) *</label>
                                      <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={entry.price}
                                        onChange={(e) => handleCityChange(entry.id, 'price', e.target.value)}
                                        required={showCitySection}
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label>Image {!entry.existingImage && '*'}</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleCityImageChange(entry.id, e)}
                                        required={!entry.existingImage && !domesticForm.id && showCitySection}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {(entry.imagePreview || entry.existingImage) && (
                                  <div className="image-preview">
                                    <img 
                                      src={entry.imagePreview || `${baseurl}/uploads/exhibition/${entry.existingImage}`}
                                      alt={`City ${index + 1}`}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {domesticForm.id ? 'Update Exhibition' : 'Save Exhibition'}
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
                    <h2>
                      {internationalForm.id ? 'Edit International Exhibition' : 'Add International Exhibition'}
                    </h2>
                    <form onSubmit={handleInternationalSubmit} encType="multipart/form-data">
                      <div className="form-group">
                        <label>Category Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Agriculture, Pharmaceutical, Furniture"
                          value={internationalForm.international_category_name}
                          onChange={(e) => handleCategoryChange(e, 'international')}
                          required
                        />
                      </div>

                      <div className="city-toggle-section">
                        <Button 
                          type="button" 
                          variant={showCitySection ? "danger" : "primary"}
                          onClick={toggleCitySection}
                          className="mb-3"
                        >
                          {showCitySection ? 'Remove Cities Section' : '+ Add Cities with Details'}
                        </Button>
                        {showCitySection && (
                          <p className="text-muted small">Add cities with country name, city name, image, and price (optional)</p>
                        )}
                      </div>

                      {showCitySection && (
                        <div className="cities-section">
                          <div className="section-header">
                            <h4>Cities with Country Name, Image and Price</h4>
                            <button type="button" onClick={addCityEntry} className="add-btn">
                              <FaPlus /> Add City
                            </button>
                          </div>

                          {cityEntries.map((entry, index) => (
                            <div key={entry.id} className="city-entry-card">
                              <div className="city-entry-header">
                                <h5>City {index + 1}</h5>
                                {cityEntries.length > 1 && (
                                  <button 
                                    type="button" 
                                    onClick={() => removeCityEntry(entry.id)}
                                    className="remove-btn"
                                  >
                                    Remove City
                                  </button>
                                )}
                              </div>
                              
                              <div className="city-entry-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Country Name *</label>
                                      <input
                                        type="text"
                                        placeholder="Enter country name"
                                        value={entry.countryName}
                                        onChange={(e) => handleCityChange(entry.id, 'countryName', e.target.value)}
                                        required={showCitySection}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>City Name *</label>
                                      <input
                                        type="text"
                                        placeholder="Enter city name"
                                        value={entry.cityName}
                                        onChange={(e) => handleCityChange(entry.id, 'cityName', e.target.value)}
                                        required={showCitySection}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Price (₹) *</label>
                                      <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={entry.price}
                                        onChange={(e) => handleCityChange(entry.id, 'price', e.target.value)}
                                        required={showCitySection}
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label>Image {!entry.existingImage && '*'}</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleCityImageChange(entry.id, e)}
                                        required={!entry.existingImage && !internationalForm.id && showCitySection}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {(entry.imagePreview || entry.existingImage) && (
                                  <div className="image-preview">
                                    <img 
                                      src={entry.imagePreview || `${baseurl}/uploads/exhibition/${entry.existingImage}`}
                                      alt={`City ${index + 1}`}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {internationalForm.id ? 'Update Exhibition' : 'Save Exhibition'}
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

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Exhibition Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedExhibition && (
              <div className="exhibition-details">
                <div className="detail-row">
                  <strong>Category:</strong> {selectedExhibition.type === 'domestic' ? 
                    selectedExhibition.domestic_category_name : 
                    selectedExhibition.international_category_name}
                </div>
                <div className="detail-row">
                  <strong>Type:</strong> {selectedExhibition.type === 'domestic' ? 'Domestic' : 'International'}
                </div>
                <div className="detail-row">
                  <strong>Cities:</strong>
                  <div className="cities-grid mt-3">
                    {selectedExhibition.cities && selectedExhibition.cities.length > 0 ? (
                      selectedExhibition.cities.map((city, idx) => (
                        <div key={idx} className="city-detail-card">
                          <div className="city-image">
                            <img 
                              src={`${baseurl}/uploads/exhibition/${city.image}`}
                              alt={city.city_name}
                            />
                          </div>
                          <div className="city-info">
                            {selectedExhibition.type === 'domestic' && city.state_name && (
                              <h6 className="text-muted">{city.state_name}</h6>
                            )}
                            {selectedExhibition.type === 'international' && city.country_name && (
                              <h6 className="text-muted">{city.country_name}</h6>
                            )}
                            <h5>{city.city_name}</h5>
                            <p className="price">₹{Number(city.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted">No cities added</span>
                    )}
                  </div>
                </div>
                <div className="detail-row">
                  <strong>Created:</strong> {new Date(selectedExhibition.created_at).toLocaleString()}
                </div>
                {selectedExhibition.updated_at && (
                  <div className="detail-row">
                    <strong>Last Updated:</strong> {new Date(selectedExhibition.updated_at).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Navbar>
  );
}

export default Exhibition;