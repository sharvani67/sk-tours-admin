import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import './Mice.css';

// Import tab components
import MiceMainTab from './MiceMainTab';
import FreeFlowTab from './MiceFreeFlowTab';
import PackagesTab from './MicePackages';
import ClientsTab from './MiceClientTab';
import VenuesTab from './MiceVenuesTab';
import GalleryTab from './MiceGalleryTab';
import EventsTab from './MiceEventsTab';

// Import form components
import MiceMainForm from './MiceMainForm';
import FreeFlowForm from './MiceFreeFlowForm';
import PackagesForm from './MicePackagesForm';
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
    case 'packages':
      return `${basePath}/packages/${filename}`;
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
  const [activeTab, setActiveTab] = useState('main');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for data
  const [miceMain, setMiceMain] = useState(null);
  const [miceFreeFlow, setMiceFreeFlow] = useState(null);
  const [samplePackages, setSamplePackages] = useState([]);
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

  const [packageForm, setPackageForm] = useState({
    id: null,
    days: '',
    price: '',
    images: [],
    imagePreviews: []
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

      try {
        const packagesResponse = await fetch(`${baseurl}/api/mice/packages`);
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          setSamplePackages(packagesData);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      }

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

  const fetchPackage = async (id) => {
    try {
      const response = await fetch(`${baseurl}/api/mice/packages/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPackageForm({
          id: data.id,
          days: data.days,
          price: data.price,
          images: [],
          imagePreviews: data.images.map(img => getImageUrl('packages', img.image_path))
        });
        setActiveTab('packages');
        setShowForm(true);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error fetching package');
      }
    } catch (err) {
      console.error('Error fetching package:', err);
      setError('Error fetching package data. Please try again.');
    }
  };

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

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseurl}/api/mice/packages/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Package deleted successfully');
        await fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to delete package');
      }
    } catch (err) {
      console.error('Error deleting package:', err);
      setError('Error deleting package. Please try again.');
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
    setPackageForm({
      id: null,
      days: '',
      price: '',
      images: [],
      imagePreviews: []
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
    setError('');
  };

  const handleAddNew = () => {
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
      handleDeletePackage,
      handleDeleteImage,
      fetchPackage,
      resetForms,      // Add this
      setActiveTab,     // Add this
      setShowForm       // Add this
    };

    switch (activeTab) {
      case 'main':
        return <MiceMainTab miceMain={miceMain} {...commonProps} />;
      case 'freeflow':
        return <FreeFlowTab miceFreeFlow={miceFreeFlow} {...commonProps} />;
      case 'packages':
        return <PackagesTab samplePackages={samplePackages} {...commonProps} />;
      case 'clients':
        return <ClientsTab ourClients={ourClients} {...commonProps} />;
      case 'venues':
        return <VenuesTab venues={venues} {...commonProps} />;
      case 'gallery':
        return <GalleryTab miceGallery={miceGallery} {...commonProps} />;
      case 'events':
        return <EventsTab upcomingEvents={upcomingEvents} {...commonProps} />;
      default:
        return null;
    }
  };

  const Sidebar = () => (
    <Card className="mb-4">
      <Card.Body className="p-3">
        <h5 className="mb-3">MICE Management</h5>
        <nav className="nav flex-column">
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => { setActiveTab('main'); setShowForm(false); resetForms(); }}
          >
            MICE Main Page
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'freeflow' ? 'active' : ''}`}
            onClick={() => { setActiveTab('freeflow'); setShowForm(false); resetForms(); }}
          >
            Free Flow Entry
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('packages'); setShowForm(false); resetForms(); }}
          >
            Sample Packages
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => { setActiveTab('clients'); setShowForm(false); resetForms(); }}
          >
            Our Clients
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'venues' ? 'active' : ''}`}
            onClick={() => { setActiveTab('venues'); setShowForm(false); resetForms(); }}
          >
            Venues
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setShowForm(false); resetForms(); }}
          >
            MICE Gallery
          </button>
          <button
            className={`nav-link text-start ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setShowForm(false); resetForms(); }}
          >
            Upcoming Events
          </button>
        </nav>
      </Card.Body>
    </Card>
  );

  const formProps = {
    loading,
    handleCancel,
    fetchData,
    setShowForm,
    setError,
    setSuccessMessage,
    resetForms
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

        <Row>
          <Col md={3} lg={2} className="d-none d-md-block">
            <Sidebar />
          </Col>
          
          <Col md={9} lg={10}>
            <div className="d-md-none mb-4">
              <div className="tabs">
                <button className={`tab ${activeTab === 'main' ? 'active' : ''}`} onClick={() => { setActiveTab('main'); setShowForm(false); resetForms(); }}>Main</button>
                <button className={`tab ${activeTab === 'freeflow' ? 'active' : ''}`} onClick={() => { setActiveTab('freeflow'); setShowForm(false); resetForms(); }}>Free Flow</button>
                <button className={`tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => { setActiveTab('packages'); setShowForm(false); resetForms(); }}>Packages</button>
                <button className={`tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => { setActiveTab('clients'); setShowForm(false); resetForms(); }}>Clients</button>
                <button className={`tab ${activeTab === 'venues' ? 'active' : ''}`} onClick={() => { setActiveTab('venues'); setShowForm(false); resetForms(); }}>Venues</button>
                <button className={`tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => { setActiveTab('gallery'); setShowForm(false); resetForms(); }}>Gallery</button>
                <button className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); setShowForm(false); resetForms(); }}>Events</button>
              </div>
            </div>

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

                {activeTab === 'packages' && (
                  <PackagesForm
                    packageForm={packageForm}
                    setPackageForm={setPackageForm}
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


