import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/countries`);
      const result = await response.json();

      // Your API returns rows directly (NOT inside result.success)
      setCountries(result);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Error fetching countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Columns for ReusableTable
  const columns = [
    {
      key: 'country_id',
      title: 'ID',
      style: { fontWeight: 'bold' }
    },
    {
      key: 'name',
      title: 'Country Name',
      render: (item) => item.name || "N/A"
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
          <h2 className="mb-0">Countries List</h2>
          <button
            className="btn btn-primary"
            onClick={fetchCountries}
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
                Loading countries...
              </div>
            ) : (
              <ReusableTable
                title="Countries"
                data={countries}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search countries..."
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

export default Countries;
