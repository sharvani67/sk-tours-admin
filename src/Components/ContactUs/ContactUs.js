// ContactUsTable.js (Alternative Table Version)
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const ContactUsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${baseurl}/api/contact`);
      const result = await response.json();
      const sortedContacts = result.data.sort((a, b) => b.id - a.id);
      setContacts(sortedContacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Error fetching contact data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Columns for ReusableTable
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center' }
    },
    {
      key: 'name',
      title: 'Name',
      render: (item) => item.name || "N/A"
    },
    {
      key: 'email',
      title: 'Email',
      render: (item) => (
        <a href={`mailto:${item.email}`} className="text-decoration-none">
          {item.email}
        </a>
      )
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (item) => item.phone || "N/A"
    },
    {
      key: 'destination',
      title: 'Destination',
      render: (item) => item.destination || "N/A",
      style: { textTransform: 'capitalize' }
    },
    {
      key: 'travel_date',
      title: 'Travel Date',
      render: (item) => 
        item.travel_date ? new Date(item.travel_date).toLocaleDateString('en-US') : 'N/A'
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => (
        <span className={`badge bg-${getStatusColor(item.status)}`}>
          {item.status || 'Unknown'}
        </span>
      )
    },
    {
      key: 'submitted_at',
      title: 'Submitted',
      render: (item) => 
        item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('en-US') : 'N/A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'primary';
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Contact Us Submissions</h2>
          <button
            className="btn btn-primary"
            onClick={fetchContacts}
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
                Loading contact submissions...
              </div>
            ) : (
              <ReusableTable
                title="Contact Submissions"
                data={contacts}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search contacts..."
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

export default ContactUsTable;