import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";
import ReusableTable from "../../Shared/TableLayout/DataTable";
import { useNavigate } from "react-router-dom";

const FlightTax = () => {
  const [flightCharges, setFlightCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ GET Flight Charges
  const fetchFlightCharges = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${baseurl}/api/online-flights/flight-charges`);
      const result = await response.json();

      if (response.ok) {
        setFlightCharges(result.data || []);
      } else {
        setError(result.message || "Failed to fetch flight charges");
      }
    } catch (err) {
      console.error("Error fetching flight charges:", err);
      setError("Error fetching flight charges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightCharges();
  }, []);

  // ✅ DELETE Flight Charge
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight charge?")) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/online-flights/flight-charges/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Flight charge deleted successfully");
        fetchFlightCharges();
      } else {
        alert(result.message || "Failed to delete flight charge");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting flight charge");
    }
  };

  // ✅ Edit
  const handleEdit = (id) => {
    navigate(`/addflighttax/${id}`);
  };

  // ✅ Table Columns
  const columns = [
    {
      key: "serial_no",
      title: "S.No",
      render: (item, index) => index + 1,
      style: { textAlign: "center", fontWeight: "bold" },
    },
    {
      key: "flight_type",
      title: "Flight Type",
      render: (item) => item.flight_type || "N/A",
    },
    {
      key: "charges",
      title: "Charges",
      render: (item) => item.charges || "0",
    },
    {
      key: "remarks",
      title: "Remarks",
      render: (item) => item.remarks || "-",
    },
    {
      key: "actions",
      title: "Actions",
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.id)}
          >
            <Pencil />
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
          >
            <Trash />
          </button>
        </div>
      ),
      style: { textAlign: "center", minWidth: "120px" },
    },
  ];

  return (
    <Navbar>
      <Container>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Flight Charges</h2>

          {/* <button
            className="btn btn-success"
            onClick={() => navigate("/addflighttax")}
          >
            + Add Flight Charges
          </button> */}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Card>
          <Card.Body className="p-0">

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <div className="mt-2">Loading flight charges...</div>
              </div>
            ) : (
              <ReusableTable
                title="Flight Charges List"
                data={flightCharges}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search flight type..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}

          </Card.Body>
        </Card>

      </Container>
    </Navbar>
  );
};

export default FlightTax;