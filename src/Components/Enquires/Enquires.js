import React, { useEffect, useState } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";
import ReusableTable from "../../Shared/TableLayout/DataTable";

const TourEnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${baseurl}/api/tour-enquiries`);
      const data = await res.json();

      const sorted = data.sort((a, b) => b.id - a.id);
      setEnquiries(sorted);
    } catch (err) {
      setError("Failed to fetch tour enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const columns = [
    {
      key: "serial",
      title: "S.No",
      render: (_, index) => index + 1,
      style: { fontWeight: "bold", textAlign: "center" }
    },
    {
      key: "name",
      title: "Name",
      render: (item) => item.name
    },
    {
      key: "email",
      title: "Email",
      render: (item) => (
        <a href={`mailto:${item.email}`} className="text-decoration-none">
          {item.email}
        </a>
      )
    },
    {
      key: "phone",
      title: "Phone",
      render: (item) => item.phone
    },
    {
      key: "tour",
      title: "Tour",
      render: (item) => (
        <>
          <strong>{item.tour_title}</strong>
          <div className="text-muted">{item.tour_code}</div>
        </>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (item) => (
        <span
          className={`badge ${
            item.is_read ? "bg-success" : "bg-danger"
          }`}
        >
          {item.is_read ? "Read" : "New"}
        </span>
      )
    },
    {
      key: "date",
      title: "Submitted",
      render: (item) =>
        new Date(item.created_at).toLocaleString("en-IN")
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Tour Enquiries</h2>
          <button
            className="btn btn-primary"
            onClick={fetchEnquiries}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Card>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" className="me-2" />
                Loading enquiries...
              </div>
            ) : (
              <ReusableTable
                title="Tour Enquiries"
                data={enquiries}
                columns={columns}
                initialEntriesPerPage={10}
                showSearch={true}
                showPagination={true}
                showEntriesSelector={true}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default TourEnquiriesTable;
