import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import { Pencil, Trash, Eye } from "react-bootstrap-icons";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";
import ReusableTable from "../../Shared/TableLayout/DataTable";
import { useNavigate } from "react-router-dom";

const BungalowTable = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Bungalow Bookings (type = 'bungalow')
  const fetchBungalowBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // Add type=bungalow query parameter to filter bungalow bookings
      const response = await fetch(`${baseurl}/api/passport/bookedform?type=bungalow`);
      const result = await response.json();

      if (response.ok) {
        setBookings(result);
        setFilteredBookings(result);
      } else {
        setError("Failed to fetch bungalow bookings");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading bungalow bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBungalowBookings();
  }, []);

  // Delete Booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bungalow booking?")) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/passport/bookings/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Bungalow booking deleted successfully");
        fetchBungalowBookings();
      } else {
        alert(result.message || "Delete failed");
      }

    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting bungalow booking");
    }
  };

  // View Booking
  const handleView = (id) => {
    navigate(`/Bookingview/${id}`);
  };

  // Edit Booking (if needed)
  const handleEdit = (id) => {
    navigate(`/bungalow-booking-edit/${id}`);
  };

  // Columns for ReusableTable
  const columns = [
    {
      key: "serial_no",
      title: "S No.",
      render: (item, index) => index + 1,
      style: { fontWeight: "bold", textAlign: "center", width: "80px" }
    },
    {
      key: "bungalow_code",
      title: "Bungalow Code",
      render: (item) => item.bungalow_code || "N/A"
    },
    {
      key: "city",
      title: "City",
      render: (item) => item.city || "N/A"
    },
    {
      key: "contact_person",
      title: "Contact Person",
      render: (item) => item.contact_person || "N/A"
    },
    {
      key: "booking_phone",
      title: "Phone",
      render: (item) => item.booking_phone || "N/A"
    },
    {
      key: "booking_email",
      title: "Email",
      render: (item) => item.booking_email || "N/A"
    },
    {
      key: "no_of_people",
      title: "No Of People",
      render: (item) => item.no_of_people || "0",
      style: { textAlign: "center" }
    },
  
    {
      key: "actions",
      title: "Actions",
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleView(item.booking_id)}
            title="View"
          >
            <Eye size={16} />
          </button>

          {/* <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.booking_id)}
            title="Edit"
          >
            <Pencil size={16} />
          </button> */}

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.booking_id)}
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: "center", minWidth: "150px" }
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Bungalow Bookings</h2>
            <p className="text-muted mb-0">Manage all bungalow bookings</p>
          </div>
   
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" className="me-2" />
                Loading bungalow bookings...
              </div>
            ) : (
              <ReusableTable
                title="Bungalow Bookings"
                data={filteredBookings}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search bungalow bookings..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted mb-0">No bungalow bookings found</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default BungalowTable;