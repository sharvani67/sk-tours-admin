import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Destinations
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/destinations`);
      const result = await response.json();

      setDestinations(result); // backend returns rows directly
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
      key: 'destination_id',
      title: 'ID',
      style: { fontWeight: 'bold' }
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
    {
      key: 'is_domestic',
      title: 'Domestic?',
      render: (item) => item.is_domestic ? "Yes" : "No",
      style: { textAlign: "center" }
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Destinations</h2>
          <button
            className="btn btn-primary"
            onClick={fetchDestinations}
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

export default Destinations;
