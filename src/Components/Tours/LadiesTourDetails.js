import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Badge, Card, Tab, Nav } from "react-bootstrap";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const TourDetails = () => {
  const { tourId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tourType, setTourType] = useState("individual"); // Default to individual

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try individual first, then group if needed
        const res = await fetch(
          `${baseurl}/api/tours/tour/full/individual/${tourId}`
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setTourType("individual");
        } else {
          // Try group tour
          const groupRes = await fetch(
            `${baseurl}/api/tours/tour/full/group/${tourId}`
          );
          if (groupRes.ok) {
            const json = await groupRes.json();
            setData(json);
            setTourType("group");
          } else {
            throw new Error("Tour not found");
          }
        }
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
  const isInternational = t.basic_details?.is_international === 1;
  const isIndividual = tourType === "individual";
  const isGroup = tourType === "group";

  return (
    <Navbar>
      <Container className="my-4">
        {/* ================= BASIC INFO ================= */}
        <div className="mb-4">
          <h2>{t.basic_details?.title}</h2>
          <div className="d-flex align-items-center gap-3 mb-2">
            <Badge bg="info">Code: {t.basic_details?.tour_code}</Badge>
            <Badge bg={isInternational ? "warning" : "success"}>
              {isInternational ? "International" : "Domestic"}
            </Badge>
            <Badge bg={isIndividual ? "primary" : "secondary"}>
              {isIndividual ? "Individual" : "Group"} Tour
            </Badge>
            <span>{t.basic_details?.duration_days} Days</span>
          </div>
          
          {/* Tour Type Specific Remarks */}
          {t.basic_details?.tour_type === "individual" && t.basic_details?.cost_remarks && (
            <Card className="mt-2">
              <Card.Body className="py-2">
                <small className="text-muted">{t.basic_details.cost_remarks}</small>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* ================= COVER IMAGE ================= */}
        {t.images?.length > 0 && (
          <Card className="mb-4 border-0">
            <Card.Img
              src={
                t.images.find(img => img.is_cover === 1)?.url ||
                t.images[0].url
              }
              style={{ height: 400, objectFit: "cover", borderRadius: "10px" }}
            />
          </Card>
        )}

        <hr />

        {/* ================= GALLERY ================= */}
        {t.images?.length > 1 && (
          <>
            <h4>Gallery</h4>
            <Row className="mb-4">
              {t.images.map(img => (
                <Col md={3} key={img.image_id} className="mb-3">
                  <img
                    src={img.url}
                    alt=""
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                    onClick={() => window.open(img.url, '_blank')}
                  />
                </Col>
              ))}
            </Row>
            <hr />
          </>
        )}

        {/* ================= DEPARTURES ================= */}
        <h4>Departures</h4>
        {isIndividual ? (
          // Individual Tour Departure (Free flow description)
          t.departures?.length > 0 ? (
            <Card className="mb-4">
              <Card.Body>
                <p>{t.departures[0]?.description || "-"}</p>
                <Badge bg="success">{t.departures[0]?.status || "Available"}</Badge>
              </Card.Body>
            </Card>
          ) : (
            <p>No departure information available.</p>
          )
        ) : (
          // Group Tour Departure (Table with dates and prices)
          t.departures?.length > 0 ? (
            <Table bordered hover responsive className="mb-4">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Seats</th>
                  <th>Booked Seats</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {t.departures.map(d => (
                  <tr key={d.departure_id}>
                    <td>{d.start_date ? new Date(d.start_date).toLocaleDateString() : "-"}</td>
                    <td>{d.end_date ? new Date(d.end_date).toLocaleDateString() : "-"}</td>
                    <td>{d.total_seats}</td>
                    <td>{d.booked_seats}</td>
                    <td>{d.total_seats - d.booked_seats}</td>
                    <td><Badge bg={d.status === "Available" ? "success" : "danger"}>{d.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No departures scheduled.</p>
          )
        )}

        <hr />

        {/* ================= COST SECTION ================= */}
        {isIndividual ? (
          // Individual Tour Cost (Per Pax table)
          <>
            <h4>Tour Cost (Per Pax)</h4>
            {t.costs?.length > 0 ? (
              <Table bordered hover responsive className="mb-4">
                <thead>
                  <tr>
                    <th>Pax</th>
                    <th>Standard Hotel</th>
                    <th>Deluxe Hotel</th>
                    <th>Executive Hotel</th>
                    <th>Child With Bed</th>
                    <th>Child No Bed</th>
                  </tr>
                </thead>
                <tbody>
                  {t.costs.map(c => (
                    <tr key={c.cost_id}>
                      <td>{c.pax}</td>
                      <td>₹{parseFloat(c.standard_hotel).toLocaleString()}</td>
                      <td>₹{parseFloat(c.deluxe_hotel).toLocaleString()}</td>
                      <td>₹{parseFloat(c.executive_hotel).toLocaleString()}</td>
                      <td>₹{parseFloat(c.child_with_bed).toLocaleString()}</td>
                      <td>₹{parseFloat(c.child_no_bed).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No cost details available.</p>
            )}
          </>
        ) : (
          // Group Tour Cost (Star hotel wise table)
          <>
            <h4>Group Tour Prices (Star Category Wise)</h4>
            {t.departures?.length > 0 && t.departures[0] ? (
              <Tab.Container defaultActiveKey="threeStar">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="threeStar">3 Star Hotels</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourStar">4 Star Hotels</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fiveStar">5 Star Hotels</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="threeStar">
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Twin Sharing</th>
                          <th>Triple Sharing</th>
                          <th>Child With Bed</th>
                          <th>Child Without Bed</th>
                          <th>Infant</th>
                          <th>Single</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>₹{parseFloat(t.departures[0].three_star_twin || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].three_star_triple || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].three_star_child_with_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].three_star_child_without_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].three_star_infant || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].three_star_single || 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="fourStar">
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Twin Sharing</th>
                          <th>Triple Sharing</th>
                          <th>Child With Bed</th>
                          <th>Child Without Bed</th>
                          <th>Infant</th>
                          <th>Single</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>₹{parseFloat(t.departures[0].four_star_twin || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].four_star_triple || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].four_star_child_with_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].four_star_child_without_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].four_star_infant || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].four_star_single || 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="fiveStar">
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Twin Sharing</th>
                          <th>Triple Sharing</th>
                          <th>Child With Bed</th>
                          <th>Child Without Bed</th>
                          <th>Infant</th>
                          <th>Single</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>₹{parseFloat(t.departures[0].five_star_twin || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].five_star_triple || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].five_star_child_with_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].five_star_child_without_bed || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].five_star_infant || 0).toLocaleString()}</td>
                          <td>₹{parseFloat(t.departures[0].five_star_single || 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            ) : (
              <p>No group pricing available.</p>
            )}
          </>
        )}

        <hr />

        {/* ================= HOTELS ================= */}
        <h4>Hotels</h4>
        {t.hotels?.length > 0 ? (
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>City</th>
                <th>Nights</th>
                {isIndividual && (
                  <>
                    <th>Standard Hotel</th>
                    <th>Deluxe Hotel</th>
                    <th>Executive Hotel</th>
                  </>
                )}
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {t.hotels.map(h => (
                <tr key={h.hotel_id}>
                  <td>{h.city}</td>
                  <td>{h.nights}</td>
                  {isIndividual && (
                    <>
                      <td>{h.standard_hotel_name || "-"}</td>
                      <td>{h.deluxe_hotel_name || "-"}</td>
                      <td>{h.executive_hotel_name || "-"}</td>
                    </>
                  )}
                  <td>{h.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hotel information available.</p>
        )}

        <hr />

        {/* ================= TRANSPORT ================= */}
        <h4>Transport</h4>
        {isIndividual ? (
          // Individual Tour Transport (Description)
          t.transport?.length > 0 ? (
            <Card className="mb-4">
              <Card.Body>
                <p>{t.transport[0]?.description || "No transport details available."}</p>
              </Card.Body>
            </Card>
          ) : (
            <p>No transport details available.</p>
          )
        ) : (
          // Group Tour Transport (Flight details table)
          t.transport?.length > 0 ? (
            <Table bordered hover responsive className="mb-4">
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Flight No</th>
                  <th>From City</th>
                  <th>Departure</th>
                  <th>To City</th>
                  <th>Arrival</th>
                  <th>Via</th>
                </tr>
              </thead>
              <tbody>
                {t.transport.map(tr => (
                  <tr key={tr.transport_id}>
                    <td>{tr.airline || "-"}</td>
                    <td>{tr.flight_no || "-"}</td>
                    <td>{tr.from_city || "-"}</td>
                    <td>
                      {tr.from_date ? new Date(tr.from_date).toLocaleDateString() : "-"} {tr.from_time || ""}
                    </td>
                    <td>{tr.to_city || "-"}</td>
                    <td>
                      {tr.to_date ? new Date(tr.to_date).toLocaleDateString() : "-"} {tr.to_time || ""}
                    </td>
                    <td>{tr.via || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No transport details available.</p>
          )
        )}

        <hr />

        {/* ================= VISA DETAILS (INTERNATIONAL ONLY) ================= */}
        {isInternational && (
          <>
            <h4>Visa Information</h4>
            
            {/* Visa Types */}
            {t.visa_details?.length > 0 && (
              <div className="mb-4">
                <h5>Visa Types & Requirements</h5>
                <Row>
                  {t.visa_details.map(v => (
                    <Col md={6} key={v.visa_id} className="mb-3">
                      <Card>
                        <Card.Header>
                          <strong>{v.type.charAt(0).toUpperCase() + v.type.slice(1)} Visa</strong>
                        </Card.Header>
                        <Card.Body>
                          <p className="mb-0">{v.description}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Visa Forms */}
            {t.visa_forms?.length > 0 && (
              <div className="mb-4">
                <h5>Visa Forms</h5>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Visa Type</th>
                      <th>Download Form</th>
                      <th>Fill Form</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_forms.map(form => (
                      <tr key={form.form_id}>
                        <td>{form.visa_type}</td>
                        <td>
                          <a href={`${baseurl}${form.action1_file_url}`} download className="btn btn-sm btn-outline-primary">
                            {form.download_action} PDF
                          </a>
                        </td>
                        <td>
                          <a href={`${baseurl}${form.action2_file_url}`} download className="btn btn-sm btn-outline-secondary">
                            {form.fill_action} DOC
                          </a>
                        </td>
                        <td><small>{form.remarks}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Visa Fees */}
            {t.visa_fees?.length > 0 && (
              <div className="mb-4">
                <h5>Visa Fees</h5>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Tourist Visa</th>
                      <th>Transit Visa</th>
                      <th>Business Visa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_fees.map(fee => (
                      <tr key={fee.fee_id}>
                        <td>{fee.tourist || "Service Fee"}</td>
                        <td>₹{fee.tourist_charges || "-"}</td>
                        <td>₹{fee.transit_charges || "-"}</td>
                        <td>₹{fee.business_charges || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Visa Submission Details */}
            {t.visa_submission?.length > 0 && (
              <div className="mb-4">
                <h5>Visa Submission Details</h5>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Tourist Visa</th>
                      <th>Transit Visa</th>
                      <th>Business Visa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_submission.map(sub => (
                      <tr key={sub.submission_id}>
                        <td>{sub.label}</td>
                        <td>{sub.tourist}</td>
                        <td>{sub.transit}</td>
                        <td>{sub.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <hr />
          </>
        )}

        {/* ================= BOOKING POI ================= */}
        <h4>Booking Information</h4>
        {t.booking_poi?.length > 0 ? (
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {t.booking_poi.map(p => (
                <tr key={p.poi_id}>
                  <td>{p.item}</td>
                  <td>₹{parseFloat(p.amount_details || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No booking information available.</p>
        )}

        <hr />

        {/* ================= CANCELLATION ================= */}
        <h4>Cancellation Policy</h4>
        {t.cancellation_policies?.length > 0 ? (
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Charges</th>
              </tr>
            </thead>
            <tbody>
              {t.cancellation_policies.map(c => (
                <tr key={c.policy_id}>
                  <td>{c.cancellation_policy}</td>
                  <td>₹{parseFloat(c.charges || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No cancellation policy available.</p>
        )}

        <hr />

        {/* ================= INSTRUCTIONS ================= */}
        <h4>Instructions</h4>
        {t.instructions?.length > 0 ? (
          <ul className="mb-4">
            {t.instructions.map(inst => (
              <li key={inst.instruction_id}>{inst.item}</li>
            ))}
          </ul>
        ) : (
          <p>No instructions available.</p>
        )}

        <hr />

        {/* ================= INCLUSIONS ================= */}
        <h4>Inclusions</h4>
        {t.inclusions?.length > 0 ? (
          <ul className="mb-4">
            {t.inclusions.map(inc => (
              <li key={inc.inclusion_id}>{inc.item}</li>
            ))}
          </ul>
        ) : (
          <p>No inclusions specified.</p>
        )}

        <hr />

        {/* ================= EXCLUSIONS ================= */}
        <h4>Exclusions</h4>
        {t.exclusions?.length > 0 ? (
          <ul className="mb-4">
            {t.exclusions.map(exc => (
              <li key={exc.exclusion_id}>{exc.item}</li>
            ))}
          </ul>
        ) : (
          <p>No exclusions specified.</p>
        )}

        <hr />

        {/* ================= ITINERARY ================= */}
        <h4>Itinerary</h4>
        {t.itinerary?.length > 0 ? (
          t.itinerary.map(day => (
            <Card key={day.itinerary_id} className="mb-3">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>Day {day.day} – {day.title}</span>
                  <Badge bg="info">{day.meals || "No meals specified"}</Badge>
                </Card.Title>
                <Card.Text>{day.description}</Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No itinerary available.</p>
        )}

        <hr />

        {/* ================= OPTIONAL TOURS ================= */}
        <h4>Optional Tours</h4>
        {t.optional_tours?.length > 0 ? (
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Tour Name</th>
                <th>Adult Price</th>
                <th>Child Price</th>
              </tr>
            </thead>
            <tbody>
              {t.optional_tours.map(o => (
                <tr key={o.optional_tour_id}>
                  <td>{o.tour_name}</td>
                  <td>₹{parseFloat(o.adult_price || 0).toLocaleString()}</td>
                  <td>₹{parseFloat(o.child_price || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No optional tours available.</p>
        )}

        <hr />

        {/* ================= EMI OPTIONS ================= */}
        <h4>EMI Options</h4>
        {t.emi_options?.length > 0 ? (
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Loan Amount</th>
                <th>Particulars</th>
                <th>Months</th>
                <th>EMI Amount</th>
              </tr>
            </thead>
            <tbody>
              {t.emi_options.map(e => (
                <tr key={e.emi_option_id}>
                  <td>₹{parseFloat(e.loan_amount || 0).toLocaleString()}</td>
                  <td>{e.particulars}</td>
                  <td>{e.months}</td>
                  <td>₹{parseFloat(e.emi || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No EMI options available.</p>
        )}

      </Container>
    </Navbar>
  );
};

export default TourDetails;