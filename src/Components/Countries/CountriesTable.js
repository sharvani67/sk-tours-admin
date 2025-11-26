import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/countries`);
      const result = await response.json();

      // Sort countries by ID in descending order (newest first)
      const sortedCountries = result.sort((a, b) => {
        // Sort by country_id descending (higher IDs = more recent)
        return b.country_id - a.country_id;
      });

      setCountries(sortedCountries);
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
      key: 'serial_no',
      title: 'Serial No.',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center' }
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
    },
    // {
    //   key: 'created_at',
    //   title: 'Created At',
    //   render: (item) =>
    //     item.created_at
    //       ? new Date(item.created_at).toLocaleDateString('en-US')
    //       : 'N/A'
    // }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Countries</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate('/add-country')}
          >
            + Add Country
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
                initialEntriesPerPage={5}
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