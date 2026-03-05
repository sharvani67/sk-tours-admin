import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const AddFlightTax = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    flight_type: "",
    charges: "",
    remarks: ""
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {

      setFetching(true);

      const res = await fetch(`${baseurl}/api/online-flights/flight-charges/${id}`);
      const data = await res.json();

      setFormData({
        flight_type: data.flight_type || "",
        charges: data.charges || "",
        remarks: data.remarks || ""
      });

      setIsEditMode(true);

    } catch (err) {
      setError("Error loading data");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const url = isEditMode
        ? `${baseurl}/api/online-flights/flight-charges/${id}`
        : `${baseurl}/api/online-flights/flight-charges`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {

        setSuccess(isEditMode ? "Updated successfully" : "Added successfully");

        setTimeout(() => {
          navigate("/Flighttax");
        }, 1500);

      } else {
        setError(result.message || "Error saving data");
      }

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

    <Navbar>

      <Container>

        <h3 className="mb-4">
          {isEditMode ? "Edit Flight Charges" : "Add Flight Charges"}
        </h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>

            {fetching ? (
              <Spinner animation="border" />
            ) : (

              <Form onSubmit={handleSubmit}>

                <Row>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Flight Type</Form.Label>
                      <Form.Select
                        name="flight_type"
                        value={formData.flight_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="one way">One Way</option>
                        <option value="roundtrip">Round Trip</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Charges</Form.Label>
                      <Form.Control
                        type="text"
                        name="charges"
                        value={formData.charges}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                </Row>

                <div className="d-flex justify-content-end gap-2">

                  <Button
                    variant="secondary"
                    onClick={() => navigate("/Flighttax")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={loading}>

                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Saving...
                      </>
                    ) : isEditMode ? "Update" : "Add"}

                  </Button>

                </div>

              </Form>

            )}

          </Card.Body>
        </Card>

      </Container>

    </Navbar>
  );
};

export default AddFlightTax;