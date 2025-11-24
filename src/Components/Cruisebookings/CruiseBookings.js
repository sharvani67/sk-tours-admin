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
                      <th>Booking ID</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Cruise</th>
                      <th>Departure Date</th>
                      <th>Passengers</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Booking Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>#{booking.id}</strong>
                        </td>
                        <td>{booking.customer_name || 'N/A'}</td>
                        <td>{booking.email || 'N/A'}</td>
                        <td>{booking.phone || 'N/A'}</td>
                        <td>{booking.cruise_name || 'N/A'}</td>
                        <td>
                          {booking.departure_date 
                            ? formatDate(booking.departure_date)
                            : 'N/A'
                          }
                        </td>
                        <td className="text-center">
                          {booking.number_of_passengers || '0'}
                        </td>
                        <td>
                          ${booking.total_amount 
                            ? parseFloat(booking.total_amount).toFixed(2)
                            : '0.00'
                          }
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(booking.status)}>
                            {booking.status || 'Unknown'}
                          </Badge>
                        </td>
                        <td>
                          {booking.created_at 
                            ? formatDate(booking.created_at)
                            : 'N/A'
                          }
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