import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Badge, Card } from "react-bootstrap";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const GroupTourDetails = () => {
  const { tourId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${baseurl}/api/tours/tour/full/group/${tourId}`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tourId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data?.success) return <div className="p-4">No data found.</div>;

  const t = data;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "-";

  return (
    <Navbar>
      <Container className="my-4">

        {/* ================= COVER IMAGE ================= */}
        {t.images?.length > 0 && (
          <Card className="mb-4">
            <Card.Img
              src={t.images.find(i => i.is_cover === 1)?.url || t.images[0].url}
              style={{ height: 350, objectFit: "cover" }}
            />
          </Card>
        )}

        {/* ================= BASIC DETAILS ================= */}
        <h2>{t.basic_details?.title}</h2>
        <p className="text-muted">
          <Badge bg="success">Group Tour</Badge>{" "}
          <Badge bg="info">Code: {t.basic_details?.tour_code}</Badge>{" "}
          • {t.basic_details?.duration_days} Days
        </p>

        <hr />

        {/* ================= GALLERY ================= */}
        {t.images?.length > 1 && (
          <>
            <h4>Gallery</h4>
            <Row>
              {t.images.map(img => (
                <Col md={3} key={img.image_id} className="mb-3">
                  <img
                    src={img.url}
                    alt=""
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }}
                  />
                </Col>
              ))}
            </Row>
            <hr />
          </>
        )}

        {/* ================= GROUP DEPARTURES ================= */}
        <h4>Departures</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Seats</th>
              <th>Booked</th>
              <th>Available</th>
              <th>Adult Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {t.departures?.map(d => (
              <tr key={d.departure_id}>
                <td>{formatDate(d.start_date)}</td>
                <td>{formatDate(d.end_date)}</td>
                <td>{d.total_seats}</td>
                <td>{d.booked_seats}</td>
                <td>{d.total_seats - d.booked_seats}</td>
                <td>₹{d.adult_price}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ================= HOTEL CATEGORY PRICES ================= */}
        <h4>Hotel Category Pricing</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Category</th>
              <th>Twin</th>
              <th>Triple</th>
              <th>Child Bed</th>
              <th>Child No Bed</th>
              <th>Infant</th>
              <th>Single</th>
            </tr>
          </thead>
          <tbody>
            {t.departures?.map(d => (
              <>
                <tr key={`3-${d.departure_id}`}>
                  <td>3 Star</td>
                  <td>₹{d.three_star_twin}</td>
                  <td>₹{d.three_star_triple}</td>
                  <td>₹{d.three_star_child_with_bed}</td>
                  <td>₹{d.three_star_child_without_bed}</td>
                  <td>₹{d.three_star_infant}</td>
                  <td>₹{d.three_star_single}</td>
                </tr>
                <tr key={`4-${d.departure_id}`}>
                  <td>4 Star</td>
                  <td>₹{d.four_star_twin}</td>
                  <td>₹{d.four_star_triple}</td>
                  <td>₹{d.four_star_child_with_bed}</td>
                  <td>₹{d.four_star_child_without_bed}</td>
                  <td>₹{d.four_star_infant}</td>
                  <td>₹{d.four_star_single}</td>
                </tr>
                <tr key={`5-${d.departure_id}`}>
                  <td>5 Star</td>
                  <td>₹{d.five_star_twin}</td>
                  <td>₹{d.five_star_triple}</td>
                  <td>₹{d.five_star_child_with_bed}</td>
                  <td>₹{d.five_star_child_without_bed}</td>
                  <td>₹{d.five_star_infant}</td>
                  <td>₹{d.five_star_single}</td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ================= HOTELS ================= */}
        <h4>Hotels</h4>
               <Table bordered>
                 <thead>
                   <tr>
                     <th>City</th>
                     <th>Hotel</th>
                     <th>Standard</th>
                     <th>Deluxe</th>
                     <th>Executive</th>
                     <th>Room Type</th>
                     <th>Nights</th>
                   </tr>
                 </thead>
                 <tbody>
                   {t.hotels?.map(h => (
                     <tr key={h.hotel_id}>
                       <td>{h.city}</td>
                       <td>{h.hotel_name}</td>
                        <td>{h.hotel_standard}</td>
                         <td>{h.hotel_deluxe}</td>
                          <td>{h.hotel_executive}</td>
                       <td>{h.room_type}</td>
                       <td>{h.nights}</td>
                     </tr>
                   ))}
                 </tbody>
               </Table>

        <hr />

        {/* ================= TRANSPORT ================= */}
        <h4>Transport Details</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Via</th>
            </tr>
          </thead>
          <tbody>
            {t.transport?.map(tr => (
              <tr key={tr.transport_id}>
                <td>{tr.airline}</td>
                <td>{tr.flight_no}</td>
                <td>{tr.from_city}</td>
                <td>{tr.to_city}</td>
                <td>{formatDate(tr.from_date)} {tr.from_time}</td>
                <td>{formatDate(tr.to_date)} {tr.to_time}</td>
                <td>{tr.via}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ================= BOOKING POI ================= */}
        <h4>Booking Information</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {t.booking_poi?.map(p => (
              <tr key={p.poi_id}>
                <td>{p.item}</td>
                <td>₹{p.amount_details}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ================= CANCELLATION ================= */}
        <h4>Cancellation Policy</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Policy</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            {t.cancellation_policies?.map(c => (
              <tr key={c.policy_id}>
                <td>{c.cancellation_policy}</td>
                <td>{c.charges}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ================= INSTRUCTIONS ================= */}
        <h4>Instructions</h4>
        <ul>
          {t.instructions?.map(i => (
            <li key={i.instruction_id}>{i.item}</li>
          ))}
        </ul>

        <hr />

        {/* ================= INCLUSIONS / EXCLUSIONS ================= */}
        <Row>
          <Col md={6}>
            <h4>Inclusions</h4>
            <ul>
              {t.inclusions?.map(i => (
                <li key={i.inclusion_id}>{i.item}</li>
              ))}
            </ul>
          </Col>
          <Col md={6}>
            <h4>Exclusions</h4>
            <ul>
              {t.exclusions?.map(e => (
                <li key={e.exclusion_id}>{e.item}</li>
              ))}
            </ul>
          </Col>
        </Row>

        <hr />

        {/* ================= ITINERARY ================= */}
        <h4>Itinerary</h4>
        {t.itinerary?.map(day => (
          <Card key={day.itinerary_id} className="mb-3">
            <Card.Body>
              <h5>Day {day.day} – {day.title}</h5>
              <p><strong>Meals:</strong> {day.meals}</p>
              <p>{day.description}</p>
            </Card.Body>
          </Card>
        ))}

        <hr />

        {/* ================= OPTIONAL TOURS ================= */}
        <h4>Optional Tours</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Adult</th>
              <th>Child</th>
            </tr>
          </thead>
          <tbody>
            {t.optional_tours?.map(o => (
              <tr key={o.optional_tour_id}>
                <td>{o.tour_name}</td>
                <td>₹{o.adult_price}</td>
                <td>₹{o.child_price}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />

        {/* ================= EMI OPTIONS ================= */}
        <h4>EMI Options</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Months</th>
              <th>EMI</th>
            </tr>
          </thead>
          <tbody>
            {t.emi_options?.map(e => (
              <tr key={e.emi_option_id}>
                <td>{e.months}</td>
                <td>₹{e.emi}</td>
              </tr>
            ))}
          </tbody>
        </Table>

      </Container>
    </Navbar>
  );
};

export default GroupTourDetails;
