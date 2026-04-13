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

  const fetchOfflineFlights = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/offline-flights`);
      const result = await response.json();
      
      console.log('API Response:', result);

      const flightsData = result.data || result;
      const flightsArray = Array.isArray(flightsData) ? flightsData : [];

      const sortedFlights = flightsArray.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

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

  const handleEdit = (flightId) => {
    navigate(`/add-offline-flight/${flightId}`);
  };

  const formatDuration = (duration) => {
    if (!duration) return '—';
    return duration;
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date for display - handles YYYY-MM-DD directly without timezone
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // If it's already in YYYY-MM-DD format, parse it as local date
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        // Create date in local timezone by using UTC to avoid shifting
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        });
      }
      // Fallback for other formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Calculate arrival date based on departure date, departure time, and duration
  const calculateArrivalDate = (departureDateStr, departureTimeStr, durationStr) => {
    if (!departureDateStr || !departureTimeStr || !durationStr) {
      return departureDateStr;
    }

    try {
      // Parse departure date
      const [year, month, day] = departureDateStr.split('-');
      
      // Parse departure time (HH:MM:SS)
      const [depHours, depMinutes, depSeconds] = departureTimeStr.split(':').map(Number);
      
      // Parse duration (e.g., "2h 10mins", "3hr 30 mins", "1h 30m")
      let durationHours = 0;
      let durationMinutes = 0;
      
      // Match patterns like "2h 10mins", "3hr 30 mins", "1h 30m"
      const hourMatch = durationStr.match(/(\d+)\s*(?:h|hr)/i);
      const minuteMatch = durationStr.match(/(\d+)\s*(?:min|mins|m)/i);
      
      if (hourMatch) {
        durationHours = parseInt(hourMatch[1]);
      }
      if (minuteMatch) {
        durationMinutes = parseInt(minuteMatch[1]);
      }
      
      // Create departure datetime in UTC
      const departureDateTime = new Date(Date.UTC(year, month - 1, day, depHours, depMinutes, depSeconds || 0));
      
      // Add duration
      const arrivalDateTime = new Date(departureDateTime.getTime() + (durationHours * 60 * 60 * 1000) + (durationMinutes * 60 * 1000));
      
      // Format arrival date
      const arrivalDate = new Date(Date.UTC(arrivalDateTime.getUTCFullYear(), arrivalDateTime.getUTCMonth(), arrivalDateTime.getUTCDate()));
      
      return arrivalDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      });
    } catch (error) {
      console.error('Error calculating arrival date:', error);
      return formatDateForDisplay(departureDateStr);
    }
  };

  // Format time only - handles HH:MM:SS format
  const formatTimeOnly = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      if (timeString.includes(':')) {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (isNaN(hours) || isNaN(minutes)) {
          return timeString;
        }
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const minuteStr = minutes.toString().padStart(2, '0');
        
        return `${hour12}:${minuteStr} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  // Format created_at timestamp
  const formatCreatedAt = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

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
      title: 'Departure Date & Time',
      render: (item) => (
        <div>
          <div className="fw-bold">{formatDateForDisplay(item.departure_date)}</div>
          <small className="text-muted">{formatTimeOnly(item.flight_time)}</small>
        </div>
      ),
    },
    {
      key: 'arrival_info',
      title: 'Arrival',
      render: (item) => {
        const arrivalDate = calculateArrivalDate(
          item.departure_date, 
          item.flight_time, 
          item.duration
        );
        return (
          <div>
            <div className="fw-bold">{arrivalDate}</div>
            <small className="text-muted">{formatTimeOnly(item.arrival_time)}</small>
          </div>
        );
      },
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
      key: 'created_at',
      title: 'Created At',
      render: (item) => formatCreatedAt(item.created_at)
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