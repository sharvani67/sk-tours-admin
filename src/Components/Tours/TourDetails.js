import React, { useState, useEffect } from 'react';
import { Container, Card, Nav, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { ArrowLeft } from 'react-bootstrap-icons';
import Overview from './Overview/Overview';
import Images from './Images/Images';
import Departures from './Departures/Departures';
import Itinerary from './Itinerary/Itinerary';
import Inclusions from './Inclusions/Inclusions';
import Exclusions from './Exclusions/Exclusions';
import "./TourDetails.css"

const TourDetails = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [images, setImages] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const tourResponse = await fetch(`${baseurl}/api/tours/${tourId}`);
        if (!tourResponse.ok) {
          throw new Error('Failed to fetch tour details');
        }
        const tourData = await tourResponse.json();
        
        setTour(tourData.tour);

        const endpoints = [
          `${baseurl}/api/departures/tour/${tourId}`,
          `${baseurl}/api/inclusions/tour/${tourId}`,
          `${baseurl}/api/exclusions/tour/${tourId}`,
          `${baseurl}/api/images/tour/${tourId}`,
          `${baseurl}/api/itineraries/tour/${tourId}`
        ];

        const [
          departuresRes,
          inclusionsRes,
          exclusionsRes,
          imagesRes,
          itinerariesRes
        ] = await Promise.all(endpoints.map(url => fetch(url)));

        if (!departuresRes.ok) throw new Error('Failed to fetch departures');
        if (!inclusionsRes.ok) throw new Error('Failed to fetch inclusions');
        if (!exclusionsRes.ok) throw new Error('Failed to fetch exclusions');
        if (!imagesRes.ok) throw new Error('Failed to fetch images');
        if (!itinerariesRes.ok) throw new Error('Failed to fetch itineraries');

        const departuresData = await departuresRes.json();
        const inclusionsData = await inclusionsRes.json();
        const exclusionsData = await exclusionsRes.json();
        const imagesData = await imagesRes.json();
        const itinerariesData = await itinerariesRes.json();

        setDepartures(departuresData || []);
        
        if (inclusionsData && inclusionsData.inclusions_list) {
          setInclusions(inclusionsData.inclusions_list.map((item, index) => ({
            inclusion_id: index + 1,
            item: item
          })));
        } else {
          setInclusions([]);
        }

        if (exclusionsData && exclusionsData.exclusions_list) {
          setExclusions(exclusionsData.exclusions_list.map((item, index) => ({
            exclusion_id: index + 1,
            item: item
          })));
        } else {
          setExclusions([]);
        }

        setImages(imagesData || []);
        setItineraries(itinerariesData || []);

      } catch (err) {
        console.error('Error fetching tour details:', err);
        setError('Error fetching tour details. Please try again. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTourDetails();
    }
  }, [tourId]);

  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`${baseurl}/api/images/${imageId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setImages(images.filter(image => image.image_id !== imageId));
        } else {
          throw new Error('Failed to delete image');
        }
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Error deleting image. Please try again.');
      }
    }
  };

  // Edit handlers
  const handleEditTour = () => {
    console.log('Edit tour:', tour.tour_id);
  };

  const handleEditInclusions = () => {
    console.log('Edit inclusions for tour:', tourId);
  };

  const handleEditExclusions = () => {
    console.log('Edit exclusions for tour:', tourId);
  };

  const handleEditDepartures = () => {
    console.log('Edit departures for tour:', tourId);
  };

  const handleEditItinerary = () => {
    console.log('Edit itinerary for tour:', tourId);
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            tour={tour} 
            onEditTour={handleEditTour}
          />
        );
      case 'images':
        return (
          <Images 
            images={images} 
            onDeleteImage={handleDeleteImage}
          />
        );
      case 'departures':
        return (
          <Departures 
            departures={departures} 
            onEditDepartures={handleEditDepartures}
          />
        );
      case 'itinerary':
        return (
          <Itinerary 
            itineraries={itineraries} 
            onEditItinerary={handleEditItinerary}
          />
        );
      case 'inclusions':
        return (
          <Inclusions 
            inclusions={inclusions} 
            onEditInclusions={handleEditInclusions}
          />
        );
      case 'exclusions':
        return (
          <Exclusions 
            exclusions={exclusions} 
            onEditExclusions={handleEditExclusions}
          />
        );
      default:
        return <Overview tour={tour} onEditTour={handleEditTour} />;
    }
  };

  if (loading) {
    return (
      <Navbar>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="me-2" />
            Loading tour details...
          </div>
        </Container>
      </Navbar>
    );
  }

  if (error) {
    return (
      <Navbar>
        <Container>
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
          <div className="text-center">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/tours')}
            >
              Back to Tours
            </button>
          </div>
        </Container>
      </Navbar>
    );
  }

  if (!tour) {
    return (
      <Navbar>
        <Container>
          <Alert variant="warning" className="mt-4">
            Tour not found.
          </Alert>
          <div className="text-center">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/tours')}
            >
              Back to Tours
            </button>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container>
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate('/tours')}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="mb-0">Tour Details - {tour.title}</h2>
        </div>

        {/* Tabs Navigation */}
        <Card className="mb-4 tour-details-card">
          <Card.Header className="bg-white border-bottom-0 p-0">
            <Nav variant="tabs" className="custom-tabs">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'overview'} 
                  onClick={() => setActiveTab('overview')}
                  className={`custom-tab-link ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'images'} 
                  onClick={() => setActiveTab('images')}
                  className={`custom-tab-link ${activeTab === 'images' ? 'active' : ''}`}
                >
                  Images {images.length > 0 && <Badge bg="primary" className="ms-1">{images.length}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'departures'} 
                  onClick={() => setActiveTab('departures')}
                  className={`custom-tab-link ${activeTab === 'departures' ? 'active' : ''}`}
                >
                  Departures {departures.length > 0 && <Badge bg="success" className="ms-1">{departures.length}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'itinerary'} 
                  onClick={() => setActiveTab('itinerary')}
                  className={`custom-tab-link ${activeTab === 'itinerary' ? 'active' : ''}`}
                >
                  Itinerary {itineraries.length > 0 && <Badge bg="info" className="ms-1">{itineraries.length}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'inclusions'} 
                  onClick={() => setActiveTab('inclusions')}
                  className={`custom-tab-link ${activeTab === 'inclusions' ? 'active' : ''}`}
                >
                  Inclusions {inclusions.length > 0 && <Badge bg="primary" className="ms-1">{inclusions.length}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'exclusions'} 
                  onClick={() => setActiveTab('exclusions')}
                  className={`custom-tab-link ${activeTab === 'exclusions' ? 'active' : ''}`}
                >
                  Exclusions {exclusions.length > 0 && <Badge bg="secondary" className="ms-1">{exclusions.length}</Badge>}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default TourDetails;