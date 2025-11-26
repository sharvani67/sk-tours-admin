import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Badge, ListGroup, Table, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { ArrowLeft } from 'react-bootstrap-icons';

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

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch main tour details - using the correct endpoint from tours.js
        const tourResponse = await fetch(`${baseurl}/api/tours/${tourId}`);
        if (!tourResponse.ok) {
          throw new Error('Failed to fetch tour details');
        }
        const tourData = await tourResponse.json();
        
        // The tours API returns an object with nested data
        setTour(tourData.tour); // Main tour info is in tourData.tour

        // Fetch related data using CORRECT endpoints based on your backend
        const endpoints = [
          `${baseurl}/api/departures/tour/${tourId}`,        // Correct: /api/departures/tour/:tour_id
          `${baseurl}/api/inclusions/tour/${tourId}`,        // Correct: /api/inclusions/tour/:tour_id
          `${baseurl}/api/exclusions/tour/${tourId}`,        // Correct: /api/exclusions/tour/:tour_id
          `${baseurl}/api/images/tour/${tourId}`,            // Correct: /api/images/tour/:tour_id
          `${baseurl}/api/itineraries/tour/${tourId}`        // Correct: /api/itineraries/tour/:tour_id
        ];

        const [
          departuresRes,
          inclusionsRes,
          exclusionsRes,
          imagesRes,
          itinerariesRes
        ] = await Promise.all(endpoints.map(url => fetch(url)));

        // Check all responses
        if (!departuresRes.ok) throw new Error('Failed to fetch departures');
        if (!inclusionsRes.ok) throw new Error('Failed to fetch inclusions');
        if (!exclusionsRes.ok) throw new Error('Failed to fetch exclusions');
        if (!imagesRes.ok) throw new Error('Failed to fetch images');
        if (!itinerariesRes.ok) throw new Error('Failed to fetch itineraries');

        // Parse responses
        const departuresData = await departuresRes.json();
        const inclusionsData = await inclusionsRes.json();
        const exclusionsData = await exclusionsRes.json();
        const imagesData = await imagesRes.json();
        const itinerariesData = await itinerariesRes.json();

        console.log('Departures:', departuresData);
        console.log('Inclusions:', inclusionsData);
        console.log('Exclusions:', exclusionsData);
        console.log('Images:', imagesData);
        console.log('Itineraries:', itinerariesData);

        // Set data based on your backend response structure
        setDepartures(departuresData || []);
        
        // For inclusions - your backend returns { tour_id, inclusions_count, inclusions_list: array }
        if (inclusionsData && inclusionsData.inclusions_list) {
          // Convert array of strings to array of objects for consistent handling
          setInclusions(inclusionsData.inclusions_list.map((item, index) => ({
            inclusion_id: index + 1,
            item: item
          })));
        } else {
          setInclusions([]);
        }

        // For exclusions - your backend returns { tour_id, exclusions_count, exclusions_list: array }
        if (exclusionsData && exclusionsData.exclusions_list) {
          // Convert array of strings to array of objects for consistent handling
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

        {/* Basic Tour Information */}
        <Card className="mb-4">
          <Card.Header>
            <h4 className="mb-0">Basic Information</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Tour ID:</strong> {tour.tour_id}</p>
                <p><strong>Tour Code:</strong> {tour.tour_code}</p>
                <p><strong>Title:</strong> {tour.title}</p>
                <p><strong>Category:</strong> {tour.category_name}</p>
                <p><strong>Primary Destination:</strong> {tour.primary_destination_name}</p>
              </Col>
              <Col md={6}>
                <p><strong>Duration:</strong> {tour.duration_days} days</p>
                <p><strong>Base Price:</strong> ₹{tour.base_price_adult}</p>
                <p><strong>International:</strong> 
                  <Badge bg={tour.is_international ? 'info' : 'secondary'} className="ms-2">
                    {tour.is_international ? 'Yes' : 'No'}
                  </Badge>
                </p>
                <p><strong>Active:</strong> 
                  <Badge bg={tour.is_active ? 'success' : 'danger'} className="ms-2">
                    {tour.is_active ? 'Yes' : 'No'}
                  </Badge>
                </p>
                <p><strong>Created:</strong> {new Date(tour.created_at).toLocaleDateString()}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p><strong>Overview:</strong></p>
                <p>{tour.overview || 'No overview provided.'}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tour Images */}
        {images.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Tour Images ({images.length})</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                {images.map((image) => (
                  <Col md={4} key={image.image_id} className="mb-3">
                    <Image
                      src={image.url}
                      alt={image.caption || `Tour Image`}
                      fluid
                      thumbnail
                      style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                    />
                    {image.caption && <p className="text-center mt-2 mb-0">{image.caption}</p>}
                    {image.is_cover && (
                      <Badge bg="primary" className="mt-1">Cover Image</Badge>
                    )}
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Departures */}
        {departures.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Departure Dates ({departures.length})</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Departure Date</th>
                    <th>Return Date</th>
                    <th>Total Seats</th>
                    <th>Booked Seats</th>
                    <th>Available Seats</th>
                    <th>Adult Price</th>
                    <th>Child Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departures.map(departure => (
                    <tr key={departure.departure_id}>
                      <td>{new Date(departure.departure_date).toLocaleDateString()}</td>
                      <td>{new Date(departure.return_date).toLocaleDateString()}</td>
                      <td>{departure.total_seats}</td>
                      <td>{departure.booked_seats}</td>
                      <td>
                        <Badge bg={departure.available_seats > 0 ? 'success' : 'danger'}>
                          {departure.available_seats || (departure.total_seats - departure.booked_seats)}
                        </Badge>
                      </td>
                      <td>₹{departure.adult_price}</td>
                      <td>{departure.child_price ? `₹${departure.child_price}` : 'N/A'}</td>
                      <td>
                        <Badge bg={departure.status === 'Available' ? 'success' : 'warning'}>
                          {departure.status || 'Available'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Inclusions & Exclusions */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">
                  Inclusions 
                  {inclusions.length > 0 && <Badge bg="primary" className="ms-2">{inclusions.length}</Badge>}
                </h4>
              </Card.Header>
              <Card.Body>
                {inclusions.length > 0 ? (
                  <ListGroup variant="flush">
                    {inclusions.map((inclusion, index) => (
                      <ListGroup.Item key={inclusion.inclusion_id || index} className="d-flex align-items-start">
                        <Badge bg="success" className="me-2 mt-1">✓</Badge>
                        <span>{inclusion.item}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No inclusions listed.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">
                  Exclusions
                  {exclusions.length > 0 && <Badge bg="secondary" className="ms-2">{exclusions.length}</Badge>}
                </h4>
              </Card.Header>
              <Card.Body>
                {exclusions.length > 0 ? (
                  <ListGroup variant="flush">
                    {exclusions.map((exclusion, index) => (
                      <ListGroup.Item key={exclusion.exclusion_id || index} className="d-flex align-items-start">
                        <Badge bg="danger" className="me-2 mt-1">✗</Badge>
                        <span>{exclusion.item}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No exclusions listed.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Itinerary */}
        {itineraries.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Tour Itinerary ({itineraries.length} days)</h4>
            </Card.Header>
            <Card.Body>
              {itineraries.map(itinerary => (
                <Card key={itinerary.itinerary_id} className="mb-3">
                  <Card.Header className="bg-light">
                    <strong>Day {itinerary.day}: {itinerary.title}</strong>
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Description:</strong> {itinerary.description || 'No description provided.'}</p>
                    {itinerary.meals && (
                      <p><strong>Meals:</strong> {itinerary.meals}</p>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        )}

        {/* Show message if no additional data found */}
        {departures.length === 0 && inclusions.length === 0 && exclusions.length === 0 && images.length === 0 && itineraries.length === 0 && (
          <Card className="mb-4">
            <Card.Body>
              <p className="text-muted text-center mb-0">
                No additional details found for this tour.
              </p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </Navbar>
  );
};

export default TourDetails;