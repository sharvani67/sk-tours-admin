import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Badge, Card, Button } from "react-bootstrap";
import Navbar from "./Shared/Navbar/Navbar";
import { baseurl } from "./Api/Baseurl";

const INTLHoneyMoonDetails = () => {
  const { tourId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${baseurl}/api/tours/tour/full/honeymoon/${tourId}`
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
  const isInternational = t.basic_details?.is_international === 1;

  return (
    <Navbar>
      <Container className="my-4">

        {/* ================= COVER IMAGE ================= */}
        {t.images?.length > 0 && (
          <Card className="mb-4">
            <Card.Img
              src={
                t.images.find(img => img.is_cover === 1)?.url ||
                t.images[0].url
              }
              style={{ height: 350, objectFit: "cover" }}
            />
          </Card>
        )}

        {/* ================= BASIC DETAILS ================= */}
        <h2>{t.basic_details?.title}</h2>
        <p className="text-muted">
          <Badge bg="info">Code: {t.basic_details?.tour_code}</Badge>{" "}
          • {t.basic_details?.duration_days} Days{" "}
          • <Badge bg={isInternational ? "warning" : "primary"}>
            {isInternational ? "International" : "Domestic"} Individual Tour
          </Badge>
        </p>

        <p><strong>Base Price:</strong> ₹{t.basic_details?.base_price_adult}</p>
        <p><strong>EMI Starting at:</strong> ₹{t.basic_details?.emi_price}</p>

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
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 6
                    }}
                  />
                </Col>
              ))}
            </Row>
            <hr />
          </>
        )}

        {/* ================= DEPARTURES (INDIVIDUAL) ================= */}
        <h4>Departures</h4>
        {t.departures?.length > 0 ? (
          <div className="mb-3">
            <p>{t.departures[0]?.description || "-"}</p>
            <Badge bg="success">{t.departures[0]?.status}</Badge>
          </div>
        ) : (
          <p>No departures available.</p>
        )}

        <hr />

        {/* ================= COST ================= */}
        {t.costs?.length > 0 && (
          <>
            <h4>Tour Cost (Per Pax)</h4>
            <Table bordered>
              <thead>
                <tr>
                  <th>Pax</th>
                  <th>Standard</th>
                  <th>Deluxe</th>
                  <th>Executive</th>
                  <th>Child with Bed</th>
                  <th>Child without Bed</th>
                </tr>
              </thead>
              <tbody>
                {t.costs.map(c => (
                  <tr key={c.cost_id}>
                    <td>{c.pax} Person{c.pax > 1 ? 's' : ''}</td>
                    <td>₹{c.standard_hotel}</td>
                    <td>₹{c.deluxe_hotel}</td>
                    <td>₹{c.executive_hotel}</td>
                    <td>₹{c.child_with_bed}</td>
                    <td>₹{c.child_no_bed}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= HOTELS ================= */}
        {t.hotels?.length > 0 && (
          <>
            <h4>Hotels</h4>
            <Table bordered>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Standard Hotel</th>
                  <th>Deluxe Hotel</th>
                  <th>Executive Hotel</th>
                  <th>Nights</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {t.hotels.map(h => (
                  <tr key={h.hotel_id}>
                    <td>{h.city}</td>
                    <td>{h.standard_hotel_name || "-"}</td>
                    <td>{h.deluxe_hotel_name || "-"}</td>
                    <td>{h.executive_hotel_name || "-"}</td>
                    <td>{h.nights}</td>
                    <td>{h.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= TRANSPORT ================= */}
        {t.transport?.length > 0 && (
          <>
            <h4>Transport</h4>
            <Table bordered>
              <tbody>
                {t.transport.map(tr => (
                  <tr key={tr.transport_id}>
                    <td>{tr.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= VISA SECTIONS (ONLY FOR INTERNATIONAL) ================= */}
        {isInternational && (
          <>
            {/* VISA DETAILS */}
            {t.visa_details?.length > 0 && (
              <>
                <h4>Visa Details</h4>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_details.map(v => (
                      <tr key={v.visa_id}>
                        <td>
                          <Badge bg="secondary">
                            {v.type?.charAt(0).toUpperCase() + v.type?.slice(1)}
                          </Badge>
                        </td>
                        <td>{v.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
              </>
            )}

            {/* VISA FORMS */}
            {t.visa_forms?.length > 0 && (
              <>
                <h4>Visa Forms</h4>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Visa Type</th>
                      <th>Download Text</th>
                      <th>Actions</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_forms.map(form => (
                      <tr key={form.form_id}>
                        <td>{form.visa_type}</td>
                        <td>{form.download_text}</td>
                        <td>
                          <div className="d-flex flex-column gap-2">
                            {form.action1_file_url && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                href={`${baseurl}${form.action1_file_url}`}
                                target="_blank"
                                download
                              >
                                {form.download_action || 'Download'}
                              </Button>
                            )}
                            {form.action2_file_url && (
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                href={`${baseurl}${form.action2_file_url}`}
                                target="_blank"
                                download
                              >
                                {form.fill_action || 'Fill Manually'}
                              </Button>
                            )}
                          </div>
                        </td>
                        <td>{form.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
              </>
            )}

            {/* VISA FEES */}
            {t.visa_fees?.length > 0 && (
              <>
                <h4>Visa Fees</h4>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Tourist</th>
                      <th>Transit</th>
                      <th>Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.visa_fees.map(fee => (
                      <tr key={fee.fee_id}>
                        <td>{fee.tourist || fee.transit || fee.business}</td>
                        <td>
                          {fee.tourist_charges && (
                            <>₹{fee.tourist_charges}</>
                          )}
                        </td>
                        <td>
                          {fee.transit_charges && (
                            <>₹{fee.transit_charges}</>
                          )}
                        </td>
                        <td>
                          {fee.business_charges && (
                            <>₹{fee.business_charges}</>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
              </>
            )}

            {/* VISA SUBMISSION */}
            {t.visa_submission?.length > 0 && (
              <>
                <h4>Visa Submission Details</h4>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Tourist</th>
                      <th>Transit</th>
                      <th>Business</th>
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
                <hr />
              </>
            )}
          </>
        )}

        {/* ================= BOOKING POI ================= */}
        {t.booking_poi?.length > 0 && (
          <>
            <h4>Booking Information</h4>
            <Table bordered>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount Details</th>
                </tr>
              </thead>
              <tbody>
                {t.booking_poi.map(p => (
                  <tr key={p.poi_id}>
                    <td>{p.item}</td>
                    <td>{p.amount_details}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= CANCELLATION ================= */}
        {t.cancellation_policies?.length > 0 && (
          <>
            <h4>Cancellation Policy</h4>
            <Table bordered>
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
                    <td>{c.charges}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= REMARKS SECTIONS ================= */}
        {t.basic_details?.cost_remarks && (
          <>
            <h4>Cost Remarks</h4>
            <p>{t.basic_details.cost_remarks}</p>
            <hr />
          </>
        )}

        {t.basic_details?.hotel_remarks && (
          <>
            <h4>Hotel Remarks</h4>
            <p>{t.basic_details.hotel_remarks}</p>
            <hr />
          </>
        )}

        {t.basic_details?.transport_remarks && (
          <>
            <h4>Transport Remarks</h4>
            <p>{t.basic_details.transport_remarks}</p>
            <hr />
          </>
        )}

        {t.basic_details?.emi_remarks && (
          <>
            <h4>EMI Remarks</h4>
            <p>{t.basic_details.emi_remarks}</p>
            <hr />
          </>
        )}

        {t.basic_details?.optional_tour_remarks && (
          <>
            <h4>Optional Tour Remarks</h4>
            <p>{t.basic_details.optional_tour_remarks}</p>
            <hr />
          </>
        )}

        {/* ================= INSTRUCTIONS ================= */}
        {t.instructions?.length > 0 && (
          <>
            <h4>Instructions</h4>
            <ul>
              {t.instructions.map(inst => (
                <li key={inst.instruction_id}>{inst.item}</li>
              ))}
            </ul>
            <hr />
          </>
        )}

        {/* ================= INCLUSIONS ================= */}
        {t.inclusions?.length > 0 && (
          <>
            <h4>Inclusions</h4>
            <ul>
              {t.inclusions.map(inc => (
                <li key={inc.inclusion_id}>{inc.item}</li>
              ))}
            </ul>
            <hr />
          </>
        )}

        {/* ================= EXCLUSIONS ================= */}
        {t.exclusions?.length > 0 && (
          <>
            <h4>Exclusions</h4>
            <ul>
              {t.exclusions.map(exc => (
                <li key={exc.exclusion_id}>{exc.item}</li>
              ))}
            </ul>
            <hr />
          </>
        )}

        {/* ================= ITINERARY ================= */}
        {t.itinerary?.length > 0 && (
          <>
            <h4>Itinerary</h4>
            {t.itinerary.map(day => (
              <Card key={day.itinerary_id} className="mb-3">
                <Card.Body>
                  <h5>Day {day.day} – {day.title}</h5>
                  <p><strong>Meals:</strong> {day.meals || "Not specified"}</p>
                  <p>{day.description}</p>
                </Card.Body>
              </Card>
            ))}
            <hr />
          </>
        )}

        {/* ================= OPTIONAL TOURS ================= */}
        {t.optional_tours?.length > 0 && (
          <>
            <h4>Optional Tours</h4>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Adult Price</th>
                  <th>Child Price</th>
                </tr>
              </thead>
              <tbody>
                {t.optional_tours.map(o => (
                  <tr key={o.optional_tour_id}>
                    <td>{o.tour_name}</td>
                    <td>₹{o.adult_price}</td>
                    <td>₹{o.child_price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
          </>
        )}

        {/* ================= EMI OPTIONS ================= */}
        {t.emi_options?.length > 0 && (
          <>
            <h4>EMI Options</h4>
            <Table bordered>
              <thead>
                <tr>
                  <th>Loan Amount</th>
                  <th>Months</th>
                  <th>EMI per Month</th>
                </tr>
              </thead>
              <tbody>
                {t.emi_options.map(e => (
                  <tr key={e.emi_option_id}>
                    <td>₹{e.loan_amount}</td>
                    <td>{e.months}</td>
                    <td>₹{e.emi}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

      </Container>
    </Navbar>
  );
};

export default INTLHoneyMoonDetails;