import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
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

      // Sort countries by name in alphabetical order
      const sortedCountries = result.sort((a, b) => {
        // Use localeCompare for proper alphabetical sorting
        return a.name.localeCompare(b.name);
      });

      // Filter for domestic countries only (is_domestic == 1)
      const domesticCountries = sortedCountries.filter(country => 
        country.is_domestic == 1
      );

      setCountries(sortedCountries);
      setFilteredCountries(domesticCountries);
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

  // Handle Delete Country
  const handleDelete = async (countryId) => {
    if (!window.confirm('Are you sure you want to delete this country?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/countries/${countryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Country deleted successfully');
        fetchCountries(); // Refresh the list
      } else {
        alert(result.message || result.error || 'Failed to delete country');
      }
    } catch (err) {
      console.error('Error deleting country:', err);
      alert('Error deleting country. Please try again.');
    }
  };

  // Handle Edit - Navigate to add/edit form with ID
  const handleEdit = (countryId) => {
    navigate(`/add-country/${countryId}`);
  };

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
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.country_id)}
            title="Edit"
          >
            <Pencil />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.country_id)}
            title="Delete"
          >
            <Trash />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    }
  ];

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Domestic Countries</h2>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-country')}
            >
              + Add Domestic Country
            </button>
          </div>
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
                Loading domestic countries...
              </div>
            ) : (
              <ReusableTable
                title="Domestic Countries (is_domestic = 1)"
                data={filteredCountries}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search domestic countries..."
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