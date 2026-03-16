import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import { Pencil, Trash, Eye } from "react-bootstrap-icons";
import Navbar from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";
import ReusableTable from "../../Shared/TableLayout/DataTable";
import { useNavigate } from "react-router-dom";

const WeekendBookingTable = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Weekend Bookings only (type = 'weekend')
  const fetchWeekendBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // API already filters by type=weekend
      const response = await fetch(`${baseurl}/api/passport/bookedform?type=weekend`);
      const result = await response.json();

      if (response.ok) {
        setBookings(result);
        setFilteredBookings(result);
      } else {
        setError("Failed to fetch weekend bookings");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading weekend bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekendBookings();
  }, []);

  // Delete Booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this weekend booking?")) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/passport/bookings/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Weekend booking deleted successfully");
        fetchWeekendBookings();
      } else {
        alert(result.message || "Delete failed");
      }

    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting weekend booking");
    }
  };

  // View Booking
  const handleView = (id) => {
    navigate(`/onedaypicnicview/${id}`);
  };

  // Edit Booking
  const handleEdit = (id) => {
    navigate(`/weekend-booking-edit/${id}`);
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
      title: "Property Name",
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
      title: "Total People",
      render: (item) => item.no_of_people || "0",
      style: { textAlign: "center" }
    },
  
    {
      key: "created_at",
      title: "Booking Date",
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
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
            title="View Details"
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
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Weekend Gateway Bookings</h2>
            <p className="text-muted mb-0">Manage all weekend getaway bookings</p>
          </div>
          <div>
    
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading weekend bookings...
              </div>
            ) : (
              <ReusableTable
                title="Weekend Gateway Bookings"
                data={filteredBookings}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by name, city, phone..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted mb-0">No weekend bookings found</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default WeekendBookingTable;