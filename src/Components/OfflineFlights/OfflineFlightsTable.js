// OfflineFlightsTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Airplane } from 'react-bootstrap-icons';

const OfflineFlightsTable = () => {
  const [offlineFlights, setOfflineFlights] = useState([]);
  const [filteredOfflineFlights, setFilteredOfflineFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Offline Flights
  const fetchOfflineFlights = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/offline-flights`);
      const result = await response.json();
      
      console.log('API Response:', result); // Debug log

      // Extract data array from the response
      const flightsData = result.data || result; // Handle both nested and direct array responses
      
      const flightsArray = Array.isArray(flightsData) ? flightsData : [];

      // Sort offline flights by created_at in descending order (newest first)
      const sortedFlights = flightsArray.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

      // Add serial numbers to the data
      const flightsWithSerialNo = sortedFlights.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));

      setOfflineFlights(sortedFlights);
      setFilteredOfflineFlights(flightsWithSerialNo);
    } catch (err) {
      console.error('Error fetching offline flights:', err);
      setError('Error fetching offline flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfflineFlights();
  }, []);

  // Handle Delete Offline Flight
  const handleDelete = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this offline flight?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/offline-flights/${flightId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Offline flight deleted successfully');
        fetchOfflineFlights();
      } else {
        alert(result.message || result.error || 'Failed to delete offline flight');
      }
    } catch (err) {
      console.error('Error deleting offline flight:', err);
      alert('Error deleting offline flight. Please try again.');
    }
  };

  // Handle Edit - Navigate to add/edit form with ID
  const handleEdit = (flightId) => {
    navigate(`/add-offline-flight/${flightId}`);
  };

  // Format flight duration from string
  const formatDuration = (duration) => {
    if (!duration) return '—';
    return duration; // Already formatted as "2h 10mins"
  };

  // Format price with currency (INR since it's Indian flights)
  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Define table columns - updated to match your API response
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        if (item.serial_no) return item.serial_no;
        if (index !== undefined) return index + 1;
        return 'N/A';
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'flight_number',
      title: 'Flight No.',
      render: (item) => (
        <div className="d-flex align-items-center">
          <Airplane className="me-2 text-primary" size={16} />
          <span className="fw-bold">{item.flight_number || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '120px' }
    },
    {
      key: 'airline',
      title: 'Airline',
      render: (item) => item.airline || 'N/A'
    },
    {
      key: 'route',
      title: 'Route',
      render: (item) => {
        const origin = `${item.from_city || ''} (${item.from_airport_code || ''})`;
        const destination = `${item.to_city || ''} (${item.to_airport_code || ''})`;
        return (
          <span>
            {origin} → {destination}
          </span>
        );
      },
      style: { minWidth: '200px' }
    },
    {
      key: 'departure_date',
      title: 'Departure',
      render: (item) => formatDateTime(item.departure_date),
    },
    {
      key: 'arrival_time',
      title: 'Arrival Time',
      render: (item) => item.arrival_time || 'N/A',
      style: { textAlign: 'center' }
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (item) => item.duration || formatDuration(item.flight_time),
      style: { textAlign: 'center' }
    },
    {
      key: 'price_per_adult',
      title: 'Price/Adult',
      render: (item) => (
        <span className="fw-bold text-success">
          {formatPrice(item.price_per_adult)}
        </span>
      ),
      style: { textAlign: 'right', fontWeight: 'bold' }
    },
    {
      key: 'traveller_class',
      title: 'Class',
      render: (item) => item.traveller_class || 'Economy',
      style: { textAlign: 'center' }
    },
    {
      key: 'flight_type',
      title: 'Stops',
      render: (item) => {
        const type = item.flight_type || 'Direct';
        return (
          <span className={type.includes('Stop') ? 'text-warning' : 'text-success'}>
            {type}
          </span>
        );
      },
      style: { textAlign: 'center' }
    },
    {
      key: 'booking_type',
      title: 'Booking Type',
      render: (item) => {
        const type = item.booking_type || 'oneWay';
        return type === 'oneWay' ? 'One Way' : 'Round Trip';
      },
      style: { textAlign: 'center' }
    },
    {
      key: 'baggage_allowance',
      title: 'Baggage',
      render: (item) => {
        if (!item.baggage_allowance) return '—';
        return (
          <span title={item.baggage_allowance}>
            {item.baggage_allowance.substring(0, 20)}...
          </span>
        );
      },
      style: { maxWidth: '150px' }
    },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) => {
        if (!item.created_at) return 'N/A';
        try {
          const date = new Date(item.created_at);
          return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch {
          return 'Invalid Date';
        }
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.id)}
            title="Edit Flight"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
            title="Delete Flight"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Offline Flights Management</h2>
            <p className="text-muted mb-0">
              Manage all offline flight schedules and details
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-offline-flight')}
            >
              <Airplane className="me-2" size={16} />
              + Add Offline Flight
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex align-items-center">
              <Airplane className="text-primary me-2" size={20} />
              <h5 className="mb-0">Offline Flights List</h5>
              <span className="badge bg-primary ms-3">
                {filteredOfflineFlights.length} Flights
              </span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading offline flights...
              </div>
            ) : filteredOfflineFlights.length === 0 ? (
              <div className="text-center py-5">
                <Airplane size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Offline Flights Found</h5>
                <p className="text-muted mb-3">Click the "Add Offline Flight" button to create your first flight</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-offline-flight')}
                >
                  <Airplane className="me-2" size={16} />
                  Add Your First Flight
                </button>
              </div>
            ) : (
              <ReusableTable
                title="All Offline Flights"
                data={filteredOfflineFlights}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by flight number, airline, or route..."
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

export default OfflineFlightsTable;