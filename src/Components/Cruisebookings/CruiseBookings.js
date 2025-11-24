import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar'; // Adjust the path as needed
import { baseurl } from '../../Api/Baseurl';

const CruiseBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCruiseBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/cruise-bookings`);
      const result = await response.json();
      
      if (result.success) {
        setBookings(result.data);
      } else {
        setError('Failed to fetch cruise bookings');
      }
    } catch (err) {
      console.error('Error fetching cruise bookings:', err);
      setError('Error fetching cruise bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCruiseBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Navbar>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Cruise Bookings</h2>
          <button 
            className="btn btn-primary"
            onClick={fetchCruiseBookings}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card>
          <Card.Header>
            <h5 className="mb-0">All Cruise Bookings</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading cruise bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No cruise bookings found.
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                 <thead className="bg-light">
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Total People</th>
    <th>Adults</th>
    <th>Children</th>
    <th>Infants</th>
    <th>Cruise Name</th>
    <th>Boarding Port</th>
    <th>Exit Port</th>
    <th>Departure Date</th>
    <th>Cabin Type</th>
    <th>Sailing Days</th>
    <th>Remarks</th>
    <th>Copy Email</th>
    <th>Created At</th>
  </tr>
</thead>

<tbody>
  {bookings.map((b) => (
    <tr key={b.id}>
      <td><strong>#{b.id}</strong></td>
      <td>{b.name || "N/A"}</td>
      <td>{b.email_id || "N/A"}</td>
      <td>{b.cell_no || "N/A"}</td>

      <td className="text-center">{b.no_of_people || 0}</td>
      <td className="text-center">{b.no_of_adult || 0}</td>
      <td className="text-center">{b.no_of_child || 0}</td>
      <td className="text-center">{b.no_of_infant || 0}</td>

      <td>{b.cruise_name || "N/A"}</td>
      <td>{b.boarding_port || "N/A"}</td>
      <td>{b.exit_port || "N/A"}</td>

      <td>
        {b.departure_date ? formatDate(b.departure_date) : "N/A"}
      </td>

      <td>{b.cabin_type || "N/A"}</td>
      <td>{b.sailing_days || "N/A"}</td>
      <td>{b.remarks || "—"}</td>
      <td>{b.copy_email || "N/A"}</td>

      <td>
        {b.created_at ? formatDate(b.created_at) : "N/A"}
      </td>
    </tr>
  ))}
</tbody>

                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default CruiseBookings;