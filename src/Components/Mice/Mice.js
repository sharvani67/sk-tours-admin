// Mice.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import './Mice.css';
import { useNavigate } from 'react-router-dom';

// Import tab components
import MiceMainTab from './MiceMainTab';
import FreeFlowTab from './MiceFreeFlowTab';
import DomesticMiceTab from './DomesticMiceTab';
import InternationalMiceTab from './InternationalMiceTab';
import ClientsTab from './MiceClientTab';
import VenuesTab from './MiceVenuesTab';
import GalleryTab from './MiceGalleryTab';
import EventsTab from './MiceEventsTab';
import MicEnquiryForm from './MicEnquiryForm';

// Import form components
import MiceMainForm from './MiceMainForm';
import FreeFlowForm from './MiceFreeFlowForm';
import DomesticMiceForm from './DomesticMiceForm';
import InternationalMiceForm from './InternationalMiceForm';
import ClientsForm from './MiceClientsForm';
import VenuesForm from './MiceVenueForm';
import GalleryForm from './MiceGalleryForm';
import EventsForm from './MiceEventsForm';

// Helper function for image URLs
const getImageUrl = (type, filename) => {
  if (!filename) return '/placeholder-image.png';
  
  const basePath = `${baseurl}/uploads/mice`;
  
  switch (type) {
    case 'main':
      return `${basePath}/main/${filename}`;
    case 'freeflow':
      return `${basePath}/freeflow/${filename}`;
    case 'domestic':
      return `${basePath}/domestic/${filename}`;
    case 'international':
      return `${basePath}/international/${filename}`;
    case 'clients':
      return `${basePath}/clients/${filename}`;
    case 'venues':
      return `${basePath}/venues/${filename}`;
    case 'gallery':
      return `${basePath}/gallery/${filename}`;
    case 'events':
      return `${basePath}/events/${filename}`;
    default:
      return '/placeholder-image.png';
  }
};

function Mice() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('main');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for data
  const [miceMain, setMiceMain] = useState(null);
  const [miceFreeFlow, setMiceFreeFlow] = useState(null);
  const [domesticMice, setDomesticMice] = useState([]);
  const [internationalMice, setInternationalMice] = useState([]);
  const [ourClients, setOurClients] = useState([]);
  const [venues, setVenues] = useState([]);
  const [miceGallery, setMiceGallery] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Form states for each tab
  const [mainForm, setMainForm] = useState({
    bannerImage: null,
    bannerImagePreview: '',
    questions: [{ id: Date.now(), question: '', answer: '' }]
  });

  const [freeFlowForm, setFreeFlowForm] = useState({
    id: null,
    meetingText: '',
    incentivesText: '',
    conferenceText: '',
    eventsText: '',
    image: null,
    imagePreview: ''
  });

  const [domesticForm, setDomesticForm] = useState({
    id: null,
    domestic_mice_name: '',
    cities: []
  });

  const [internationalForm, setInternationalForm] = useState({
    id: null,
    international_mice_name: '',
    cities: []
  });

  const [clientsForm, setClientsForm] = useState({
    images: [],
    imagePreviews: []
  });

  const [venuesForm, setVenuesForm] = useState({
    images: [],
    imagePreviews: []
  });

  const [galleryForm, setGalleryForm] = useState({
    images: [],
    imagePreviews: []
  });

  const [eventsForm, setEventsForm] = useState({
    images: [],
    imagePreviews: []
  });

  useEffect(() => {
    fetchData();
  }, []);


const fetchData = async () => {
  setLoading(true);
  setError('');
  
  try {
    // Fetch MICE Main
    try {
      const mainResponse = await fetch(`${baseurl}/api/mice/main`);
      if (mainResponse.ok) {
        const mainData = await mainResponse.json();
        setMiceMain(mainData);
      }
    } catch (err) {
      console.error('Error fetching main:', err);
    }

    try {
      const freeFlowResponse = await fetch(`${baseurl}/api/mice/freeflow`);
      if (freeFlowResponse.ok) {
        const freeFlowData = await freeFlowResponse.json();
        setMiceFreeFlow(freeFlowData);
      }
    } catch (err) {
      console.error('Error fetching freeflow:', err);
    }

    // Fetch Domestic Mice - FIXED:
    try {
      const domesticResponse = await fetch(`${baseurl}/api/mice/domestic`);
      if (domesticResponse.ok) {
        const domesticData = await domesticResponse.json();
        
        // Transform the grouped data into an array format that your component expects
        const transformedData = [];
        for (const [stateName, cities] of Object.entries(domesticData)) {
          cities.forEach(city => {
            transformedData.push({
              ...city,
              state_name: stateName
            });
          });
        }
        setDomesticMice(transformedData);
      }
    } catch (err) {
      console.error('Error fetching domestic mice:', err);
    }

    // Fetch International Mice - similar fix if needed
    try {
      const internationalResponse = await fetch(`${baseurl}/api/mice/international`);
      if (internationalResponse.ok) {
        const internationalData = await internationalResponse.json();
        
        // Transform grouped data if your international API also returns grouped data
        let transformedInternational = internationalData;
        if (internationalData && !Array.isArray(internationalData)) {
          transformedInternational = [];
          for (const [countryName, cities] of Object.entries(internationalData)) {
            cities.forEach(city => {
              transformedInternational.push({
                ...city,
                country_name: countryName
              });
            });
          }
        }
        setInternationalMice(transformedInternational);
      }
    } catch (err) {
      console.error('Error fetching international mice:', err);
    }

    // Rest of your fetch code remains the same...
    try {
      const clientsResponse = await fetch(`${baseurl}/api/mice/clients`);
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setOurClients(clientsData);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }

    try {
      const venuesResponse = await fetch(`${baseurl}/api/mice/venues`);
      if (venuesResponse.ok) {
        const venuesData = await venuesResponse.json();
        setVenues(venuesData);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }

    try {
      const galleryResponse = await fetch(`${baseurl}/api/mice/gallery`);
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        setMiceGallery(galleryData);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }

    try {
      const eventsResponse = await fetch(`${baseurl}/api/mice/events`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setUpcomingEvents(eventsData);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  } catch (err) {
    console.error('Error fetching MICE data:', err);
    setError('Error fetching MICE data. Please refresh the page.');
  } finally {
    setLoading(false);
  }
};

const fetchDomesticMice = async (id) => {
  setLoading(true);
  setError('');
  try {
    const response = await fetch(`${baseurl}/api/mice/domestic/${id}`);
    if (response.ok) {
      const data = await response.json();
      
      // Set the domestic form with the data for editing
      setDomesticForm({
        id: data.id,
        domestic_mice_name: data.city_name || ''
      });
      
      // Populate city entries for the basic form
      if (data) {
        const entries = [{
          id: data.id || Date.now(),
          stateName: data.state_name || '',
          cityName: data.city_name || '',
          price: data.price || '',
          image: null,
          imagePreview: data.image ? `${baseurl}/uploads/mice/domestic/${data.image}` : '',
          existingImage: data.image || ''
        }];
        setCityEntries(entries);
        setShowCitySection(true);
      }
      
      // Show the basic form first (not the details page)
      setActiveTab('domestic');
      setShowForm(true);
      setSuccessMessage(''); // Clear any previous messages
    } else {
      setError('Failed to fetch domestic mice data');
    }
  } catch (err) {
    console.error('Error fetching domestic mice:', err);
    setError('Error fetching domestic mice data');
  } finally {
    setLoading(false);
  }
};

const fetchInternationalMice = async (id) => {
  setLoading(true);
  setError('');
  try {
    const response = await fetch(`${baseurl}/api/mice/international/${id}`);
    if (response.ok) {
      const data = await response.json();
      
      // Set the international form with the data for editing
      setInternationalForm({
        id: data.id,
        international_mice_name: data.city_name || ''
      });
      
      // Populate city entries for the basic form
      if (data) {
        const entries = [{
          id: data.id || Date.now(),
          countryName: data.country_name || '',
          cityName: data.city_name || '',
          price: data.price || '',
          image: null,
          imagePreview: data.image ? `${baseurl}/uploads/mice/international/${data.image}` : '',
          existingImage: data.image || ''
        }];
        setCityEntries(entries);
        setShowCitySection(true);
      }
      
      // Show the basic form first (not the details page)
      setActiveTab('international');
      setShowForm(true);
      setSuccessMessage(''); // Clear any previous messages
    } else {
      setError('Failed to fetch international mice data');
    }
  } catch (err) {
    console.error('Error fetching international mice:', err);
    setError('Error fetching international mice data');
  } finally {
    setLoading(false);
  }
};


  const [cityEntries, setCityEntries] = useState([]);
  const [showCitySection, setShowCitySection] = useState(false);

  const fetchFreeFlow = async () => {
    try {
      const response = await fetch(`${baseurl}/api/mice/freeflow`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setFreeFlowForm({
            id: data.id,
            meetingText: data.meeting_text || '',
            incentivesText: data.incentives_text || '',
            conferenceText: data.conference_text || '',
            eventsText: data.events_text || '',
            image: null,
            imagePreview: data.image ? getImageUrl('freeflow', data.image) : ''
          });
        }
        setActiveTab('freeflow');
        setShowForm(true);
      }
    } catch (err) {
      console.error('Error fetching freeflow:', err);
      setError('Error fetching freeflow data');
    }
  };

  const handleEditEnquiry = (id) => {
    navigate(`/micenquiryform/${id}`);
  };

  const handleDeleteDomestic = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domestic mice entry?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseurl}/api/mice/domestic/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Domestic mice deleted successfully');
        await fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to delete domestic mice');
      }
    } catch (err) {
      console.error('Error deleting domestic mice:', err);
      setError('Error deleting domestic mice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternational = async (id) => {
    if (!window.confirm('Are you sure you want to delete this international mice entry?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseurl}/api/mice/international/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'International mice deleted successfully');
        await fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to delete international mice');
      }
    } catch (err) {
      console.error('Error deleting international mice:', err);
      setError('Error deleting international mice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseurl}/api/mice/${type}/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Image deleted successfully');
        await fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Error deleting image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setMainForm({
      bannerImage: null,
      bannerImagePreview: '',
      questions: [{ id: Date.now(), question: '', answer: '' }]
    });
    setFreeFlowForm({
      id: null,
      meetingText: '',
      incentivesText: '',
      conferenceText: '',
      eventsText: '',
      image: null,
      imagePreview: ''
    });
    setDomesticForm({
      id: null,
      domestic_mice_name: '',
      cities: []
    });
    setInternationalForm({
      id: null,
      international_mice_name: '',
      cities: []
    });
    setClientsForm({
      images: [],
      imagePreviews: []
    });
    setVenuesForm({
      images: [],
      imagePreviews: []
    });
    setGalleryForm({
      images: [],
      imagePreviews: []
    });
    setEventsForm({
      images: [],
      imagePreviews: []
    });
    setCityEntries([]);
    setShowCitySection(false);
    setError('');
  };

  const handleAddNew = () => {
    if (activeTab === 'enquiry') {
      navigate('/micenquiry-form');
      return;
    }
    
    resetForms();
    
    if (activeTab === 'main' && miceMain) {
      setMainForm({
        bannerImage: null,
        bannerImagePreview: getImageUrl('main', miceMain.banner_image),
        questions: miceMain.questions && miceMain.questions.length > 0 
          ? miceMain.questions.map((q, index) => ({
              id: Date.now() + index,
              question: q.question || '',
              answer: q.answer || ''
            }))
          : [{ id: Date.now(), question: '', answer: '' }]
      });
    } else if (activeTab === 'freeflow' && miceFreeFlow) {
      fetchFreeFlow();
      return;
    }
    
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForms();
    setShowForm(false);
  };

  const goToDomesticDetails = (id) => {
    navigate(`/mice/domestic-details/${id}`);
  };

  const goToInternationalDetails = (id) => {
    navigate(`/mice/international-details/${id}`);
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading MICE data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      );
    }

    const commonProps = {
      getImageUrl,
      handleAddNew,
      handleDeleteImage,
      fetchDomesticMice,
      fetchInternationalMice,
      handleDeleteDomestic,
      handleDeleteInternational,
      goToDomesticDetails,
      goToInternationalDetails,
      resetForms,
      setActiveTab,
      setShowForm,
      handleEditEnquiry
    };

    switch (activeTab) {
      case 'main':
        return <MiceMainTab miceMain={miceMain} {...commonProps} />;
      case 'freeflow':
        return <FreeFlowTab miceFreeFlow={miceFreeFlow} {...commonProps} />;
      case 'domestic':
        return <DomesticMiceTab domesticMice={domesticMice} {...commonProps} />;
      case 'international':
        return <InternationalMiceTab internationalMice={internationalMice} {...commonProps} />;
      case 'clients':
        return <ClientsTab ourClients={ourClients} {...commonProps} />;
      case 'venues':
        return <VenuesTab venues={venues} {...commonProps} />;
      case 'gallery':
        return <GalleryTab miceGallery={miceGallery} {...commonProps} />;
      case 'events':
        return <EventsTab upcomingEvents={upcomingEvents} {...commonProps} />;
      case 'enquiry':
        return <MicEnquiryForm onEdit={handleEditEnquiry} />;
      default:
        return null;
    }
  };

  const formProps = {
    loading,
    handleCancel,
    fetchData,
    setShowForm,
    setError,
    setSuccessMessage,
    resetForms,
    cityEntries,
    setCityEntries,
    showCitySection,
    setShowCitySection,
    getImageUrl
  };

  return (
    <Navbar>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">MICE Management</h2>
        </div>

        {successMessage && (
          <Alert variant="success" className="mb-4" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        {/* Horizontal Tabs */}
        <div className="horizontal-tabs-container mb-4">
          <div className="tabs-wrapper">
            <button
              className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => { setActiveTab('main'); setShowForm(false); resetForms(); }}
            >
              MICE Main Page
            </button>
            <button
              className={`tab-btn ${activeTab === 'freeflow' ? 'active' : ''}`}
              onClick={() => { setActiveTab('freeflow'); setShowForm(false); resetForms(); }}
            >
              Free Flow Entry
            </button>
            <button
              className={`tab-btn ${activeTab === 'domestic' ? 'active' : ''}`}
              onClick={() => { setActiveTab('domestic'); setShowForm(false); resetForms(); }}
            >
              Domestic Mice
            </button>
            <button
              className={`tab-btn ${activeTab === 'international' ? 'active' : ''}`}
              onClick={() => { setActiveTab('international'); setShowForm(false); resetForms(); }}
            >
              International Mice
            </button>
            <button
              className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => { setActiveTab('clients'); setShowForm(false); resetForms(); }}
            >
              Our Clients
            </button>
            <button
              className={`tab-btn ${activeTab === 'venues' ? 'active' : ''}`}
              onClick={() => { setActiveTab('venues'); setShowForm(false); resetForms(); }}
            >
              Venues
            </button>
            <button
              className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => { setActiveTab('gallery'); setShowForm(false); resetForms(); }}
            >
              MICE Gallery
            </button>
            <button
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => { setActiveTab('events'); setShowForm(false); resetForms(); }}
            >
              Upcoming Events
            </button>
            <button
              className={`tab-btn ${activeTab === 'enquiry' ? 'active' : ''}`}
              onClick={() => { setActiveTab('enquiry'); setShowForm(false); resetForms(); }}
            >
              Enquiry Form
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
                
                {activeTab === 'main' && (
                  <MiceMainForm
                    miceMain={miceMain}
                    mainForm={mainForm}
                    setMainForm={setMainForm}
                    getImageUrl={getImageUrl}
                    {...formProps}
                  />
                )}

                {activeTab === 'freeflow' && (
                  <FreeFlowForm
                    miceFreeFlow={miceFreeFlow}
                    freeFlowForm={freeFlowForm}
                    setFreeFlowForm={setFreeFlowForm}
                    getImageUrl={getImageUrl}
                    {...formProps}
                  />
                )}

                {activeTab === 'domestic' && (
                  <DomesticMiceForm
                    domesticForm={domesticForm}
                    setDomesticForm={setDomesticForm}
                    {...formProps}
                  />
                )}

                {activeTab === 'international' && (
                  <InternationalMiceForm
                    internationalForm={internationalForm}
                    setInternationalForm={setInternationalForm}
                    {...formProps}
                  />
                )}

                {activeTab === 'clients' && (
                  <ClientsForm
                    clientsForm={clientsForm}
                    setClientsForm={setClientsForm}
                    {...formProps}
                  />
                )}

                {activeTab === 'venues' && (
                  <VenuesForm
                    venuesForm={venuesForm}
                    setVenuesForm={setVenuesForm}
                    {...formProps}
                  />
                )}

                {activeTab === 'gallery' && (
                  <GalleryForm
                    galleryForm={galleryForm}
                    setGalleryForm={setGalleryForm}
                    {...formProps}
                  />
                )}

                {activeTab === 'events' && (
                  <EventsForm
                    eventsForm={eventsForm}
                    setEventsForm={setEventsForm}
                    {...formProps}
                  />
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Mice;