import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Badge, Card } from "react-bootstrap";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const TourDetails = () => {
  const { tourId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${baseurl}/api/tours/tour/full/${tourId}`);
        const json = await res.json();
        setData(json);
        console.log("Tour Details Data:", json);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tourId]);

  if (loading) return <div>Loading...</div>;
  if (!data?.success) return <div>No data found.</div>;

  const t = data;

  return (
    <Navbar>
      <Container className="my-4">

        {/* ======================== COVER IMAGE ======================== */}
        {t.images?.length > 0 && (
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={t.images.find(img => img.is_cover === 1)?.url || t.images[0].url}
              style={{ height: "350px", objectFit: "cover" }}
            />
          </Card>
        )}

        {/* ======================== BASIC DETAILS ======================== */}
        <h2>{t.basic_details?.title}</h2>
        <p className="text-muted">
          <Badge bg="info">Code: {t.basic_details?.tour_code}</Badge>{" "}
          • {t.basic_details?.duration_days} Days
        </p>

        <hr />

        {/* ======================== GALLERY ======================== */}
        {t.images?.length > 1 && (
          <>
            <h4>Gallery</h4>
            <Row className="mb-4">
              {t.images.map((img) => (
                <Col md={3} key={img.image_id} className="mb-3">
                  <img
                    src={img.url}
                    alt=""
                    style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "6px" }}
                  />
                </Col>
              ))}
            </Row>
            <hr />
          </>
        )}

        {/* ======================== DEPARTURES ======================== */}
        <h4>Departures</h4>
        {t.departures?.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Return</th>
                <th>Adult Price</th>
                <th>Child Price</th>
                <th>Infant</th>
                <th>Available Seats</th>
                 <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {t.departures.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.departure_date}</td>
                  <td>{d.return_date}</td>
                  <td>₹{d.adult_price}</td>
                  <td>₹{d.child_price}</td>
                  <td>₹{d.infant_price}</td>
                  <td>{d.available_seats}</td>
                   <td>{d.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No departures available.</p>
        )}

        <hr />

        {/* ======================== COST TABLE ======================== */}
        <h4>Tour Cost (Per Pax Slab)</h4>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Pax</th>
              <th>Standard</th>
              <th>Deluxe</th>
              <th>Executive</th>
              <th>Child Bed</th>
              <th>Child No Bed</th>
               <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {t.costs.map((c) => (
              <tr key={c.cost_id}>
                <td>{c.pax}</td>
                <td>{c.standard_hotel || "-"}</td>
                <td>{c.deluxe_hotel || "-"}</td>
                <td>{c.executive_hotel || "-"}</td>
                <td>{c.child_with_bed || "-"}</td>
                <td>{c.child_no_bed || "-"}</td>
                 <td>{c.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ======================== HOTELS ======================== */}
        <h4>Hotels & Stays</h4>
        {t.hotels?.length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>City</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Nights</th>
                 <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {t.hotels.map((h) => (
                <tr key={h.hotel_id}>
                  <td>{h.city}</td>
                  <td>{h.hotel_name}</td>
                  <td>{h.room_type}</td>
                  <td>{h.nights}</td>
                   <td>{h.remarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hotel data</p>
        )}

        <hr />

        {/* ======================== TRANSPORT ======================== */}
        <h4>Transport Details</h4>
        {t.transport?.length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Mode</th>
                <th>From</th>
                <th>To</th>
                <th>Carrier</th>
                <th>No.</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Description</th>
                 <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {t.transport.map((tr) => (
                <tr key={tr.transport_id}>
                  <td>{tr.mode}</td>
                  <td>{tr.from_city}</td>
                  <td>{tr.to_city}</td>
                  <td>{tr.carrier}</td>
                  <td>{tr.number_code}</td>
                  <td>{tr.departure_datetime}</td>
                  <td>{tr.arrival_datetime}</td>
                  <td>{tr.description}</td>
                   <td>{tr.remarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No transport info</p>
        )}

        <hr />

        {/* ======================== BOOKING POI ======================== */}
        <h4>Booking Information</h4>
        <ul>
          {t.booking_poi?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <hr />

        {/* ======================== CANCELLATION POLICY ======================== */}
        <h4>Cancellation Policy</h4>
        <Table bordered hover>
          <thead>
            <tr>
              <th>From (Days)</th>
              <th>To (Days)</th>
              <th>Charge (%)</th>
            </tr>
          </thead>
          <tbody>
            {t.cancellation_policies.map((c) => (
              <tr key={c.policy_id}>
                <td>{c.days_min ?? "-"}</td>
                <td>{c.days_max ?? "-"}</td>
                <td>{c.charge_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ======================== INSTRUCTIONS ======================== */}
        <h4>Instructions</h4>
        <ul>
          {t.instructions?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <hr />

        {/* ======================== INCLUSIONS ======================== */}
        <h4>Inclusions</h4>
        <ul>
          {t.inclusions?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <hr />

        {/* ======================== EXCLUSIONS ======================== */}
        <h4>Exclusions</h4>
        <ul>
          {t.exclusions?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <hr />

        {/* ======================== ITINERARY ======================== */}
        <h4>Itinerary</h4>
        {t.itinerary.map((day) => (
          <Card className="mb-3" key={day.itinerary_id}>
            <Card.Body>
              <h5>Day {day.day} – {day.title}</h5>
              <p><strong>Meals:</strong> {day.meals || "NA"}</p>
              <p>{day.description}</p>
            </Card.Body>
          </Card>
        ))}

      </Container>
    </Navbar>
  );
};

export default TourDetails;





//Tharun code with edit and xdelete icons

// import React, { useState, useEffect } from 'react';
// import { Container, Card, Nav, Badge, Alert, Spinner } from 'react-bootstrap';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../../Shared/Navbar/Navbar';
// import { baseurl } from '../../Api/Baseurl';
// import { ArrowLeft } from 'react-bootstrap-icons';
// import Overview from './Overview/Overview';
// import Images from './Images/Images';
// import Departures from './Departures/Departures';
// import Itinerary from './Itinerary/Itinerary';
// import Inclusions from './Inclusions/Inclusions';
// import Exclusions from './Exclusions/Exclusions';
// import "./TourDetails.css"

// const TourDetails = () => {
//   const { tourId } = useParams();
//   const navigate = useNavigate();
//   const [tour, setTour] = useState(null);
//   const [departures, setDepartures] = useState([]);
//   const [inclusions, setInclusions] = useState([]);
//   const [exclusions, setExclusions] = useState([]);
//   const [images, setImages] = useState([]);
//   const [itineraries, setItineraries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     const fetchTourDetails = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const tourResponse = await fetch(`${baseurl}/api/tours/${tourId}`);
//         if (!tourResponse.ok) {
//           throw new Error('Failed to fetch tour details');
//         }
//         const tourData = await tourResponse.json();
        
//         setTour(tourData.tour);

//         const endpoints = [
//           `${baseurl}/api/departures/tour/${tourId}`,
//           `${baseurl}/api/inclusions/tour/${tourId}`,
//           `${baseurl}/api/exclusions/tour/${tourId}`,
//           `${baseurl}/api/images/tour/${tourId}`,
//           `${baseurl}/api/itineraries/tour/${tourId}`
//         ];

//         const [
//           departuresRes,
//           inclusionsRes,
//           exclusionsRes,
//           imagesRes,
//           itinerariesRes
//         ] = await Promise.all(endpoints.map(url => fetch(url)));

//         if (!departuresRes.ok) throw new Error('Failed to fetch departures');
//         if (!inclusionsRes.ok) throw new Error('Failed to fetch inclusions');
//         if (!exclusionsRes.ok) throw new Error('Failed to fetch exclusions');
//         if (!imagesRes.ok) throw new Error('Failed to fetch images');
//         if (!itinerariesRes.ok) throw new Error('Failed to fetch itineraries');

//         const departuresData = await departuresRes.json();
//         const inclusionsData = await inclusionsRes.json();
//         const exclusionsData = await exclusionsRes.json();
//         const imagesData = await imagesRes.json();
//         const itinerariesData = await itinerariesRes.json();

//         setDepartures(departuresData || []);
        
//         if (inclusionsData && inclusionsData.inclusions_list) {
//           setInclusions(inclusionsData.inclusions_list.map((item, index) => ({
//             inclusion_id: index + 1,
//             item: item
//           })));
//         } else {
//           setInclusions([]);
//         }

//         if (exclusionsData && exclusionsData.exclusions_list) {
//           setExclusions(exclusionsData.exclusions_list.map((item, index) => ({
//             exclusion_id: index + 1,
//             item: item
//           })));
//         } else {
//           setExclusions([]);
//         }

//         setImages(imagesData || []);
//         setItineraries(itinerariesData || []);

//       } catch (err) {
//         console.error('Error fetching tour details:', err);
//         setError('Error fetching tour details. Please try again. ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (tourId) {
//       fetchTourDetails();
//     }
//   }, [tourId]);

//   // Handle image deletion
//   const handleDeleteImage = async (imageId) => {
//     if (window.confirm('Are you sure you want to delete this image?')) {
//       try {
//         const response = await fetch(`${baseurl}/api/images/${imageId}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           setImages(images.filter(image => image.image_id !== imageId));
//         } else {
//           throw new Error('Failed to delete image');
//         }
//       } catch (err) {
//         console.error('Error deleting image:', err);
//         alert('Error deleting image. Please try again.');
//       }
//     }
//   };

//   // Edit handlers
//   const handleEditTour = () => {
//     console.log('Edit tour:', tour.tour_id);
//   };

//   const handleEditInclusions = () => {
//     console.log('Edit inclusions for tour:', tourId);
//   };

//   const handleEditExclusions = () => {
//     console.log('Edit exclusions for tour:', tourId);
//   };

//   const handleEditDepartures = () => {
//     console.log('Edit departures for tour:', tourId);
//   };

//   const handleEditItinerary = () => {
//     console.log('Edit itinerary for tour:', tourId);
//   };

//   // Render tab content based on active tab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <Overview 
//             tour={tour} 
//             onEditTour={handleEditTour}
//           />
//         );
//       case 'images':
//         return (
//           <Images 
//             images={images} 
//             onDeleteImage={handleDeleteImage}
//           />
//         );
//       case 'departures':
//         return (
//           <Departures 
//             departures={departures} 
//             onEditDepartures={handleEditDepartures}
//           />
//         );
//       case 'itinerary':
//         return (
//           <Itinerary 
//             itineraries={itineraries} 
//             onEditItinerary={handleEditItinerary}
//           />
//         );
//       case 'inclusions':
//         return (
//           <Inclusions 
//             inclusions={inclusions} 
//             onEditInclusions={handleEditInclusions}
//           />
//         );
//       case 'exclusions':
//         return (
//           <Exclusions 
//             exclusions={exclusions} 
//             onEditExclusions={handleEditExclusions}
//           />
//         );
//       default:
//         return <Overview tour={tour} onEditTour={handleEditTour} />;
//     }
//   };

//   if (loading) {
//     return (
//       <Navbar>
//         <Container>
//           <div className="text-center py-5">
//             <Spinner animation="border" role="status" className="me-2" />
//             Loading tour details...
//           </div>
//         </Container>
//       </Navbar>
//     );
//   }

//   if (error) {
//     return (
//       <Navbar>
//         <Container>
//           <Alert variant="danger" className="mt-4">
//             {error}
//           </Alert>
//           <div className="text-center">
//             <button 
//               className="btn btn-primary"
//               onClick={() => navigate('/tours')}
//             >
//               Back to Tours
//             </button>
//           </div>
//         </Container>
//       </Navbar>
//     );
//   }

//   if (!tour) {
//     return (
//       <Navbar>
//         <Container>
//           <Alert variant="warning" className="mt-4">
//             Tour not found.
//           </Alert>
//           <div className="text-center">
//             <button 
//               className="btn btn-primary"
//               onClick={() => navigate('/tours')}
//             >
//               Back to Tours
//             </button>
//           </div>
//         </Container>
//       </Navbar>
//     );
//   }

//   return (
//     <Navbar>
//       <Container>
//         <div className="d-flex align-items-center mb-4">
//           <button
//             className="btn btn-outline-secondary me-3"
//             onClick={() => navigate('/tours')}
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <h2 className="mb-0">Tour Details - {tour.title}</h2>
//         </div>

//         {/* Tabs Navigation */}
//         <Card className="mb-4 tour-details-card">
//           <Card.Header className="bg-white border-bottom-0 p-0">
//             <Nav variant="tabs" className="custom-tabs">
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'overview'} 
//                   onClick={() => setActiveTab('overview')}
//                   className={`custom-tab-link ${activeTab === 'overview' ? 'active' : ''}`}
//                 >
//                   Overview
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'images'} 
//                   onClick={() => setActiveTab('images')}
//                   className={`custom-tab-link ${activeTab === 'images' ? 'active' : ''}`}
//                 >
//                   Images {images.length > 0 && <Badge bg="primary" className="ms-1">{images.length}</Badge>}
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'departures'} 
//                   onClick={() => setActiveTab('departures')}
//                   className={`custom-tab-link ${activeTab === 'departures' ? 'active' : ''}`}
//                 >
//                   Departures {departures.length > 0 && <Badge bg="success" className="ms-1">{departures.length}</Badge>}
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'itinerary'} 
//                   onClick={() => setActiveTab('itinerary')}
//                   className={`custom-tab-link ${activeTab === 'itinerary' ? 'active' : ''}`}
//                 >
//                   Itinerary {itineraries.length > 0 && <Badge bg="info" className="ms-1">{itineraries.length}</Badge>}
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'inclusions'} 
//                   onClick={() => setActiveTab('inclusions')}
//                   className={`custom-tab-link ${activeTab === 'inclusions' ? 'active' : ''}`}
//                 >
//                   Inclusions {inclusions.length > 0 && <Badge bg="primary" className="ms-1">{inclusions.length}</Badge>}
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link 
//                   active={activeTab === 'exclusions'} 
//                   onClick={() => setActiveTab('exclusions')}
//                   className={`custom-tab-link ${activeTab === 'exclusions' ? 'active' : ''}`}
//                 >
//                   Exclusions {exclusions.length > 0 && <Badge bg="secondary" className="ms-1">{exclusions.length}</Badge>}
//                 </Nav.Link>
//               </Nav.Item>
//             </Nav>
//           </Card.Header>
//           <Card.Body className="p-0">
//             <div className="tab-content">
//               {renderTabContent()}
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>
//     </Navbar>
//   );
// };

// export default TourDetails;