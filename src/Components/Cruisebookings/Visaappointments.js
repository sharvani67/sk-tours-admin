import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar'; // Adjust the path as needed
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable'; // Adjust the path to your ReusableTable component

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
        setError('Failed to fetch visa appointments');
      }
    } catch (err) {
      console.error('Error fetching visa appointments:', err);
      setError('Error fetching visa appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaAppointments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: 'id',
      title: 'ID',
      style: { fontWeight: 'bold' }
    },
    {
      key: 'name',
      title: 'Name'
    },
    {
      key: 'email_id',
      title: 'Email'
    },
    {
      key: 'cell_no',
      title: 'Phone'
    },
    {
      key: 'address',
      title: 'Address'
    },
    {
      key: 'city',
      title: 'City'
    },
    {
      key: 'pin_code',
      title: 'Pincode'
    },
    {
      key: 'state',
      title: 'State'
    },
    {
      key: 'country',
      title: 'Country'
    },
    {
      key: 'consultancy_country',
      title: 'Consultancy Country'
    },
    {
      key: 'convenient_date',
      title: 'Convenient Date',
      render: (item) => formatDate(item.convenient_date)
    },
    {
      key: 'convenient_time',
      title: 'Convenient Time'
    },
    {
      key: 'no_of_people',
      title: 'No. of People',
      style: { textAlign: 'center' }
    },
    {
      key: 'agreed_terms',
      title: 'Agreed',
      render: (item) => (
        item.agreed_terms === 1 ? 
          <span className="badge bg-success">Yes</span> : 
          <span className="badge bg-danger">No</span>
      )
    },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) => formatDate(item.created_at)
    }
  ];

  // Transform the data to handle null/undefined values
  const tableData = bookings.map(booking => ({
    ...booking,
    name: booking.name || "N/A",
    email_id: booking.email_id || "N/A",
    cell_no: booking.cell_no || "N/A",
    address: booking.address || "N/A",
    city: booking.city || "N/A",
    pin_code: booking.pin_code || "N/A",
    state: booking.state || "N/A",
    country: booking.country || "N/A",
    consultancy_country: booking.consultancy_country || "N/A",
    convenient_time: booking.convenient_time || "N/A",
    no_of_people: booking.no_of_people || 0
  }));

  return (
    <Navbar>
      <Container>
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
            ) : (
              <ReusableTable
                title="Visa Appointments"
                data={tableData}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search visa appointments..."
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

export default Visaappointments;