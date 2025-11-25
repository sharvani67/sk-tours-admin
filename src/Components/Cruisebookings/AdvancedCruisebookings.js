import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/ReusableTable'; // Adjust the path to your ReusableTable component

const AdvancedCruiseBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCruiseBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/cruise-bookings-advanced`);
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: 'id',
      title: 'Booking ID',
      render: (item) => <strong>#{item.id}</strong>
    },
    {
      key: 'name',
      title: 'Customer Name',
      render: (item) => item.name || "N/A"
    },
    {
      key: 'email_id',
      title: 'Email',
      render: (item) => item.email_id || "N/A"
    },
    {
      key: 'cell_no',
      title: 'Phone',
      render: (item) => item.cell_no || "N/A"
    },
    {
      key: 'cruise_name',
      title: 'Cruise',
      render: (item) => item.cruise_name || "N/A"
    },
    {
      key: 'departure_date',
      title: 'Departure Date',
      render: (item) => formatDate(item.departure_date)
    },
    {
      key: 'no_of_people',
      title: 'Passengers',
      render: (item) => item.no_of_people || 0,
      style: { textAlign: 'center' }
    },
    {
      key: 'cabin_type',
      title: 'Cabin Type',
      render: (item) => item.cabin_type || "N/A"
    },
    {
      key: 'sailing_days',
      title: 'Sailing Days',
      render: (item) => item.sailing_days || "N/A"
    },
    {
      key: 'booking_amount',
      title: 'Total Amount',
      render: (item) => formatCurrency(item.booking_amount)
    },
    {
      key: 'created_at',
      title: 'Booking Date',
      render: (item) => formatDate(item.created_at)
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Advance Cruise Bookings</h2>
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
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading cruise bookings...
              </div>
            ) : (
              <ReusableTable
                title=""
                data={bookings}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search Advance bookings..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
                searchPosition="left"
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AdvancedCruiseBookings;