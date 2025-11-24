import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar'; // Adjust the path as needed
import { baseurl } from '../../Api/Baseurl';

const Visaappointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVisaAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/visa-appointments`);
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
    fetchVisaAppointments();
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



  return (
    <Navbar>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Visa Appointments</h2>
          <button 
            className="btn btn-primary"
            onClick={fetchVisaAppointments}
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
         
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading Visa Appointments
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No Visa Appointments found.
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
    <th>Address</th>
    <th>City</th>
    <th>Pincode</th>
    <th>State</th>
    <th>Country</th>
    <th>Consultancy Country</th>
    <th>Convenient Date</th>
    <th>Convenient Time</th>
    <th>No. of People</th>
    <th>Agreed</th>
    <th>Created At</th>
  </tr>
</thead>

<tbody>
  {bookings.map((b) => (
    <tr key={b.id}>
      <td><strong>{b.id}</strong></td>
      
      <td>{b.name || "N/A"}</td>
      <td>{b.email_id || "N/A"}</td>
      <td>{b.cell_no || "N/A"}</td>

      <td>{b.address || "N/A"}</td>
      <td>{b.city || "N/A"}</td>
      <td>{b.pin_code || "N/A"}</td>
      <td>{b.state || "N/A"}</td>
      <td>{b.country || "N/A"}</td>

      <td>{b.consultancy_country || "N/A"}</td>

      <td>
        {b.convenient_date ? formatDate(b.convenient_date) : "N/A"}
      </td>

      <td>{b.convenient_time || "N/A"}</td>

      <td className="text-center">{b.no_of_people || 0}</td>

      <td>
        {b.agreed_terms === 1 ? (
          <span className="badge bg-success">Yes</span>
        ) : (
          <span className="badge bg-danger">No</span>
        )}
      </td>

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

export default Visaappointments;