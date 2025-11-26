import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const DestinationsTable = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Destinations
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/destinations`);
      const result = await response.json();

      // Sort destinations by created_at in descending order (newest first)
      const sortedDestinations = Array.isArray(result) 
        ? result.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
            return dateB - dateA; // Descending order (newest first)
          })
        : [];

      // Add serial numbers to the data directly as a fallback
      const destinationsWithSerialNo = sortedDestinations.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));

      setDestinations(destinationsWithSerialNo);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Error fetching destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Define table columns
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        // Multiple fallback methods to ensure serial number is displayed
        if (item.serial_no) return item.serial_no;
        if (index !== undefined) return index + 1;
        return 'N/A';
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'name',
      title: 'Destination Name',
      render: (item) => item.name || "N/A"
    },
    {
      key: 'short_desc',
      title: 'Short Description',
      render: (item) => item.short_desc || "—"
    },
    {
      key: 'country_name',
      title: 'Country',
      render: (item) => item.country_name || "N/A"
    },
    // {
    //   key: 'is_domestic',
    //   title: 'Domestic?',
    //   render: (item) => item.is_domestic ? "Yes" : "No",
    //   style: { textAlign: "center" }
    // },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) => {
        if (!item.created_at) return 'N/A';
        
        try {
          const date = new Date(item.created_at);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            return 'Invalid Date';
          }
          return date.toLocaleDateString('en-US');
        } catch (error) {
          console.error('Error parsing date:', error);
          return 'Invalid Date';
        }
      }
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Destinations</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate('/add-destination')}
          >
            + Add Destination
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
                Loading destinations...
              </div>
            ) : (
              <ReusableTable
                title="Destinations"
                data={destinations}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search destinations..."
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

export default DestinationsTable;