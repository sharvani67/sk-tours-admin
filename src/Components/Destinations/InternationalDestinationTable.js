// InternationalDestinationsTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Button } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'react-bootstrap-icons';

const InternationalDestinationsTable = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
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

      // Filter for international destinations only (is_domestic == 0)
      const internationalDestinations = sortedDestinations.filter(destination => 
        destination.is_domestic == 0
      );

      // Add serial numbers to the data directly as a fallback
      const destinationsWithSerialNo = internationalDestinations.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));

      setDestinations(sortedDestinations);
      setFilteredDestinations(destinationsWithSerialNo);
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

  // Handle Delete Destination
  const handleDelete = async (destinationId) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/destinations/${destinationId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Destination deleted successfully');
        fetchDestinations(); // Refresh the list
      } else {
        alert(result.message || result.error || 'Failed to delete destination');
      }
    } catch (err) {
      console.error('Error deleting destination:', err);
      alert('Error deleting destination. Please try again.');
    }
  };

  // Handle Edit - Navigate to international edit form
  const handleEdit = (destinationId) => {
    navigate(`/intl-add-destination/${destinationId}`);
  };

  // Handle Add International Destination
  const handleAdd = () => {
    navigate('/intl-add-destination');
  };

  // Define table columns
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
      title: 'Type',
      render: (item) => "International", // Always international in this component
      style: { textAlign: "center" }
    },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) => {
        if (!item.created_at) return 'N/A';
        
        try {
          const date = new Date(item.created_at);
          if (isNaN(date.getTime())) {
            return 'Invalid Date';
          }
          return date.toLocaleDateString('en-US');
        } catch (error) {
          console.error('Error parsing date:', error);
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
            onClick={() => handleEdit(item.destination_id)}
            title="Edit"
          >
            <Pencil />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.destination_id)}
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
          <h2 className="mb-0">International Destinations</h2>
          <div>
            {/* <Button
              variant="outline-secondary"
              onClick={() => navigate('/destinations')}
              className="me-2"
            >
              View Domestic
            </Button> */}
            <button
              className="btn btn-success"
              onClick={handleAdd}
            >
              + Add International Destination
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
                Loading international destinations...
              </div>
            ) : (
              <ReusableTable
                title="International Destinations (Type: International)"
                data={filteredDestinations}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search international destinations..."
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

export default InternationalDestinationsTable;