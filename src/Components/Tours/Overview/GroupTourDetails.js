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
        const res = await fetch(`${baseurl}/api/tours/tour/full/group/${tourId}`);
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
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ======================== COST REMARKS ======================== */}
        {t.basic_details?.cost_remarks && (
          <>
            <hr />
            <h4>Cost Remarks</h4>
            <p>{t.basic_details.cost_remarks}</p>
          </>
        )}

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

              </tr>
            </thead>
            <tbody>
              {t.hotels.map((h) => (
                <tr key={h.hotel_id}>
                  <td>{h.city}</td>
                  <td>{h.hotel_name}</td>
                  <td>{h.room_type}</td>
                  <td>{h.nights}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hotel data</p>
        )}

        {/* ======================== HOTEL REMARKS ======================== */}
        {t.basic_details?.hotel_remarks && (
          <>
            <hr />
            <h4>Hotel Remarks</h4>
            <p>{t.basic_details.hotel_remarks}</p>
          </>
        )}

        <hr />

        {/* ======================== TRANSPORT ======================== */}
        <h4>Transport Details</h4>
        {t.transport?.length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                {/* <th>Mode</th>
                <th>From</th>
                <th>To</th>
                <th>Carrier</th>
                <th>No.</th>
                <th>Departure</th>
                <th>Arrival</th> */}
                <th>Description</th>
                {/* <th>Remarks</th> */}
              </tr>
            </thead>
            <tbody>
              {t.transport.map((tr) => (
                <tr key={tr.transport_id}>
                  {/* <td>{tr.mode}</td>
                  <td>{tr.from_city}</td>
                  <td>{tr.to_city}</td>
                  <td>{tr.carrier}</td>
                  <td>{tr.number_code}</td>
                  <td>{tr.departure_datetime}</td>
                  <td>{tr.arrival_datetime}</td> */}
                  <td>{tr.description}</td>
                  {/* <td>{tr.remarks}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No transport info</p>
        )}

        {/* ======================== TRANSPORT REMARKS ======================== */}
        {t.basic_details?.transport_remarks && (
          <>
            <hr />
            <h4>Transport Remarks</h4>
            <p>{t.basic_details.transport_remarks}</p>
          </>
        )}

        <hr />

        {/* ======================== BOOKING POI (FIXED) ======================== */}
        <h4>Booking Information</h4>
        {t.booking_poi?.length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>POI ID</th>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {t.booking_poi.map((p) => (
                <tr key={p.poi_id}>
                  <td>{p.poi_id}</td>
                  <td>{p.item}</td>
                  <td>{p.amount_details}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No booking information</p>
        )}

        <hr />

        {/* ======================== CANCELLATION POLICY ======================== */}
        <h4>Cancellation Policy</h4>
        <Table bordered hover>
          <thead>
            <tr>
              {/* <th>From (Days)</th>
              <th>To (Days)</th> */}
              <th>Cancellation Policy</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            {t.cancellation_policies.map((c) => (
              <tr key={c.policy_id}>
                {/* <td>{c.days_min ?? "-"}</td>
                <td>{c.days_max ?? "-"}</td> */}
                <td>{c.cancellation_policy}</td>
                <td>{c.charges ?? "-"}</td>
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







